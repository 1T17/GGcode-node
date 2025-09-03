# AI Agent Integration for GGcode Editor

This document describes the AI agent capabilities that allow the AI to read, analyze, and modify the GGcode editor content.

## Overview

The AI agent integration provides a set of functions that allow the AI to interact with the GGcode editor, including reading content, making modifications, and analyzing code for optimization opportunities.

## Client-Side Functions

The following functions are available globally for the AI to use:

### Basic Editor Functions

1. `getGGcodeContent()` - Get the entire content of the GGcode editor
2. `setGGcodeContent(content)` - Replace the entire content of the GGcode editor
3. `insertGGcodeText(text)` - Insert text at the current cursor position
4. `replaceSelectedText(newText)` - Replace the currently selected text
5. `getSelectedText()` - Get the currently selected text
6. `getCursorPosition()` - Get the current cursor position

### Advanced Editor Functions

1. `getLineContent(lineNumber)` - Get content from a specific line
2. `getLinesContent(startLine, endLine)` - Get content from a range of lines
3. `replaceRange(startLine, startColumn, endLine, endColumn, newText)` - Replace content in a specific range
4. `insertAtPosition(lineNumber, column, text)` - Insert text at a specific position

### Analysis Functions

1. `analyzeGGcode(code)` - Analyze GGcode for optimization opportunities

## Server-Side Commands

The AI can use special commands in its responses to trigger actions:

1. `/ai:write [new content]` - Replace the entire GGcode content
2. `/ai:insert [text to insert]` - Insert text at the cursor position
3. `/ai:replace [new text]` - Replace selected text
4. `/ai:analyze` - Analyze the GGcode
5. `/ai:getlines [startLine-endLine]` - Get content from specific lines
6. `/ai:replacerange [startLine,startColumn,endLine,endColumn,newText]` - Replace content in a specific range
7. `/ai:insertat [lineNumber,column,text]` - Insert text at a specific position

## Usage Examples

### Example 1: Optimizing G-code

```
User: "Can you optimize this G-code?"
AI: "I'll analyze your G-code to identify optimization opportunities. /ai:analyze"
[Analysis results appear]
AI: "I've found several areas for optimization. I'll implement changes to improve feed rates and reduce rapid moves. /ai:write [optimized code]"
```

### Example 2: Inserting Comments

```
User: "Can you add comments to explain what this code does?"
AI: "I'll add comments to explain the G-code operations. /ai:insertat 1,1,// This is a comment explaining the code\n"
```

### Example 3: Replacing a Section

```
User: "Can you replace the feed rate in this section?"
AI: "I'll replace the feed rate in lines 10-15. /ai:replacerange 10,1,15,10,F500"
```

## Best Practices

1. Always explain what you're doing before using a command
2. Show the user the changes you're making
3. Only make changes when explicitly requested or when it would be helpful to demonstrate a solution
4. Be careful not to overwrite the user's work without permission
5. Provide feedback to the user after executing commands