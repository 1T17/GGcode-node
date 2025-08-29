# GGcode Compiler - localStorage Logic

## 📍 **Current localStorage Implementation**

Your GGcode Compiler uses a **centralized storage system** with both a dedicated `StorageManager` class and some direct localStorage calls throughout the application.

## 🗂️ **Storage Keys & Data Types**

### **Primary Storage Manager** (`src/client/js/utils/storageManager.js`)

#### **Storage Keys:**
```javascript
STORAGE_KEYS = {
  INPUT_CONTENT: 'ggcode_input_content',          // String: GGcode editor content
  OUTPUT_CONTENT: 'ggcode_output_content',        // String: G-code output content
  LAST_FILENAME: 'ggcode_last_filename',          // String: Last opened file name
  AUTO_COMPILE: 'ggcode_auto_compile',            // Boolean: Auto-compile enabled
  SELECTED_LANGUAGE: 'ggcode_selected_language',  // String: UI language code
  AI_AUTO_APPROVE: 'aiAutoApprove',               // Boolean: AI auto-approve setting
  AI_MODE: 'aiMode',                              // String: AI assistant mode
  AI_CHAT_MESSAGES: 'aiChatMessages',             // Array: AI chat message history
}
```

#### **Default Values:**
```javascript
DEFAULTS = {
  INPUT_CONTENT: '',           // Empty string
  OUTPUT_CONTENT: '',          // Empty string
  LAST_FILENAME: '',           // Empty string
  AUTO_COMPILE: false,         // Disabled by default
  SELECTED_LANGUAGE: 'en',     // English
  AI_AUTO_APPROVE: false,      // Manual approval required
  AI_MODE: 'assistant',        // Default AI mode
  AI_CHAT_MESSAGES: [],        // Empty message array
}
```

## 🔧 **StorageManager Methods**

### **Core CRUD Operations:**
```javascript
// Input Content
storageManager.getInputContent()      // Get GGcode from storage
storageManager.setInputContent(content) // Save GGcode to storage

// Output Content
storageManager.getOutputContent()     // Get G-code from storage
storageManager.setOutputContent(content) // Save G-code to storage

// Metadata
storageManager.getLastFilename()      // Get last opened filename
storageManager.setLastFilename(name)  // Save last opened filename
```

### **Settings Management:**
```javascript
// Auto-compile
storageManager.getAutoCompileState()  // Get auto-compile preference
storageManager.setAutoCompileState(bool) // Save auto-compile preference

// Language
storageManager.getSelectedLanguage()  // Get UI language
storageManager.setSelectedLanguage(code) // Save UI language
```

### **AI Features:**
```javascript
// AI Settings
storageManager.getAiAutoApprove()     // Get AI auto-approve setting
storageManager.setAiAutoApprove(bool) // Save AI auto-approve setting

storageManager.getAiMode()            // Get AI assistant mode
storageManager.setAiMode(mode)        // Save AI assistant mode

// AI Chat
storageManager.getAiChatMessages()    // Get chat message history
storageManager.setAiChatMessages(array) // Save chat message history
```

### **Bulk Operations:**
```javascript
// Clear all data
storageManager.clearAll()

// Export all data
storageManager.getAllData()  // Returns object with all stored data

// Import all data
storageManager.setAllData(dataObject)
```

## 🎯 **Direct localStorage Usage**

### **Editor Settings** (`src/client/js/editor/settings.js`)
```javascript
localStorage Keys:
- 'ggcode-editor-settings'    // JSON: Editor configuration
```

### **Theme Preferences** (`src/client/js/editor/themeLoader.js`)
```javascript
localStorage Keys:
- 'ggcode-theme'              // String: Selected theme name
```

### **Dropdown Persistence** (`src/client/js/ui/dropdownManager.js`)
```javascript
localStorage Keys:
- Custom storage keys (configurable per dropdown)
- 'selectedLanguage'          // String: Language selection
```

## 🔄 **Data Flow & Auto-Save Logic**

### **1. Editor Content Auto-Save**
- **Trigger**: Every keystroke in Monaco editor
- **Method**: `storageManager.setInputContent(content)`
- **Recovery**: On page load, `storageManager.getInputContent()`

