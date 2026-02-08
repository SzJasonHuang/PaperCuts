
# Plan: Sanitize Gemini Response to Remove Markdown Formatting

## Summary

Add a helper method to clean Gemini's HTML response by stripping markdown code blocks and extracting only valid HTML content before passing it to `PdfRendererBuilder`.

---

## The Problem

Gemini often returns HTML wrapped in markdown formatting like:

```text
```html
<!DOCTYPE html>
<html>
...
</html>
``` 
```

The `PdfRendererBuilder` expects raw HTML, not markdown-wrapped HTML.

---

## Solution

Add a `sanitizeHtmlResponse()` method that:
1. Removes markdown code block markers (` ```html `, ` ``` `)
2. Extracts content between `<!DOCTYPE` or `<html` and `</html>`
3. Trims whitespace

---

## Technical Implementation

### File: `backend/src/main/java/com/sessions/service/PdfService.java`

**Add new helper method:**

```java
/**
 * Sanitize AI response to extract clean HTML
 * Removes markdown formatting and extracts HTML content
 */
private String sanitizeHtmlResponse(String response) {
    if (response == null || response.isEmpty()) {
        return response;
    }
    
    String cleaned = response;
    
    // Remove markdown code block markers
    cleaned = cleaned.replaceAll("```html\\s*", "");
    cleaned = cleaned.replaceAll("```HTML\\s*", "");
    cleaned = cleaned.replaceAll("```\\s*", "");
    
    // Trim whitespace
    cleaned = cleaned.trim();
    
    // Try to extract just the HTML document if there's extra text
    int doctypeIndex = cleaned.toLowerCase().indexOf("<!doctype");
    int htmlStartIndex = cleaned.toLowerCase().indexOf("<html");
    int htmlEndIndex = cleaned.toLowerCase().lastIndexOf("</html>");
    
    int startIndex = -1;
    if (doctypeIndex >= 0) {
        startIndex = doctypeIndex;
    } else if (htmlStartIndex >= 0) {
        startIndex = htmlStartIndex;
    }
    
    if (startIndex >= 0 && htmlEndIndex > startIndex) {
        cleaned = cleaned.substring(startIndex, htmlEndIndex + 7); // 7 = length of "</html>"
    }
    
    return cleaned;
}
```

**Modify `optimizePdf` method (around line 160):**

```java
// Before writing to HTML file, sanitize the response
String cleanedHtml = sanitizeHtmlResponse(response.text());

PrintWriter out = new PrintWriter(html);
out.println(cleanedHtml);
out.close();
```

---

## What Gets Stripped

| Input Pattern | Result |
|---------------|--------|
| ` ```html\n<!DOCTYPE html>... ``` ` | `<!DOCTYPE html>...` |
| `Here's the HTML:\n```html\n<html>...</html>\n``` ` | `<html>...</html>` |
| `<!DOCTYPE html>...(already clean)` | `<!DOCTYPE html>...` (unchanged) |

---

## Files to Modify

| File | Changes |
|------|---------|
| `backend/src/main/java/com/sessions/service/PdfService.java` | Add `sanitizeHtmlResponse()` method, call it before writing HTML file |

---

## Expected Outcome

- Markdown code blocks are stripped from Gemini responses
- Only clean HTML is passed to `PdfRendererBuilder`
- `builder.run()` should no longer fail due to markdown formatting
