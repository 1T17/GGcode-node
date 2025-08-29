/**
 * Help System Module
 * Manages help content, search, and language selection
 */

import storageManager from '../utils/storageManager.js';
import FileTreeViewer from './fileTreeViewer.js';

class HelpSystem {
  constructor(apiManager) {
    this.apiManager = apiManager;
    this.dictionaryCache = null;
    this.annotationsCache = null;
    this.fileTreeViewer = null;
  }

  /**
   * Show help modal
   */
  async showHelp() {
    if (window.showModal) {
      window.showModal('helpModal');
    }

    // Get saved language preference or default to English
    const savedLanguage = storageManager.getSelectedLanguage();

    // Load help content when modal opens
    this.loadHelpContent(savedLanguage);
    // Setup language selector
    await this.setupLanguageSelector();

    // Initialize language dropdown display from saved preference
    this.initializeLanguageSelectorDisplay();

    // Add copy buttons after modal is shown
    setTimeout(() => this.addCopyButtons(), 200);
    // Setup help search
    this.setupHelpSearch();

    // Load dictionary data for integration
    this.loadMillDictionaryData();

    // Initialize file tree viewer
    this.initializeFileTreeViewer();

    // Initialize documentation controls
    this.initializeDocumentationControls();

    // Focus search input
    setTimeout(() => {
      const searchInput = document.getElementById('helpSearchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }, 200);
  }

  /**
   * Load help content
   */
  async loadHelpContent(language = 'en') {
    const helpContent = document.getElementById('helpContent');
    if (!helpContent) return;

    try {
      // Show loading indicator
      helpContent.innerHTML =
        '<div class="loading-indicator"><p>Loading help content...</p></div>';

      const result = await this.apiManager.help.getContent(language);

      if (result && result.data) {
        this.renderHelpContent(result.data);
      } else {
        helpContent.innerHTML =
          '<div class="error-message"><p>Failed to load help content</p></div>';
      }
    } catch (error) {
      helpContent.innerHTML =
        '<div class="error-message"><p>Error loading help content: ' +
        error.message +
        '</p></div>';
    }
  }

  /**
   * Render help content
   */
  renderHelpContent(data) {
    const helpContent = document.getElementById('helpContent');
    if (!helpContent || !data || !data.sections) {
      console.error('Invalid help content data or missing container');
      return;
    }

    let html = '';

    // Render each section
    Object.values(data.sections).forEach((section) => {
      html += `<div class="help-section-card" data-section="${section.id}">`;
      html += `<h3 class="help-section-title">${section.title}</h3>`;
      html += `<div class="help-section-content">`;

      // Render section content
      if (section.content && Array.isArray(section.content)) {
        section.content.forEach((item) => {
          switch (item.type) {
            case 'paragraph':
              html += `<p>${item.text}</p>`;
              break;

            case 'subsection':
              html += `<h4>${item.title}</h4>`;
              if (item.description) {
                html += `<p>${item.description}</p>`;
              }
              if (item.additionalInfo) {
                html += `<p>${item.additionalInfo}</p>`;
              }
              if (item.code) {
                html += `<pre><code>${item.code}</code></pre>`;
              }
              if (item.list) {
                html += `<ul>`;
                item.list.forEach((listItem) => {
                  html += `<li>${listItem}</li>`;
                });
                html += `</ul>`;
              }
              break;

            case 'list':
              if (item.title) {
                html += `<h4>${item.title}</h4>`;
              }
              if (item.description) {
                html += `<p>${item.description}</p>`;
              }
              html += `<ul>`;
              item.items.forEach((listItem) => {
                html += `<li>${listItem}</li>`;
              });
              html += `</ul>`;
              break;

            case 'code':
              html += `<pre><code>${item.code}</code></pre>`;
              break;

            default:
              console.warn('Unknown help content type:', item.type);
          }
        });
      }

      html += `</div>`;
      html += `</div>`;
    });

    helpContent.innerHTML = html;

    // Add copy buttons to code blocks after rendering
    setTimeout(() => this.addCopyButtons(), 100);
  }

  /**
   * Setup language selector - dropdown logic handled by main dropdown system
   */
  async setupLanguageSelector() {
    // Language dropdown is handled by the centralized dropdown system in main.js
    // This method is kept for backward compatibility
    console.log(
      'Language selector setup delegated to centralized dropdown system'
    );
  }

  /**
   * Initialize language selector display with saved preference
   */
  initializeLanguageSelectorDisplay() {
    const savedLanguage = storageManager.getSelectedLanguage();
    const selectSelected = document.getElementById('selectSelected');

    if (!selectSelected || !savedLanguage || savedLanguage === 'en') {
      return; // Already shows English (default)
    }

    // Find the corresponding language option to get its display information
    const languageMap = {
      es: { flag: '🇪🇸', name: 'Español' },
      fr: { flag: '🇫🇷', name: 'Français' },
      de: { flag: '🇩🇪', name: 'Deutsch' },
      it: { flag: '🇮🇹', name: 'Italiano' },
      pt: { flag: '🇵🇹', name: 'Português' },
      ru: { flag: '🇷🇺', name: 'Русский' },
      zh: { flag: '🇨🇳', name: '中文' },
      ja: { flag: '🇯🇵', name: '日本語' },
      ko: { flag: '🇰🇷', name: '한국어' },
      ar: { flag: '🇸🇦', name: 'العربية' },
      he: { flag: '🇮🇱', name: 'עברית' },
      tr: { flag: '🇹🇷', name: 'Türkçe' },
      pl: { flag: '🇵🇱', name: 'Polski' },
      nl: { flag: '🇳🇱', name: 'Nederlands' },
    };

    const selectedLanguageInfo = languageMap[savedLanguage];
    if (selectedLanguageInfo) {
      selectSelected.innerHTML = `
                <span class="flag-icon flag-${savedLanguage}">${selectedLanguageInfo.flag}</span>
                <span class="language-name">${selectedLanguageInfo.name}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="#10a37f">
                    <path d="M4.427 6.427L8 10l3.573-3.573L10.354 5 8 7.354 5.646 5z" />
                </svg>
            `;
      console.log(
        `HelpSystem: Language selector updated to show ${selectedLanguageInfo.name} (${savedLanguage})`
      );
    }
  }

  /**
   * Load mill dictionary and annotations data for enhanced G-code completion
   */
  async loadMillDictionaryData() {
    try {
      // Load dictionary data
      if (!this.dictionaryCache) {
        const dictionaryResponse = await fetch('/mill-dictionary.json');
        if (dictionaryResponse.ok) {
          this.dictionaryCache = await dictionaryResponse.json();
          console.log(
            'HelpSystem: Mill dictionary loaded with',
            Object.keys(this.dictionaryCache).length,
            'commands'
          );
        } else {
          console.warn('HelpSystem: Could not load mill-dictionary.json');
        }
      }

      // Load annotations data
      if (!this.annotationsCache) {
        const annotationsResponse = await fetch('/mill-annotations.json');
        if (annotationsResponse.ok) {
          const annotationsJson = await annotationsResponse.json();
          this.annotationsCache = annotationsJson;
          console.log(
            'HelpSystem: Mill annotations loaded with',
            Object.keys(this.annotationsCache).length,
            'entries'
          );
        } else {
          console.warn('HelpSystem: Could not load mill-annotations.json');
        }
      }

      // Integrate dictionary data with Monaco completion
      this.integrateMillDictionaryWithMonaco();
    } catch (error) {
      console.warn(
        'HelpSystem: Failed to load mill dictionary data:',
        error.message
      );
    }
  }

  /**
   * Integrate mill dictionary data with Monaco auto-completion
   */
  integrateMillDictionaryWithMonaco() {
    if (!this.dictionaryCache) {
      console.warn(
        'HelpSystem: No dictionary cache available for Monaco integration'
      );
      return;
    }

    // Get Monaco editor instance
    const editor = window.editorManager?.getEditors?.()?.input;
    if (!editor) {
      console.warn(
        'HelpSystem: Monaco editor not available for dictionary integration'
      );
      return;
    }

    // Create comprehensive G-code completions from dictionary data
    const millCompletions = this.convertDictionaryToCompletions(
      this.dictionaryCache
    );

    // Update existing completion provider with mill data
    console.log(
      `HelpSystem: Enhanced Monaco completion with ${millCompletions.length} official G-code definitions`
    );

    // Note: The actual integration happens in MonacoEditorManager,
    // we can signal it to refresh its completions or use the existing system
    this.signalCompletionRefresh();
  }

  /**
   * Convert dictionary JSON to Monaco completion items
   */
  convertDictionaryToCompletions(dictionary) {
    const completions = [];

    for (const [gcode, definition] of Object.entries(dictionary)) {
      let description = definition.desc || 'G-code command';
      let detail = gcode;
      let usage = '';

      // Handle different dictionary formats
      if (definition.sub) {
        // Create usage string from parameters
        const params = Object.keys(definition.sub).join(' ');
        usage = `${gcode} ${params}`;
        detail = usage;
      } else if (typeof definition === 'string') {
        description = definition;
      }

      completions.push({
        label: gcode,
        kind: monaco.languages.CompletionItemKind.Keyword,
        detail: detail,
        documentation: {
          value: `**${gcode}** - ${description}\n\nUsage: \`${usage || gcode}\``,
        },
        insertText: gcode,
        sortText: gcode.startsWith('G') ? `01${gcode}` : `02${gcode}`,
      });
    }

    return completions;
  }

  /**
   * Signal that completions should be refreshed with mill dictionary data
   */
  signalCompletionRefresh() {
    console.log(
      'HelpSystem: Signaling completion refresh with mill dictionary integration'
    );

    // The MonacoEditorManager completion provider will automatically use the dictionary data
    // since it checks for this.helpSystem?.dictionaryCache and this.helpSystem?.annotationsCache
    // in _getMillDictionaryCompletions and _getMillAnnotationsCompletions methods
    console.log(
      'HelpSystem: Mill dictionary data loaded and available for completion provider'
    );
    console.log(
      `Dictionary entries: ${Object.keys(this.dictionaryCache || {}).length}`
    );
    console.log(
      `Annotations entries: ${Object.keys(this.annotationsCache || {}).length}`
    );
  }

  /**
   * Add copy buttons to code blocks
   */
  addCopyButtons() {
    const preElements = document.querySelectorAll(
      '.help-content pre, #helpContent pre'
    );
    preElements.forEach((pre) => {
      // Check if copy button already exists
      if (pre.querySelector('.copy-button')) return;

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                background: #007acc;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 12px;
                cursor: pointer;
                z-index: 1;
            `;

      // Make pre element relative for absolute positioning
      pre.style.position = 'relative';

      copyButton.onclick = () => {
        const code = pre.textContent.replace('Copy', '').trim();
        navigator.clipboard
          .writeText(code)
          .then(() => {
            copyButton.textContent = 'Copied!';
            copyButton.style.background = '#28a745';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.style.background = '#007acc';
            }, 2000);
          })
          .catch((err) => {
            console.error('Failed to copy: ', err);
            copyButton.textContent = 'Error';
            copyButton.style.background = '#dc3545';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.style.background = '#007acc';
            }, 2000);
          });
      };

      pre.appendChild(copyButton);
    });
  }

  /**
   * Setup help search
   */
  setupHelpSearch() {
    const searchInput = document.getElementById('helpSearchInput');
    if (!searchInput) {
      console.warn('Help search input not found');
      return;
    }

    // Store original content for search reset
    this.originalSections =
      this.originalSections ||
      Array.from(document.querySelectorAll('.help-section-card'));

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      if (searchTerm === '') {
        // Reset to show all sections
        this.showAllSections();
        this.removeAllHighlights();
      } else {
        // Perform search
        this.performSearch(searchTerm);
      }
    });

    console.log('Help search functionality initialized');

    // Add clear search button
    this.addClearSearchButton(searchInput);

    // Add CSS for search highlights
    this.addSearchHighlightStyles();
  }

  /**
   * Add clear search button
   */
  addClearSearchButton(searchInput) {
    // Create clear button
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = '✕';
    clearButton.title = 'Clear search';
    clearButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 14px;
            padding: 2px;
            display: none;
        `;

    // Style on hover
    clearButton.addEventListener('mouseenter', () => {
      clearButton.style.color = '#ff4444';
    });
    clearButton.addEventListener('mouseleave', () => {
      clearButton.style.color = '#666';
    });

    // Add click handler
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.focus();
    });

    // Position the search input as relative for absolute positioning
    searchInput.style.position = 'relative';
    searchInput.parentNode.appendChild(clearButton);

    // Show/hide clear button based on input value
    searchInput.addEventListener('input', () => {
      clearButton.style.display = searchInput.value.trim() ? 'block' : 'none';
    });
  }

  /**
   * Add CSS styles for search highlights
   */
  addSearchHighlightStyles() {
    if (document.getElementById('help-search-styles')) return;

    const style = document.createElement('style');
    style.id = 'help-search-styles';
    style.textContent = `
            .search-highlight {
                background-color: #ffeb3b !important;
                color: #000 !important;
                padding: 2px 1px;
                border-radius: 2px;
                font-weight: bold;
                box-shadow: 0 0 0 1px rgba(255, 193, 7, 0.3);
            }

            #help-no-results {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                margin: 20px 0;
            }

            .help-section-card {
                transition: opacity 0.3s ease;
            }

            .help-section-card[style*="display: none"] {
                opacity: 0.3;
            }
        `;

    document.head.appendChild(style);
  }

  /**
   * Perform search across help sections with intelligent matching
   */
  performSearch(searchTerm) {
    const helpSections = document.querySelectorAll('.help-section-card');
    let hasVisibleResults = false;

    // Split search term into keywords for better matching
    const keywords = searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((k) => k.length > 0);
    const originalSearchTerm = searchTerm.toLowerCase().trim();

    console.log('Searching for:', originalSearchTerm, 'Keywords:', keywords);

    helpSections.forEach((section) => {
      const sectionText = section.textContent.toLowerCase();
      const titleElement = section.querySelector('.help-section-title');
      const title = titleElement ? titleElement.textContent.toLowerCase() : '';

      // Calculate relevance score
      let relevanceScore = 0;
      let matchesAnyKeyword = false;

      // Check each keyword - highlight ALL characters including single ones
      keywords.forEach((keyword) => {
        // Exact matches get higher score
        if (title.includes(keyword)) {
          relevanceScore += 10; // Title matches are very important
          matchesAnyKeyword = true;
          console.log('Title match for:', keyword);
        }
        if (sectionText.includes(keyword)) {
          relevanceScore += 5; // Content matches
          matchesAnyKeyword = true;
          console.log('Content match for:', keyword);
        }

        // Word boundary matches (whole words) for all terms
        const wordBoundaryRegex = new RegExp(
          '\\b' + this.escapeRegExp(keyword) + '\\b',
          'gi'
        );
        if (wordBoundaryRegex.test(title)) {
          relevanceScore += 8; // Whole word in title
          matchesAnyKeyword = true;
          console.log('Word boundary title match for:', keyword);
        }
        if (wordBoundaryRegex.test(sectionText)) {
          relevanceScore += 4; // Whole word in content
          matchesAnyKeyword = true;
          console.log('Word boundary content match for:', keyword);
        }

        // Partial matching for all keywords
        const partialRegex = new RegExp(this.escapeRegExp(keyword), 'gi');
        if (partialRegex.test(title)) {
          relevanceScore += 6;
          matchesAnyKeyword = true;
          console.log('Partial title match for:', keyword);
        }
        if (partialRegex.test(sectionText)) {
          relevanceScore += 3;
          matchesAnyKeyword = true;
          console.log('Partial content match for:', keyword);
        }
      });

      // Check for exact phrase match (highest priority)
      if (originalSearchTerm.length >= 2) {
        if (title.includes(originalSearchTerm)) {
          relevanceScore += 20;
          matchesAnyKeyword = true;
          console.log('Exact phrase title match for:', originalSearchTerm);
        }
        if (sectionText.includes(originalSearchTerm)) {
          relevanceScore += 15;
          matchesAnyKeyword = true;
          console.log('Exact phrase content match for:', originalSearchTerm);
        }
      }

      console.log(
        'Section:',
        title,
        'Relevance:',
        relevanceScore,
        'Matches:',
        matchesAnyKeyword
      );

      if (matchesAnyKeyword && relevanceScore > 0) {
        section.style.display = 'block';
        hasVisibleResults = true;

        // Store relevance score for potential sorting
        section.dataset.relevanceScore = relevanceScore;

        // Clear existing highlights first
        this.removeHighlights(section);

        // Highlight ALL keywords including single characters
        keywords.forEach((keyword) => {
          console.log('Highlighting keyword:', keyword);
          this.highlightSearchTerm(section, keyword);
        });

        // Also highlight the original search term if it's different
        if (originalSearchTerm !== keywords.join(' ')) {
          console.log('Highlighting original term:', originalSearchTerm);
          this.highlightSearchTerm(section, originalSearchTerm);
        }
      } else {
        section.style.display = 'none';
        delete section.dataset.relevanceScore;
      }
    });

    console.log('Search complete. Has results:', hasVisibleResults);

    // Show "no results" message if needed
    this.showNoResultsMessage(
      !hasVisibleResults && searchTerm.trim().length > 0
    );
  }

  /**
   * Show all help sections
   */
  showAllSections() {
    const helpSections = document.querySelectorAll('.help-section-card');
    helpSections.forEach((section) => {
      section.style.display = 'block';
    });
  }

  /**
   * Show or hide "no results" message
   */
  showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('help-no-results');

    if (show && !noResultsMsg) {
      // Create no results message
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'help-no-results';
      noResultsMsg.style.cssText = `
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
            `;
      noResultsMsg.textContent =
        'No matching help topics found. Try different keywords.';

      const helpContent = document.getElementById('helpContent');
      if (helpContent) {
        helpContent.appendChild(noResultsMsg);
      }
    } else if (!show && noResultsMsg) {
      // Remove no results message
      if (noResultsMsg.parentNode) {
        noResultsMsg.parentNode.removeChild(noResultsMsg);
      }
    }
  }

  /**
   * Remove all highlights from all sections
   */
  removeAllHighlights() {
    const helpSections = document.querySelectorAll('.help-section-card');
    helpSections.forEach((section) => {
      this.removeHighlights(section);
    });
  }

  /**
   * Highlight search terms with better handling for multi-character keywords
   */
  highlightSearchTerm(element, term) {
    // Remove existing highlights first
    this.removeHighlights(element);

    if (!term || term.trim().length === 0) return;

    const searchTerm = term.toLowerCase().trim();

    // Use TreeWalker for better text node traversal
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    const textNodes = [];

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent;
      const lowerText = text.toLowerCase();

      // Find all matches in this text node
      const matches = [];
      let searchIndex = 0;

      while (
        (searchIndex = lowerText.indexOf(searchTerm, searchIndex)) !== -1
      ) {
        matches.push({
          start: searchIndex,
          end: searchIndex + searchTerm.length,
        });
        searchIndex += searchTerm.length;
      }

      // Look for word boundary matches for ALL search terms
      const wordBoundaryRegex = new RegExp(
        '\\b' + this.escapeRegExp(searchTerm) + '\\b',
        'gi'
      );
      let match;
      while ((match = wordBoundaryRegex.exec(lowerText)) !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;
        // Only add if it doesn't overlap with existing matches
        const overlaps = matches.some(
          (m) => matchStart < m.end && matchEnd > m.start
        );
        if (!overlaps) {
          matches.push({ start: matchStart, end: matchEnd });
        }
      }

      if (matches.length > 0) {
        // Sort matches by position and remove overlaps
        matches.sort((a, b) => a.start - b.start);

        // Build new content with highlights
        let result = '';
        let lastIndex = 0;

        matches.forEach((match) => {
          result += text.substring(lastIndex, match.start);
          const highlightedText = text.substring(match.start, match.end);
          result += `<mark class="search-highlight">${highlightedText}</mark>`;
          lastIndex = match.end;
        });

        result += text.substring(lastIndex);

        // Replace the text node with highlighted version
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = result;
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }

  /**
   * Escape special regex characters
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Remove highlights
   */
  removeHighlights(element) {
    const marks = element.querySelectorAll('mark');
    marks.forEach((mark) => {
      mark.outerHTML = mark.innerHTML;
    });
  }

  /**
   * Initialize file tree viewer for markdown documents
   */
  async initializeFileTreeViewer() {
    try {
      // Get the file tree panel container
      const treePanel = document.getElementById('helpFileTreePanel');
      if (!treePanel) {
        console.warn('HelpSystem: File tree panel not found in DOM');
        return;
      }

      // Clean up existing viewer if present
      if (this.fileTreeViewer) {
        // Reset the container
        treePanel.innerHTML = '';
      }

      // Create new file tree viewer
      this.fileTreeViewer = new FileTreeViewer(treePanel);

      console.log('HelpSystem: File tree viewer initialized successfully');
    } catch (error) {
      console.error(
        'HelpSystem: Failed to initialize file tree viewer:',
        error.message
      );
    }
  }

  /**
   * Initialize documentation controls
   */
  initializeDocumentationControls() {
    const toggleTreeBtn = document.getElementById('toggleTreeBtn');
    const backToHelpBtn = document.getElementById('backToHelpBtn');
    const panel = document.getElementById('fileTreeOverlay');
    const closeTreeBtn = document.getElementById('closeTreeBtn');

    // Toggle tree panel
    if (toggleTreeBtn && panel) {
      toggleTreeBtn.addEventListener('click', () => {
        if (panel.classList.contains('open')) {
          this.hideTreeView();
        } else {
          this.showTreeView();
        }
      });
    }

    // Close tree panel
    if (closeTreeBtn && panel) {
      closeTreeBtn.addEventListener('click', () => {
        const contentPanel = document
          .getElementById('helpModal')
          ?.querySelector('.help-content-panel');
        if (contentPanel?.classList.contains('md-mode')) {
          this.showHelpView();
        } else {
          this.hideTreeView();
        }
      });
    }

    // Back to help button
    if (backToHelpBtn) {
      backToHelpBtn.addEventListener('click', () => {
        this.showHelpView();
      });
    }

    // Copy button
    const copyBtn = document.getElementById('mdCopyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyMarkdownContent();
      });
    }

    // Hide tree button (new - keep file displayed)
    const hideTreeBtn = document.getElementById('hideTreeBtn');
    if (hideTreeBtn) {
      hideTreeBtn.addEventListener('click', () => {
        this.hideTreeView();
      });
    }

    console.log('HelpSystem: Documentation controls initialized');
  }

  /**
   * Show tree overlay and MD content
   */
  showTreeView() {
    const overlay = document.getElementById('fileTreeOverlay');
    const contentPanel = document
      .getElementById('helpModal')
      ?.querySelector('.help-content-panel');
    const toggleBtn = document.getElementById('toggleTreeBtn');
    const backBtn = document.getElementById('backToHelpBtn');

    // Show tree overlay with animation
    if (overlay) {
      overlay.classList.add('open');
    }

    // Switch to MD mode
    if (contentPanel) {
      contentPanel.classList.add('md-mode');
    }

    // Update buttons
    if (toggleBtn) {
      toggleBtn.textContent = '📁 Hide Files';
    }
    if (backBtn) {
      backBtn.style.display = 'inline-block';
    }
  }

  /**
   * Hide tree panel only (keep current file displayed)
   */
  hideTreeView() {
    const panel = document.getElementById('fileTreeOverlay');
    const toggleBtn = document.getElementById('toggleTreeBtn');

    // Hide tree panel
    if (panel) {
      panel.classList.remove('open');
    }

    // Update button
    if (toggleBtn) {
      toggleBtn.textContent = '📁 Show Files';
    }
  }

  /**
   * Show help content view
   */
  showHelpView() {
    const contentPanel = document
      .getElementById('helpModal')
      ?.querySelector('.help-content-panel');
    const overlay = document.getElementById('fileTreeOverlay');
    const backBtn = document.getElementById('backToHelpBtn');
    const toggleBtn = document.getElementById('toggleTreeBtn');

    // Switch to help content (remove MD mode)
    if (contentPanel) {
      contentPanel.classList.remove('md-mode');
    }

    // Keep tree visible but remove MD mode
    if (overlay && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
    }

    // Update buttons
    if (backBtn) {
      backBtn.style.display = 'none';
    }
    if (toggleBtn) {
      toggleBtn.textContent = '📁 Show Files';
    }

    // Clear current file title
    const fileNameSpan = document.getElementById('fileName');
    if (fileNameSpan) {
      fileNameSpan.textContent = 'None Selected';
    }
  }

  /**
   * Update MD file display
   */
  async showMarkdownFile(filePath, fileContent) {
    const fileNameSpan = document.getElementById('fileName');
    const mdContentBody = document.getElementById('mdContentBody');
    const contentPanel = document
      .getElementById('helpModal')
      ?.querySelector('.help-content-panel');

    // Update file name
    if (fileNameSpan) {
      const fileName = filePath.split('/').pop();
      fileNameSpan.textContent = fileName;
    }

    // Switch to MD viewer mode
    if (contentPanel && !contentPanel.classList.contains('md-mode')) {
      contentPanel.classList.add('md-mode');
    }

    // Update content
    if (mdContentBody && fileContent) {
      // Simple markdown-like rendering
      const renderedContent = this.renderMarkdownText(fileContent);
      mdContentBody.innerHTML = renderedContent;
    }
  }

  /**
   * Simple markdown rendering
   */
  renderMarkdownText(content) {
    if (!content) return '<p>No content available</p>';

    return content
      .split('\n')
      .map((line) => {
        if (line.startsWith('# ')) {
          return `<h2 style="color: #007acc; margin-top: 20px; margin-bottom: 10px;">${line.substring(2)}</h2>`;
        } else if (line.startsWith('## ')) {
          return `<h3 style="color: #258ed4; margin-top: 16px; margin-bottom: 8px;">${line.substring(3)}</h3>`;
        } else if (line.trim() === '') {
          return '<br>';
        } else {
          return `<p style="margin-bottom: 8px;">${line}</p>`;
        }
      })
      .join('');
  }

  /**
   * Copy markdown content to clipboard
   */
  async copyMarkdownContent() {
    const mdContentBody = document.getElementById('mdContentBody');
    if (mdContentBody && mdContentBody.textContent.trim()) {
      try {
        await navigator.clipboard.writeText(mdContentBody.textContent);
        // Provide visual feedback
        const copyBtn = document.getElementById('mdCopyBtn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✅ Copied!';
          copyBtn.style.background = '#28a745';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#007acc';
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  }
}

export default HelpSystem;
