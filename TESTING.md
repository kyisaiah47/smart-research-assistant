# 🧪 Testing Guide for Smart Research Assistant

## Prerequisites for Testing

### 1. Chrome Setup
- **Chrome Canary** or **Chrome Dev** (required for AI APIs)
- Join the [Chrome Built-in AI Early Preview Program](https://docs.google.com/forms/d/e/1FAIpQLSfZXeiwj9KO9jMctffHPym88ln12xNWCrVkMY_u06WfSTulQg/viewform)
- Enable AI flags in `chrome://flags/`:
  - Search for "AI" and enable relevant flags
  - Restart Chrome

### 2. Generate Icons
1. Open `create-placeholder-icons.html` in your browser
2. It will auto-download icon16.png, icon48.png, icon128.png
3. Move these files to the `icons/` folder

## Installation Steps

1. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

2. **Load Extension**
   - Click "Load unpacked"
   - Select the `smart-research-assistant` folder
   - The extension should appear with a 🧠 icon

3. **Verify Installation**
   - Look for the extension icon in your toolbar
   - Click it to see the popup interface

## Testing Checklist

### ✅ Basic Functionality
- [ ] Extension loads without errors
- [ ] Popup opens when clicking icon
- [ ] UI displays correctly with buttons and sections

### ✅ Content Extraction
- [ ] Navigate to a Wikipedia article or news article
- [ ] Click extension icon
- [ ] Content should be detected (no errors about missing content)

### ✅ AI Features
- [ ] Click "Summarize Page" - should generate a summary
- [ ] Click "Generate Questions" - should create research questions
- [ ] Questions should be clickable and open Google search

### ✅ Storage Features
- [ ] Click "Save Current Research" - should save note
- [ ] Saved notes should appear in the bottom section
- [ ] Click saved notes should open the original URL

### ✅ Error Handling
- [ ] Try on pages with minimal content
- [ ] Check browser console for error messages
- [ ] Verify user-friendly error messages display

## Test Pages (Good Examples)
- https://en.wikipedia.org/wiki/Artificial_intelligence
- https://www.bbc.com/news (any recent article)
- https://developer.mozilla.org/en-US/docs/Web/API (any documentation page)

## Common Issues & Solutions

### "AI not available" Error
- Ensure you're using Chrome Canary/Dev
- Check Early Preview Program enrollment
- Enable AI flags in chrome://flags

### Extension Won't Load
- Check for syntax errors in browser console
- Verify all required files are present
- Make sure icons exist in icons/ folder

### No Content Extracted
- Try refreshing the page
- Check if page has substantial text content
- Try a different test page

## Performance Notes
- First AI call may be slower (model loading)
- Subsequent calls should be faster
- Works offline after initial model download

## Browser Console Debugging
Open Developer Tools (F12) and check:
- Console tab for JavaScript errors
- Network tab for failed requests
- Check background script logs