### **2. Compilation Output**
- **Trigger**: After successful compilation
- **Method**: `storageManager.setOutputContent(gcode)`
- **Recovery**: On page load, `storageManager.getOutputContent()`

### **3. File Operations**
- **Save GGcode**: `toolbarManager.saveGGcode()` → Downloads file + updates `lastFilename`
- **Save G-code**: `toolbarManager.saveOutput()` → Downloads file + updates `lastFilename`
- **Load File**: Updates `lastFilename` + triggers auto-save

### **4. Settings Persistence**
- **Editor Settings**: Auto-saved on change
- **Theme Selection**: Auto-saved on change
- **Language Selection**: Auto-saved on change
- **AI Settings**: Auto-saved on change

## 🧹 **Clear Memory Functionality**

### **Clear All Data** (`toolbarManager.clearMemory()`)
```javascript
// Clears localStorage:
localStorage.removeItem('ggcode_input_content');
localStorage.removeItem('ggcode_output_content');
localStorage.removeItem('ggcode_last_filename');
localStorage.removeItem('ggcode_auto_compile');

// Also clears:
- Editor content (sets to empty string)
- Output content (sets to empty string)
- Auto-compile checkbox state
- Filename memory
```

### **Selective Clearing**
```javascript
// Individual clearing
storageManager.setInputContent('');        // Clear input only
storageManager.setOutputContent('');       // Clear output only
storageManager.clearAll();                 // Clear everything via StorageManager
```

## 🛡️ **Error Handling**

### **StorageManager Error Handling**
- **Try-catch blocks** around all localStorage operations
- **Fallback to defaults** on read errors
- **Console warnings** for failed operations
- **Graceful degradation** when storage is unavailable

### **Quota Handling**
- **Large content**: May hit localStorage 5MB limit
- **Error logging**: Failed saves are logged to console
- **No data loss**: Operations fail silently with warnings

## 📊 **Storage Size & Performance**

### **Typical Storage Usage**
- **Input Content**: Variable (depends on GGcode size)
- **Output Content**: Variable (depends on G-code size)
- **Settings**: Minimal (< 1KB)
- **AI Chat**: Variable (depends on conversation length)

### **Performance Considerations**
- **Auto-save**: Debounced to prevent excessive writes
- **Bulk operations**: Efficient batch read/write for settings
- **Memory management**: Old data cleared when overwritten

## 🔍 **Debugging Storage**

### **Inspect Storage**
```javascript
// In browser console:
localStorage  // View all stored data

// Via StorageManager:
storageManager.getAllData()  // Get all data as object
```

### **Clear Storage for Testing**
```javascript
// Clear all GGcode-related data:
storageManager.clearAll()

// Or clear manually:
localStorage.clear()
```

## 🚀 **Integration Points**

### **Page Load Sequence**
1. **Initialize StorageManager**
2. **Load saved content** into editors
3. **Load saved settings** for UI
4. **Load last filename** for suggestions

### **Auto-save Triggers**
- **Editor changes**: Input content saved
- **Compilation**: Output content saved
- **Settings changes**: Preferences saved
- **File operations**: Filename remembered

### **Cross-tab Synchronization**
- **Shared storage**: All tabs share same localStorage
- **Real-time sync**: Changes in one tab reflect in others
- **Conflict handling**: Last-write-wins approach

## 🔄 **Migration & Updates**

### **Adding New Storage Keys**
```javascript
// 1. Add to STORAGE_KEYS object
// 2. Add default value to DEFAULTS object
// 3. Add getter/setter methods
// 4. Update getAllData/setAllData methods
// 5. Update clearAll method
```

### **Version Compatibility**
- **Backward compatible**: Old keys remain accessible
- **Forward compatible**: New keys use defaults if missing
- **Safe migration**: No data loss during updates

---

## 💡 **Summary**

Your localStorage system is **well-architected** with:

✅ **Centralized management** via StorageManager class  
✅ **Error handling** and graceful degradation  
✅ **Auto-save functionality** for user content  
✅ **Settings persistence** for user preferences  
✅ **Bulk operations** for data management  
✅ **Cross-tab synchronization**  
✅ **Memory management** and cleanup options  

The system provides a **robust, user-friendly** storage experience that **preserves work** and **maintains preferences** across sessions.