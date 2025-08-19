#!/usr/bin/env node

/**
 * Simple script to update the project structure section in README.md
 * Run with: npm run update-structure
 */

const fs = require('fs');
const path = require('path');

// Directories to ignore
const IGNORE_DIRS = [
    'node_modules', '.git', '.kiro', 'coverage', 'dist', 'build',
    '.nyc_output', '.vscode', '.idea', 'logs', 'tmp', 'temp'
];

// Files to ignore
const IGNORE_FILES = [
    '.DS_Store', 'Thumbs.db', '.gitkeep', '.eslintcache',
    'npm-debug.log', 'yarn-error.log', '.env', '.env.local'
];

/**
 * Generate directory tree structure
 */
function generateTree(dir, prefix = '', maxDepth = 4, currentDepth = 0) {
    if (currentDepth >= maxDepth) return '';

    let tree = '';

    try {
        const items = fs.readdirSync(dir)
            .filter(item => !IGNORE_DIRS.includes(item) && !IGNORE_FILES.includes(item))
            .sort((a, b) => {
                const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
                const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();

                // Directories first, then files
                if (aIsDir && !bIsDir) return -1;
                if (!aIsDir && bIsDir) return 1;
                return a.localeCompare(b);
            });

        items.forEach((item, index) => {
            const itemPath = path.join(dir, item);
            const isLast = index === items.length - 1;
            const isDirectory = fs.statSync(itemPath).isDirectory();

            const connector = isLast ? '└── ' : '├── ';
            const nextPrefix = prefix + (isLast ? '    ' : '│   ');

            // Add description for key directories
            let description = '';
            if (currentDepth === 0) {
                const descriptions = {
                    'src': '# Source code',
                    'tests': '# Test suite',
                    'views': '# EJS templates',
                    'public': '# Static assets (legacy)',
                    'GGCODE': '# Example files',
                    'docs': '# Documentation',
                    'scripts': '# Build and utility scripts',
                    '.github': '# GitHub workflows'
                };
                description = descriptions[item] || '';
            } else if (currentDepth === 1 && dir.includes('src')) {
                const descriptions = {
                    'client': '# Client-side code (ES6 modules)',
                    'server': '# Server-side code (CommonJS)'
                };
                description = descriptions[item] || '';
            }

            tree += `${prefix}${connector}${item}${isDirectory ? '/' : ''}${description ? ` ${description}` : ''}\n`;

            if (isDirectory) {
                tree += generateTree(itemPath, nextPrefix, maxDepth, currentDepth + 1);
            }
        });
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dir}`);
    }

    return tree;
}

/**
 * Update README.md with new project structure
 */
function updateReadmeStructure() {
    const readmePath = 'README.md';

    if (!fs.existsSync(readmePath)) {
        console.error('README.md not found');
        process.exit(1);
    }

    const readme = fs.readFileSync(readmePath, 'utf8');

    // Find the project structure section
    const structureStart = readme.indexOf('## 📁 Project Structure');
    if (structureStart === -1) {
        console.error('Project Structure section not found in README.md');
        process.exit(1);
    }

    // Find the end of the structure section (next ## heading)
    const structureEnd = readme.indexOf('\n## ', structureStart + 1);
    if (structureEnd === -1) {
        console.error('Could not find end of Project Structure section');
        process.exit(1);
    }

    // Generate new structure
    console.log('Generating project structure...');
    const newStructure = generateTree('.', '', 4, 0);

    // Create the new section content
    const newSection = `## 📁 Project Structure

\`\`\`
${newStructure.trim()}
\`\`\`

`;

    // Replace the section
    const newReadme = readme.substring(0, structureStart) +
        newSection +
        readme.substring(structureEnd);

    // Write back to file
    fs.writeFileSync(readmePath, newReadme);

    console.log('✅ Project structure updated in README.md');
}

// Run the update
if (require.main === module) {
    updateReadmeStructure();
}

module.exports = { updateReadmeStructure };