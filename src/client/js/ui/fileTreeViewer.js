/**
 * FileTreeViewer - GitHub-style file tree for MD documents
 * Integrates with the GGcode help system to show markdown files in a tree structure
 */
class FileTreeViewer {
  constructor(container) {
    this.container = container;
    this.currentFile = null;
    this.treeData = {};
    this.markdownContent = {};

    this.initializeAsync();
  }

  /**
   * Initialize asynchronously to avoid timing issues
   */
  async initializeAsync() {
    await this.initialize();
  }

  /**
   * Initialize the file tree viewer
   */
  async initialize() {
    console.log('FileTreeViewer: Starting initialization');
    await this.scanMarkdownFiles();
    this.createTreeStructure();
    this.render();
    this.bindEvents();
    console.log('FileTreeViewer: Initialization complete');
  }

  /**
   * Scan for available Markdown files
   */
  async scanMarkdownFiles() {
    try {
      // Get markdown files from the help content directory
      const response = await fetch('/api/help/markdown-files');
      const data = await response.json();

      if (data.success && data.files) {
        this.markdownFiles = data.files;
        await this.loadMarkdownContent();
      }
    } catch (error) {
      console.error('Error scanning for markdown files:', error);
      // Fallback: use static file list
      this.markdownFiles = [
        { path: 'README.md', name: 'README.md', type: 'file' },
        {
          path: 'MULTILANGUAGE_GUIDE.md',
          name: 'MULTILANGUAGE_GUIDE.md',
          type: 'file',
        },
      ];
      await this.loadMarkdownContent();
    }
  }

  /**
   * Load markdown content for all files
   */
  async loadMarkdownContent() {
    for (const file of this.markdownFiles) {
      if (file.type === 'file') {
        try {
          const response = await fetch(
            `/api/help/markdown-content?file=${encodeURIComponent(file.path)}`
          );
          const data = await response.json();
          if (data.success) {
            this.markdownContent[file.path] = data.content;
          }
        } catch (error) {
          console.error(`Error loading content for ${file.path}:`, error);
        }
      }
    }
  }

  /**
   * Create file tree data structure
   */
  createTreeStructure() {
    const tree = {};

    this.markdownFiles.forEach((file) => {
      if (file.type === 'file') {
        const pathParts = file.path.split('/');
        let current = tree;

        pathParts.forEach((part, index) => {
          if (!current[part]) {
            current[part] = {
              type: index === pathParts.length - 1 ? 'file' : 'folder',
              path: pathParts.slice(0, index + 1).join('/'),
              children: index === pathParts.length - 1 ? null : {},
            };
          }
          if (current[part].type === 'folder') {
            current = current[part].children;
          }
        });
      }
    });

    this.treeData = tree;
  }

