# CSS Organization - Granular Structure

This directory contains the highly organized CSS files for the GGcode Compiler application, broken down into small, focused modules for maximum maintainability.

## File Structure

```
public/css/
├── README.md                           # This documentation
├── main.css                           # Main entry point - imports all modules
├── base.css                           # Layout module importer
├── components.css                     # Components module importer  
├── editor.css                         # Editor module importer
├── modals.css                         # Modals module importer
├── layout/
│   ├── global.css                     # Global HTML/body styles
│   ├── grid.css                       # Main grid layout system
│   └── panels.css                     # Panel-specific layouts
├── components/
│   ├── buttons.css                    # Button styles and variants
│   ├── controls.css                   # Control bar components
│   └── headers.css                    # Header components
├── editor/
│   ├── annotations.css                # Annotations panel structure
│   ├── annotation-content.css         # Annotation content styling
│   └── annotation-toolbar.css         # Annotation toolbar & toggle
└── modals/
    ├── base.css                       # Modal structure & overlay
    ├── search.css                     # Search components
    ├── help-system.css                # Help system cards & content
    ├── code-blocks.css                # Code block styling
    ├── examples.css                   # Examples modal
    ├── language-selector.css          # Language selection UI
    ├── collapsible.css                # Collapsible lists
    ├── states.css                     # Loading & error states
    ├── rtl-support.css                # RTL language support
    └── app-usage.css                  # App usage section styling
```

## Module Responsibilities

### 🏗️ **Layout Modules**
- **`global.css`**: HTML/body base styles, fonts, colors
- **`grid.css`**: Main application grid (#ggform, .main-content)
- **`panels.css`**: Left/right panels, editor/output areas

### 🎛️ **Component Modules**
- **`buttons.css`**: All button styles (primary, danger, success, gcode-header buttons)
- **`controls.css`**: Control bar, toggles, separators, groups
- **`headers.css`**: G-code header, titles

### ✏️ **Editor Modules**
- **`annotations.css`**: Annotations panel structure & states
- **`annotation-content.css`**: Commands, parameters, styling
- **`annotation-toolbar.css`**: Toolbar, toggle button, animations

### 🪟 **Modal Modules**
- **`base.css`**: Modal overlay, content, header, close button
- **`search.css`**: Search input, results, container
- **`help-system.css`**: Help cards, sections, content
- **`code-blocks.css`**: Code styling, copy buttons
- **`examples.css`**: Examples list, items, previews
- **`language-selector.css`**: Language dropdown, custom select
- **`collapsible.css`**: Collapsible lists, animations
- **`states.css`**: Loading indicators, error messages
- **`rtl-support.css`**: Arabic/Hebrew RTL support
- **`app-usage.css`**: Special app usage section styling

## Import Chain

```css
main.css
├── base.css
│   ├── layout/global.css
│   ├── layout/grid.css
│   └── layout/panels.css
├── components.css
│   ├── components/buttons.css
│   ├── components/controls.css
│   └── components/headers.css
├── editor.css
│   ├── editor/annotations.css
│   ├── editor/annotation-content.css
│   └── editor/annotation-toolbar.css
└── modals.css
    ├── modals/base.css
    ├── modals/search.css
    ├── modals/help-system.css
    ├── modals/code-blocks.css
    ├── modals/examples.css
    ├── modals/language-selector.css
    ├── modals/collapsible.css
    ├── modals/states.css
    ├── modals/rtl-support.css
    └── modals/app-usage.css
```

## Usage

### In HTML
```html
<link rel="stylesheet" href="/css/main.css">
```

### Current Setup
The `public/style.css` file imports from this organized structure:
```css
@import url('./css/main.css');
```

## Benefits of Granular Organization

1. **🎯 Laser Focus**: Each file has one specific responsibility
2. **🔍 Easy to Find**: Know exactly where any style lives
3. **🛠️ Easy to Maintain**: Changes are super isolated
4. **🚀 Performance**: Can load only what you need
5. **👥 Team Friendly**: No merge conflicts, parallel development
6. **🧪 Easy Testing**: Test individual components in isolation
7. **📦 Highly Reusable**: Mix and match modules
8. **🔧 Easy Debugging**: Quickly locate style issues

## Adding New Styles

### For global styles:
→ `layout/global.css`

### For layout changes:
→ `layout/grid.css` or `layout/panels.css`

### For new buttons:
→ `components/buttons.css`

### For control bar features:
→ `components/controls.css`

### For annotation features:
→ `editor/annotation-*.css`

### For modal features:
→ `modals/*.css` (choose appropriate module)

### For new modal types:
→ Create new file in `modals/` and add import to `modals.css`

## File Size Guidelines

Each module should be:
- **Small**: < 100 lines ideally
- **Focused**: One clear responsibility
- **Self-contained**: Minimal dependencies
- **Well-documented**: Clear purpose


## Quick Reference

Need to modify...
- **Button colors** → `components/buttons.css`
- **Layout spacing** → `layout/grid.css`
- **Modal appearance** → `modals/base.css`
- **Help content styling** → `modals/help-system.css`
- **Annotation colors** → `editor/annotation-content.css`
- **Search box** → `modals/search.css`
- **Loading states** → `modals/states.css`