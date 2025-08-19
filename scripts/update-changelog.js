#!/usr/bin/env node

/**
 * Simple script to add a new changelog entry
 * Run with: npm run update-changelog [version]
 */

const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Get recent git commits since last tag
 */
function getRecentCommits() {
    try {
        // Get the last tag
        let lastTag;
        try {
            lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
        } catch {
            // No tags found, get all commits
            lastTag = null;
        }

        // Get commits since last tag (or all if no tags)
        const gitCommand = lastTag
            ? `git log ${lastTag}..HEAD --oneline --no-merges`
            : 'git log --oneline --no-merges -10'; // Last 10 commits if no tags

        const commits = execSync(gitCommand, { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(line => line.length > 0)
            .map(line => {
                const [hash, ...messageParts] = line.split(' ');
                return {
                    hash: hash.substring(0, 7),
                    message: messageParts.join(' ')
                };
            });

        return commits;
    } catch (error) {
        console.warn('Could not get git commits:', error.message);
        return [];
    }
}

/**
 * Categorize commits by type
 */
function categorizeCommits(commits) {
    const categories = {
        added: [],
        changed: [],
        fixed: [],
        other: []
    };

    commits.forEach(commit => {
        const message = commit.message.toLowerCase();

        if (message.startsWith('feat') || message.includes('add') || message.includes('new')) {
            categories.added.push(commit);
        } else if (message.startsWith('fix') || message.includes('bug') || message.includes('error')) {
            categories.fixed.push(commit);
        } else if (message.startsWith('refactor') || message.includes('update') || message.includes('change')) {
            categories.changed.push(commit);
        } else {
            categories.other.push(commit);
        }
    });

    return categories;
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(version, categories) {
    const date = new Date().toISOString().split('T')[0];
    let entry = `## [${version}] - ${date}\n\n`;

    if (categories.added.length > 0) {
        entry += '### ✨ Added\n\n';
        categories.added.forEach(commit => {
            entry += `- ${commit.message} (${commit.hash})\n`;
        });
        entry += '\n';
    }

    if (categories.changed.length > 0) {
        entry += '### 🔄 Changed\n\n';
        categories.changed.forEach(commit => {
            entry += `- ${commit.message} (${commit.hash})\n`;
        });
        entry += '\n';
    }

    if (categories.fixed.length > 0) {
        entry += '### 🐛 Fixed\n\n';
        categories.fixed.forEach(commit => {
            entry += `- ${commit.message} (${commit.hash})\n`;
        });
        entry += '\n';
    }

    if (categories.other.length > 0) {
        entry += '### 🔧 Other\n\n';
        categories.other.forEach(commit => {
            entry += `- ${commit.message} (${commit.hash})\n`;
        });
        entry += '\n';
    }

    return entry;
}

/**
 * Update CHANGELOG.md with new entry
 */
function updateChangelog(version) {
    const changelogPath = 'CHANGELOG.md';

    if (!fs.existsSync(changelogPath)) {
        console.error('CHANGELOG.md not found');
        process.exit(1);
    }

    // Get recent commits
    console.log('Getting recent commits...');
    const commits = getRecentCommits();

    if (commits.length === 0) {
        console.log('No new commits found');
        return;
    }

    console.log(`Found ${commits.length} commits`);

    // Categorize commits
    const categories = categorizeCommits(commits);

    // Generate new entry
    const newEntry = generateChangelogEntry(version, categories);

    // Read current changelog
    const changelog = fs.readFileSync(changelogPath, 'utf8');

    // Find where to insert (after the header, before first version)
    const insertPoint = changelog.indexOf('\n## [');
    if (insertPoint === -1) {
        console.error('Could not find insertion point in CHANGELOG.md');
        process.exit(1);
    }

    // Insert new entry
    const newChangelog = changelog.substring(0, insertPoint) +
        '\n' + newEntry +
        changelog.substring(insertPoint);

    // Write back to file
    fs.writeFileSync(changelogPath, newChangelog);

    console.log(`✅ Added changelog entry for version ${version}`);
    console.log('\nPreview:');
    console.log(newEntry);
}

// Get version from command line or package.json
function getVersion() {
    const args = process.argv.slice(2);

    if (args.length > 0) {
        return args[0];
    }

    // Try to get from package.json
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return packageJson.version;
    } catch {
        return 'Unreleased';
    }
}

// Run the update
if (require.main === module) {
    const version = getVersion();
    updateChangelog(version);
}

module.exports = { updateChangelog };