  /**
   * Render the file tree
   */
  render() {
    const html = `
        <div class="file-tree-content">
          ${this.renderTreeNode(this.treeData, '', 0)}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Render a single tree node recursively
   */
  renderTreeNode(node, path, level) {
    if (!node || typeof node !== 'object') return '';

    let html = '<ul class="tree-node-list">';

    Object.keys(node).forEach((key) => {
      const item = node[key];
      const itemPath = path ? `${path}/${key}` : key;
      const indentation = level * 16;

      if (item.type === 'file') {
        html += `
          <li class="tree-node file-node ${this.currentFile === itemPath ? 'active' : ''}"
              data-path="${itemPath}"
              data-type="file"
              style="padding-left: ${indentation}px;">
            <div class="node-content">
              <span class="file-icon">📄</span>
              <span class="file-name">${key}</span>
            </div>
          </li>
        `;
      } else if (item.type === 'folder') {
        const isExpanded = this.isExpanded(itemPath);
        html += `
          <li class="tree-node folder-node"
              data-path="${itemPath}"
              data-type="folder"
              style="padding-left: ${indentation}px;">
            <div class="node-content">
              <span class="expand-icon ${isExpanded ? 'expanded' : ''}">
                ${isExpanded ? '📂' : '📁'}
              </span>
              <span class="folder-name">${key}</span>
            </div>
            ${isExpanded ? this.renderTreeNode(item.children, itemPath, level + 1) : ''}
          </li>
        `;
      }
    });

    html += '</ul>';
    return html;
  }

  /**
   * Check if a folder is expanded
   */
  isExpanded(path) {
    return this.expandedFolders && this.expandedFolders.has(path);
  }

  /**
   * Toggle folder expansion
   */
  toggleFolder(path) {
    if (!this.expandedFolders) {
      this.expandedFolders = new Set();
    }

    if (this.expandedFolders.has(path)) {
      this.expandedFolders.delete(path);
    } else {
      this.expandedFolders.add(path);
    }

    this.render();
  }

  /**
   * Select a file for viewing
   */
  selectFile(path) {
    this.currentFile = path;

    // Update the displayed file
    this.updateDisplayedFile(path);

    // Update the UI
    this.render();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const node = e.target.closest('.tree-node');
      if (!node) return;

      const path = node.dataset.path;
      const type = node.dataset.type;

      if (type === 'folder') {
        this.toggleFolder(path);
      } else if (type === 'file') {
        this.selectFile(path);
      }
    });

    // Refresh button
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.refresh-btn')) {
        this.refresh();
      }
    });
  }

  /**
   * Copy file content to clipboard
   */
  async copyFileContent() {
    if (!this.currentFile || !this.markdownContent[this.currentFile]) return;

    try {
      await navigator.clipboard.writeText(
        this.markdownContent[this.currentFile]
      );
      // Could add a toast notification here
    } catch (error) {
      console.error('Error copying content:', error);
    }
  }

  /**
   * Refresh the file tree
   */
  async refresh() {
    this.treeData = {};
    this.markdownContent = {};
    this.currentFile = null;
    await this.scanMarkdownFiles();
    this.createTreeStructure();
    this.render();
  }

  /**
   * Load a file and display it in the content area
   */
  async loadAndDisplayFile(filePath) {
    try {
      console.log('FileTreeViewer: Loading file:', filePath);

      // Fetch file content from API
      const response = await fetch(
        `/api/help/markdown-content?file=${encodeURIComponent(filePath)}`
      );
      const data = await response.json();

      if (data.success && data.content) {
        // Display the file content
        this.displayFileContent(filePath, data.content);

        // Switch to MD file view mode
        this.triggerViewModeChange('file');
      } else {
        console.error('Failed to load file content:', data.error);
        this.displayFileContent(filePath, 'Failed to load file content.');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      this.displayFileContent(filePath, 'Error loading file.');
    }
  }

  /**
   * Display file content in the appropriate area
   */
  displayFileContent(filePath, content) {
    const titleElement = document.getElementById('currentFileTitle');
    const contentElement = document.getElementById('mdContentBody');

    if (titleElement) {
      // Extract just the filename from the path
      const fileName = filePath.split('/').pop();
      titleElement.textContent = fileName;
    }

    if (contentElement) {
      // Simple markdown-like rendering (basic)
      const renderedHtml = this.renderMarkdownContent(content);
      contentElement.innerHTML = renderedHtml;
    } else {
      console.warn('FileTreeViewer: mdContentBody not found');
    }
  }

  /**
   * Basic markdown rendering
   */
  renderMarkdownContent(content) {
    if (!content) return '<p>No content available.</p>';

    return content
      .split('\n')
      .map((line) => {
        // Headers
        if (line.startsWith('# ')) {
          return `<h1>${line.substring(2)}</h1>`;
        } else if (line.startsWith('## ')) {
          return `<h2>${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
          return `<h3>${line.substring(4)}</h3>`;
        }
        // Empty lines
        else if (line.trim() === '') {
          return '<br>';
        }
        // Regular paragraphs
        else {
          return `<p>${line}</p>`;
        }
      })
      .join('');
  }

  /**
   * Update displayed file in the content area
   */
  async updateDisplayedFile(filePath) {
    try {
      // Fetch file content
      const response = await fetch(
        `/api/help/markdown-content?file=${encodeURIComponent(filePath)}`
      );
      const data = await response.json();

      if (data.success && data.content) {
        // Use HelpSystem to update the display
        if (window.applicationManager && window.applicationManager.helpSystem) {
          window.applicationManager.helpSystem.showMarkdownFile(
            filePath,
            data.content
          );
        } else {
          // Fallback: update directly
          const mdContentBody = document.getElementById('mdContentBody');
          const fileNameSpan = document.getElementById('fileName');

          if (fileNameSpan) {
            fileNameSpan.textContent = filePath.split('/').pop();
          }

          if (mdContentBody) {
            mdContentBody.textContent = data.content;
          }
        }
      } else {
        console.error('Failed to load file:', filePath);
      }
    } catch (error) {
      console.error('Error loading file:', error);
    }
  }
}

export default FileTreeViewer;
