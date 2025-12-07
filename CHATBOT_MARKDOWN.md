# 🤖 AI Chatbot Markdown Support

The SmartSupport chatbot now supports **rich markdown formatting** in AI
responses!

## ✨ Supported Markdown Features

### 1. **Text Formatting**

```markdown
**Bold text** _Italic text_ ~~Strikethrough~~ `Inline code`
```

### 2. **Headings**

```markdown
# Heading 1

## Heading 2

### Heading 3
```

### 3. **Lists**

**Unordered:**

```markdown
- Item 1
- Item 2
  - Nested item
```

**Ordered:**

```markdown
1. First item
2. Second item
3. Third item
```

### 4. **Links**

```markdown
[Link text](https://example.com)
```

### 5. **Code Blocks**

**Inline code:**

```markdown
Use `npm install` to install packages
```

**Code blocks with syntax highlighting:**

````markdown
```javascript
function hello() {
  console.log("Hello World!");
}
```

```python
def hello():
    print("Hello World!")
```

```bash
npm install react-markdown
```
````

### 6. **Blockquotes**

```markdown
> This is a quote It can span multiple lines
```

### 7. **Tables**

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### 8. **Horizontal Rules**

```markdown
---
```

## 🎨 Custom Styling

The chatbot has custom styling for:

- ✅ Syntax-highlighted code blocks
- ✅ Responsive tables
- ✅ Styled links (opens in new tab)
- ✅ Beautiful lists with proper spacing
- ✅ Dark mode support
- ✅ Color-coded inline code

## 📦 Dependencies

- `react-markdown` - Main markdown parser
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-highlight` - Syntax highlighting for code blocks
- `highlight.js` - Code syntax themes

## 🧪 Example AI Responses

### Example 1: Technical Help

```markdown
**How to Reset Your Password**

Follow these steps:

1. Go to the login page
2. Click on "Forgot Password?"
3. Enter your email address
4. Check your email for reset link
5. Follow the link and create new password

> **Important:** The reset link expires in 24 hours!

Need more help? Contact support at `support@example.com`
```

### Example 2: Code Example

````markdown
**How to Install Our SDK**

```bash
# Using npm
npm install smartsupport-sdk

# Using yarn
yarn add smartsupport-sdk
```

**Usage:**

```javascript
import SmartSupport from "smartsupport-sdk";

const support = new SmartSupport({
  apiKey: "your-api-key",
});

support.createTicket({
  subject: "Help needed",
  description: "I need assistance",
});
```
````

### Example 3: Feature Comparison

```markdown
**Plan Comparison**

| Feature          | Basic | Pro  | Enterprise |
| ---------------- | ----- | ---- | ---------- |
| Tickets/month    | 100   | 1000 | Unlimited  |
| AI Responses     | ✅    | ✅   | ✅         |
| Priority Support | ❌    | ✅   | ✅         |
| Custom Branding  | ❌    | ❌   | ✅         |

**Need to upgrade?** Contact our sales team!
```

## 🚀 Usage

The markdown rendering is **automatic** for all bot responses. Just make sure
your AI returns responses with markdown formatting!

### In ChatbotController (Backend):

```php
// AI will automatically format responses with markdown
$aiResponse = "**Hello!** Here's how to help:\n\n1. First step\n2. Second step\n\nUse `this command` for more info.";

return response()->json([
    'success' => true,
    'message' => $aiResponse,
    'type' => 'ai'
]);
```

### In Frontend:

The markdown is automatically rendered with:

```javascript
<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
  {msg.message}
</ReactMarkdown>
```

## 🎯 Benefits

- ✅ **Better Readability** - Formatted text is easier to read
- ✅ **Code Examples** - Show code with syntax highlighting
- ✅ **Structured Content** - Lists, tables, and headings
- ✅ **Professional Look** - Modern, clean design
- ✅ **Dark Mode** - Fully supports dark theme
- ✅ **Responsive** - Works on all screen sizes

## 🔧 Customization

To customize markdown styles, edit:

- `/src/app/customer/chatbot/chatbot-markdown.css`

To change code theme, replace:

```javascript
import "highlight.js/styles/github-dark.css";
```

Available themes:

- `github-dark.css` (current)
- `vs2015.css`
- `monokai.css`
- `atom-one-dark.css`
- And many more...

## 📝 Tips for AI Responses

To get the best markdown rendering:

1. **Use proper markdown syntax**
2. **Add line breaks** between sections
3. **Use code blocks** for commands/code
4. **Format lists properly** with blank lines
5. **Use tables** for comparisons
6. **Add emojis** for visual appeal 🎨

## 🐛 Troubleshooting

**Code blocks not highlighting?**

- Make sure language is specified: ` ```javascript`

**Links not clickable?**

- Use proper markdown syntax: `[text](url)`

**Tables not rendering?**

- Ensure proper table syntax with pipes `|`

**Styles not applying?**

- Check that `chatbot-markdown.css` is imported

---

**Updated:** December 2025  
**Status:** ✅ Production Ready
