const FileManagerService = require('../../../src/server/services/fileManager');
const { testData } = require('../../utils/testHelpers');

// Mock fs modules
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
    access: jest.fn(),
    stat: jest.fn(),
  },
  existsSync: jest.fn(),
}));

// Mock path module
jest.mock('path', () => ({
  resolve: jest.fn((...args) => args.join('/')),
  join: jest.fn((...args) => args.join('/')),
}));

describe('FileManagerService', () => {
  let fileManagerService;
  let mockFs;
  let mockFsSync;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFs = require('fs').promises;
    mockFsSync = require('fs');
    
    // Default mock implementations
    mockFsSync.existsSync.mockReturnValue(true);
    mockFs.readdir.mockResolvedValue(['example1.ggcode', 'example2.ggcode', 'readme.txt']);
    
    fileManagerService = new FileManagerService('/mock/base/dir');
  });

  describe('constructor', () => {
    test('should initialize with default base directory', () => {
      const service = new FileManagerService();
      expect(service.baseDir).toBeDefined();
      expect(service.examplesDir).toBeDefined();
    });

    test('should initialize with custom base directory', () => {
      const customDir = '/custom/base/dir';
      const service = new FileManagerService(customDir);
      expect(service.baseDir).toBe(customDir);
    });
  });

  describe('getExamples', () => {
    test('should return list of example files with metadata', async () => {
      const mockFileContent = '// Simple square pattern\nG0 X0 Y0\nG1 X10 Y0\nG1 X10 Y10';
      mockFs.readFile.mockResolvedValue(mockFileContent);
      
      const examples = await fileManagerService.getExamples();
      
      expect(examples).toHaveLength(2);
      expect(examples[0]).toEqual({
        name: 'example1.ggcode',
        description: 'Simple square pattern',
        preview: expect.stringContaining('G0 X0 Y0'),
        category: expect.any(String),
      });
    });

    test('should throw error if examples directory does not exist', async () => {
      mockFsSync.existsSync.mockReturnValue(false);
      
      await expect(fileManagerService.getExamples()).rejects.toThrow('Examples directory not found');
    });

    test('should handle file read errors gracefully', async () => {
      mockFs.readFile.mockRejectedValueOnce(new Error('Permission denied'));
      mockFs.readFile.mockResolvedValueOnce('// Valid file content\nG0 X0 Y0');
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const examples = await fileManagerService.getExamples();
      
      expect(examples).toHaveLength(2);
      expect(examples[0]).toEqual({
        name: 'example1.ggcode',
        description: 'Failed to load description',
        preview: 'Error loading preview',
        category: 'unknown',
      });
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should filter only .ggcode files', async () => {
      mockFs.readdir.mockResolvedValue(['test.ggcode', 'readme.txt', 'config.json', 'another.ggcode']);
      mockFs.readFile.mockResolvedValue('// Test content\nG0 X0 Y0');
      
      const examples = await fileManagerService.getExamples();
      
      expect(examples).toHaveLength(2);
      expect(examples.every(ex => ex.name.endsWith('.ggcode'))).toBe(true);
    });

    test('should handle readdir errors', async () => {
      mockFs.readdir.mockRejectedValue(new Error('Access denied'));
      
      await expect(fileManagerService.getExamples()).rejects.toThrow('Failed to load examples');
    });
  });

  describe('getExampleContent', () => {
    test('should return file content for valid filename', async () => {
      const expectedContent = 'G0 X0 Y0\nG1 X10 Y10';
      mockFs.readFile.mockResolvedValue(expectedContent);
      
      const content = await fileManagerService.getExampleContent('test.ggcode');
      
      expect(content).toBe(expectedContent);
      expect(mockFs.readFile).toHaveBeenCalledWith('/mock/base/dir/GGCODE/test.ggcode', 'utf8');
    });

    test('should throw error for invalid filename', async () => {
      await expect(fileManagerService.getExampleContent('')).rejects.toThrow('Invalid filename');
      await expect(fileManagerService.getExampleContent(null)).rejects.toThrow('Invalid filename');
      await expect(fileManagerService.getExampleContent(123)).rejects.toThrow('Invalid filename');
    });

    test('should prevent directory traversal attacks', async () => {
      const maliciousFilenames = [
        '../../../etc/passwd',
        'test/../../../secret.txt',
        'test\\..\\..\\secret.txt',
        'test/subdir/file.ggcode',
      ];
      
      for (const filename of maliciousFilenames) {
        await expect(fileManagerService.getExampleContent(filename))
          .rejects.toThrow('path traversal not allowed');
      }
    });

    test('should throw error if file does not exist', async () => {
      mockFsSync.existsSync.mockReturnValue(false);
      
      await expect(fileManagerService.getExampleContent('nonexistent.ggcode'))
        .rejects.toThrow('File not found');
    });

    test('should handle file read errors', async () => {
      mockFs.readFile.mockRejectedValue(new Error('Permission denied'));
      
      await expect(fileManagerService.getExampleContent('test.ggcode'))
        .rejects.toThrow('Failed to load example content');
    });
  });

  describe('getExampleCategories', () => {
    test('should return unique categories from examples', async () => {
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath.includes('gear')) {
          return Promise.resolve('// Gear pattern\nG0 X0 Y0');
        } else if (filePath.includes('spiral')) {
          return Promise.resolve('// Spiral pattern\nG0 X0 Y0');
        }
        return Promise.resolve('// Basic pattern\nG0 X0 Y0');
      });
      
      mockFs.readdir.mockResolvedValue(['gear.ggcode', 'spiral.ggcode', 'basic.ggcode']);
      
      const categories = await fileManagerService.getExampleCategories();
      
      expect(categories).toContain('mechanical');
      expect(categories).toContain('patterns');
      expect(categories).toContain('basic');
      expect(categories).not.toContain('unknown');
    });

    test('should handle getExamples errors', async () => {
      mockFsSync.existsSync.mockReturnValue(false);
      
      await expect(fileManagerService.getExampleCategories())
        .rejects.toThrow('Failed to load categories');
    });
  });

  describe('_parseExampleMetadata', () => {
    test('should extract description from first comment', () => {
      const content = '// This is a test pattern\nG0 X0 Y0\nG1 X10 Y10';
      const metadata = fileManagerService._parseExampleMetadata('test.ggcode', content);
      
      expect(metadata.description).toBe('This is a test pattern');
    });

    test('should handle files without comments', () => {
      const content = 'G0 X0 Y0\nG1 X10 Y10';
      const metadata = fileManagerService._parseExampleMetadata('test.ggcode', content);
      
      expect(metadata.description).toBe('No description available');
    });

    test('should create preview from first few lines', () => {
      const content = 'G0 X0 Y0\nG1 X10 Y10\nG1 X20 Y20\nG1 X30 Y30';
      const metadata = fileManagerService._parseExampleMetadata('test.ggcode', content);
      
      expect(metadata.preview).toContain('G0 X0 Y0');
      expect(metadata.preview).toContain('G1 X10 Y10');
    });

    test('should categorize files based on filename', () => {
      const testCases = [
        { filename: 'gear_test.ggcode', expectedCategory: 'mechanical' },
        { filename: 'spiral_pattern.ggcode', expectedCategory: 'patterns' },
        { filename: 'flower_design.ggcode', expectedCategory: 'artistic' },
        { filename: 'rose_pattern.ggcode', expectedCategory: 'artistic' },
        { filename: 'basic_square.ggcode', expectedCategory: 'basic' },
        { filename: 'simple_test.ggcode', expectedCategory: 'basic' },
        { filename: 'random_file.ggcode', expectedCategory: 'general' },
      ];
      
      testCases.forEach(({ filename, expectedCategory }) => {
        const metadata = fileManagerService._parseExampleMetadata(filename, 'G0 X0 Y0');
        expect(metadata.category).toBe(expectedCategory);
      });
    });

    test('should truncate long previews', () => {
      const longContent = 'G0 X0 Y0\n'.repeat(50); // Very long content
      const metadata = fileManagerService._parseExampleMetadata('test.ggcode', longContent);
      
      expect(metadata.preview.length).toBeLessThanOrEqual(103); // 100 chars + '...'
      expect(metadata.preview).toMatch(/\.\.\.$/);
    });
  });

  describe('fileExists', () => {
    test('should return true for existing files', async () => {
      mockFs.access.mockResolvedValue();
      
      const exists = await fileManagerService.fileExists('test.ggcode');
      
      expect(exists).toBe(true);
    });

    test('should return false for non-existing files', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'));
      
      const exists = await fileManagerService.fileExists('nonexistent.ggcode');
      
      expect(exists).toBe(false);
    });
  });

  describe('getFileStats', () => {
    test('should return file statistics', async () => {
      const mockStats = {
        size: 1024,
        birthtime: new Date('2023-01-01'),
        mtime: new Date('2023-01-02'),
        isFile: () => true,
      };
      mockFs.stat.mockResolvedValue(mockStats);
      
      const stats = await fileManagerService.getFileStats('test.ggcode');
      
      expect(stats).toEqual({
        size: 1024,
        created: mockStats.birthtime,
        modified: mockStats.mtime,
        isFile: true,
      });
    });

    test('should handle stat errors', async () => {
      mockFs.stat.mockRejectedValue(new Error('Permission denied'));
      
      await expect(fileManagerService.getFileStats('test.ggcode'))
        .rejects.toThrow('Failed to get file stats');
    });
  });
});