# Reflected XSS Attack Demo - Interactive HTML Page

## Project Goal
Create a self-contained HTML page that explains **Reflected XSS attacks** specifically using visual schemas and interactive demonstrations with minimal text.

## What is Reflected XSS?
Reflected XSS occurs when malicious script is **reflected** off a web server (in search results, error messages, or any response that includes user input without proper sanitization). The attack is delivered via URL parameters and executes immediately.

## Target Audience
Developers and security learners who prefer visual learning over text-heavy explanations.

## Implementation Order
1. Create HTML skeleton with semantic structure
2. Implement CSS styling (mobile-first responsive)
3. Add static content (header, flow diagram, characteristics, prevention tips)
4. Implement JavaScript for interactive demos
5. Test in multiple browsers
6. Validate HTML and ensure accessibility

## Page Structure

### 1. Header Section
HTML structure:
```html
<header class="main-header">
  <h1>Understanding Reflected XSS Attacks</h1>
  <p class="subtitle">When Your Input Bounces Back as Code</p>
  <p class="description">Malicious scripts delivered via URL that execute when the server reflects them in its response</p>
</header>
```

Styling:
- Background: Linear gradient from #4a90e2 to #357abd
- Text color: white
- Center aligned
- Padding: 40px 20px
- h1: font-size 2.5rem, font-weight 700
- subtitle: font-size 1.2rem, opacity 0.9
- description: font-size 1rem, max-width 800px, margin auto

### 2. Visual Schema Section

HTML structure:
```html
<section class="flow-diagram">
  <h2>How Reflected XSS Works</h2>
  <div class="flow-container">
    <div class="flow-step attacker">
      <div class="step-icon">🎣</div>
      <div class="step-title">1. Attacker Creates Malicious URL</div>
      <code class="step-code">example.com/search?q=&lt;script&gt;steal()&lt;/script&gt;</code>
    </div>
    <div class="arrow">↓</div>

    <div class="flow-step victim">
      <div class="step-icon">👤</div>
      <div class="step-title">2. Victim Clicks Link</div>
      <div class="step-note">(via email, social media, etc.)</div>
    </div>
    <div class="arrow">↓</div>

    <div class="flow-step server highlight-reflection">
      <div class="step-icon">🖥️</div>
      <div class="step-title">3. Server Reflects Input</div>
      <div class="step-note">(without sanitization)</div>
    </div>
    <div class="arrow">↓</div>

    <div class="flow-step browser">
      <div class="step-icon">🌐</div>
      <div class="step-title">4. Browser Executes Script</div>
    </div>
    <div class="arrow">↓</div>

    <div class="flow-step danger">
      <div class="step-icon">⚠️</div>
      <div class="step-title">5. Malicious Actions Performed</div>
      <div class="step-note">(cookies stolen, session hijacked)</div>
    </div>
  </div>
</section>
```

Styling:
- Container: max-width 800px, margin auto, padding 40px 20px
- h2: text-align center, font-size 2rem, margin-bottom 30px
- flow-step: padding 20px, border-radius 12px, margin 10px auto, max-width 600px
  - .attacker: background #ffebee, border-left 5px solid #ff4444
  - .victim: background #e3f2fd, border-left 5px solid #2196f3
  - .server: background #f5f5f5, border-left 5px solid #757575
  - .browser: background #fff3e0, border-left 5px solid #ff9944
  - .danger: background #ffebee, border-left 5px solid #ff4444
  - .highlight-reflection: box-shadow 0 0 20px rgba(255, 153, 68, 0.5), animation pulse 2s infinite
- step-icon: font-size 2rem, text-align center, margin-bottom 10px
- step-title: font-weight 600, font-size 1.1rem, color #333
- step-code: display block, background #263238, color #aed581, padding 10px, border-radius 4px, margin-top 10px, font-family 'Courier New', monospace, font-size 0.9rem, overflow-x auto
- step-note: font-size 0.9rem, color #666, font-style italic, margin-top 5px
- arrow: text-align center, font-size 2rem, color #ff9944, margin 5px 0

### 3. Interactive Demo Section

HTML structure:
```html
<section class="interactive-demo">
  <h2>Try It Yourself</h2>
  <div class="demo-container">

    <!-- Vulnerable Demo -->
    <div class="demo-box vulnerable-demo">
      <div class="demo-header">
        <span class="demo-badge danger">❌ Vulnerable</span>
        <h3>Reflected XSS</h3>
      </div>
      <div class="url-bar">
        <span class="url-protocol">https://</span>
        <span class="url-domain">example.com/search?q=</span>
        <span id="vulnerable-url-param" class="url-param"></span>
      </div>
      <form id="vulnerable-form" class="search-form">
        <input
          type="text"
          id="vulnerable-input"
          class="search-input"
          placeholder="Try: <img src=x onerror=alert('XSS')>"
          value="">
        <button type="submit" class="search-button">Search</button>
      </form>
      <div id="vulnerable-results" class="results-box">
        <p class="results-placeholder">Enter a search query to see reflection...</p>
      </div>
      <div class="demo-note">
        <strong>⚠️ Warning:</strong> Input is reflected directly into HTML without sanitization
      </div>
    </div>

    <!-- Secure Demo -->
    <div class="demo-box secure-demo">
      <div class="demo-header">
        <span class="demo-badge success">✅ Protected</span>
        <h3>Sanitized Response</h3>
      </div>
      <div class="url-bar">
        <span class="url-protocol">https://</span>
        <span class="url-domain">example.com/search?q=</span>
        <span id="secure-url-param" class="url-param"></span>
      </div>
      <form id="secure-form" class="search-form">
        <input
          type="text"
          id="secure-input"
          class="search-input"
          placeholder="Try: <img src=x onerror=alert('XSS')>"
          value="">
        <button type="submit" class="search-button">Search</button>
      </form>
      <div id="secure-results" class="results-box">
        <p class="results-placeholder">Enter a search query to see sanitization...</p>
      </div>
      <div class="demo-note">
        <strong>✅ Safe:</strong> Input is sanitized (HTML entities encoded) before reflection
      </div>
    </div>

  </div>

  <!-- Comparison Panel -->
  <div class="comparison-panel">
    <h3>🔍 Side-by-Side Comparison</h3>
    <div class="comparison-grid">
      <div class="comparison-item">
        <div class="comparison-label">Input:</div>
        <code>&lt;img src=x onerror=alert('XSS')&gt;</code>
      </div>
      <div class="comparison-item vulnerable-result">
        <div class="comparison-label">❌ Vulnerable (reflected as-is):</div>
        <div class="comparison-output">
          Browser attempts to execute: <code>&lt;img src=x onerror=alert('XSS')&gt;</code>
          <div class="result-note">→ Script runs, alert triggered</div>
        </div>
      </div>
      <div class="comparison-item secure-result">
        <div class="comparison-label">✅ Secure (sanitized):</div>
        <div class="comparison-output">
          Browser displays as text: <code>&amp;lt;img src=x onerror=alert('XSS')&amp;gt;</code>
          <div class="result-note">→ No script execution</div>
        </div>
      </div>
    </div>
    <div class="key-takeaway">
      <strong>Key Takeaway:</strong> Sanitization converts special characters (&lt; &gt; &amp; " ') to HTML entities BEFORE reflection
    </div>
  </div>
</section>
```

Styling:
- interactive-demo: background #fafafa, padding 40px 20px
- demo-container: display grid, grid-template-columns repeat(auto-fit, minmax(400px, 1fr)), gap 30px, max-width 1200px, margin 0 auto 40px
- demo-box: background white, border-radius 12px, padding 25px, box-shadow 0 4px 12px rgba(0,0,0,0.1)
  - .vulnerable-demo: border-top 4px solid #ff4444
  - .secure-demo: border-top 4px solid #44ff44
- demo-header: display flex, align-items center, gap 10px, margin-bottom 15px
- demo-badge: padding 5px 12px, border-radius 20px, font-size 0.85rem, font-weight 600
  - .danger: background #ff4444, color white
  - .success: background #44ff44, color #333
- url-bar: background #f5f5f5, padding 10px 15px, border-radius 8px, font-family monospace, font-size 0.9rem, margin-bottom 15px, overflow-x auto
  - .url-protocol: color #999
  - .url-domain: color #666
  - .url-param: color #ff9944, font-weight 600
- search-form: display flex, gap 10px, margin-bottom 20px
- search-input: flex 1, padding 12px 15px, border 2px solid #ddd, border-radius 6px, font-size 1rem
- search-button: padding 12px 25px, background #4a90e2, color white, border none, border-radius 6px, cursor pointer, font-weight 600
- results-box: min-height 100px, padding 15px, background #f9f9f9, border-radius 6px, border 2px solid #e0e0e0
  - .results-placeholder: color #999, font-style italic
- demo-note: margin-top 15px, padding 10px, background #fffbf0, border-left 4px solid #ffa726, font-size 0.9rem
- comparison-panel: max-width 1000px, margin 0 auto, background white, border-radius 12px, padding 30px, box-shadow 0 4px 12px rgba(0,0,0,0.1)
- comparison-grid: display grid, gap 20px, margin 20px 0
- comparison-item: padding 15px, border-radius 8px
  - .vulnerable-result: background #ffebee, border-left 4px solid #ff4444
  - .secure-result: background #e8f5e9, border-left 4px solid #44ff44
- comparison-label: font-weight 600, margin-bottom 8px, font-size 0.95rem
- comparison-output code: background #263238, color #aed581, padding 2px 6px, border-radius 3px
- result-note: margin-top 8px, font-size 0.9rem, color #666, font-style italic
- key-takeaway: background #e3f2fd, padding 20px, border-radius 8px, margin-top 20px, border-left 4px solid #2196f3

### 4. Key Characteristics of Reflected XSS

HTML structure:
```html
<section class="characteristics">
  <h2>Key Characteristics</h2>
  <div class="characteristics-grid">
    <div class="char-item">
      <div class="char-icon">⚡</div>
      <div class="char-text">Non-persistent (not stored)</div>
    </div>
    <div class="char-item">
      <div class="char-icon">🔗</div>
      <div class="char-text">Delivered via URL/link</div>
    </div>
    <div class="char-item">
      <div class="char-icon">🎯</div>
      <div class="char-text">Targets specific victim who clicks</div>
    </div>
    <div class="char-item">
      <div class="char-icon">🔄</div>
      <div class="char-text">Payload reflected in response</div>
    </div>
    <div class="char-item">
      <div class="char-icon">📧</div>
      <div class="char-text">Often spread via phishing</div>
    </div>
  </div>
</section>
```

Styling:
- characteristics: padding 40px 20px, background white
- characteristics-grid: display grid, grid-template-columns repeat(auto-fit, minmax(250px, 1fr)), gap 20px, max-width 1200px, margin 0 auto
- char-item: display flex, align-items center, gap 15px, padding 20px, background #f9f9f9, border-radius 10px, border-left 4px solid #4a90e2
- char-icon: font-size 2rem
- char-text: font-size 1rem, color #333, font-weight 500

### 5. Prevention Tips

HTML structure:
```html
<section class="prevention">
  <h2>How to Prevent Reflected XSS</h2>
  <div class="prevention-grid">
    <div class="prevention-item">
      <div class="prevention-icon">🛡️</div>
      <div class="prevention-title">Sanitize Input</div>
      <div class="prevention-desc">Encode ALL user input before reflecting it</div>
    </div>
    <div class="prevention-item">
      <div class="prevention-icon">🔒</div>
      <div class="prevention-title">Content Security Policy</div>
      <div class="prevention-desc">Use CSP headers to restrict script execution</div>
    </div>
    <div class="prevention-item">
      <div class="prevention-icon">✅</div>
      <div class="prevention-title">HTML Entities</div>
      <div class="prevention-desc">Convert &lt; &gt; &amp; " ' to safe entities</div>
    </div>
    <div class="prevention-item">
      <div class="prevention-icon">📚</div>
      <div class="prevention-title">Framework Protection</div>
      <div class="prevention-desc">Use frameworks with auto-escaping (React, Angular)</div>
    </div>
    <div class="prevention-item">
      <div class="prevention-icon">🚫</div>
      <div class="prevention-title">Never Trust Input</div>
      <div class="prevention-desc">Validate and sanitize on both client AND server</div>
    </div>
  </div>
</section>
```

Styling:
- prevention: padding 40px 20px, background #fafafa
- prevention-grid: display grid, grid-template-columns repeat(auto-fit, minmax(280px, 1fr)), gap 25px, max-width 1200px, margin 0 auto
- prevention-item: background white, padding 25px, border-radius 12px, text-align center, box-shadow 0 2px 8px rgba(0,0,0,0.1), transition transform 0.2s
  - hover: transform translateY(-5px), box-shadow 0 4px 16px rgba(0,0,0,0.15)
- prevention-icon: font-size 3rem, margin-bottom 15px
- prevention-title: font-size 1.2rem, font-weight 600, color #333, margin-bottom 10px
- prevention-desc: font-size 0.95rem, color #666, line-height 1.5

### 6. Footer

HTML structure:
```html
<footer class="main-footer">
  <p>⚠️ Educational demonstration only. All examples are safe and sandboxed.</p>
  <p>Learn more about web security at <a href="https://owasp.org" target="_blank">OWASP</a></p>
</footer>
```

Styling:
- main-footer: background #263238, color white, padding 30px 20px, text-align center
- p: margin 10px 0, font-size 0.9rem
- a: color #4a90e2, text-decoration none

## Technical Implementation

### Technologies
- Pure HTML5 (DOCTYPE html, semantic elements)
- CSS3 (Flexbox/Grid for layout, CSS custom properties for colors)
- Vanilla JavaScript (ES6+, no dependencies)
- Self-contained (no external CDNs, all styles and scripts inline)

### JavaScript Implementation Details

#### Core Functions

1. **HTML Sanitization Function** (for secure demo):
```javascript
function sanitizeHTML(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

2. **URL Encoding Function**:
```javascript
function encodeURLParam(input) {
  return encodeURIComponent(input);
}
```

3. **Vulnerable Form Handler**:
```javascript
document.getElementById('vulnerable-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const input = document.getElementById('vulnerable-input').value;
  const resultsBox = document.getElementById('vulnerable-results');
  const urlParam = document.getElementById('vulnerable-url-param');

  // Update URL display
  urlParam.textContent = encodeURLParam(input);

  // VULNERABLE: Reflect input directly using innerHTML
  // SAFETY: Only allow specific safe payloads for demonstration
  const safePayloads = [
    '<img src=x onerror=alert(\'XSS\')>',
    '<script>alert(\'XSS\')</script>',
    '<b>test</b>'
  ];

  if (safePayloads.includes(input)) {
    // Show visual indication without actually executing
    resultsBox.innerHTML = `
      <div class="reflected-content vulnerable-reflection">
        <strong>Search results for:</strong>
        <div class="reflected-query">
          ${input}
        </div>
        <div class="execution-warning">
          ⚠️ In a real scenario, this script would execute!
        </div>
      </div>
    `;

    // Simulate alert for educational purposes
    setTimeout(() => {
      resultsBox.innerHTML += `
        <div class="simulated-alert">
          🚨 Simulated Alert: 'XSS' would have been triggered
        </div>
      `;
    }, 500);
  } else {
    // For other inputs, still show unsafely
    resultsBox.innerHTML = `
      <div class="reflected-content">
        <strong>Search results for:</strong>
        <div class="reflected-query">${input}</div>
      </div>
    `;
  }
});
```

4. **Secure Form Handler**:
```javascript
document.getElementById('secure-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const input = document.getElementById('secure-input').value;
  const resultsBox = document.getElementById('secure-results');
  const urlParam = document.getElementById('secure-url-param');

  // Update URL display
  urlParam.textContent = encodeURLParam(input);

  // SECURE: Sanitize input before reflecting
  const sanitizedInput = sanitizeHTML(input);

  resultsBox.innerHTML = `
    <div class="reflected-content secure-reflection">
      <strong>Search results for:</strong>
      <div class="reflected-query">
        ${sanitizedInput}
      </div>
      <div class="security-note">
        ✅ Input was sanitized. HTML entities: <code>${sanitizedInput}</code>
      </div>
    </div>
  `;
});
```

5. **Input Synchronization** (optional enhancement):
```javascript
// Sync inputs between both forms for easier comparison
document.getElementById('vulnerable-input').addEventListener('input', function(e) {
  document.getElementById('secure-input').value = e.target.value;
});

document.getElementById('secure-input').addEventListener('input', function(e) {
  document.getElementById('vulnerable-input').value = e.target.value;
});
```

### CSS Animation for Reflection Effect

Add keyframe animation for the pulse effect on the reflection step:
```css
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 153, 68, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 153, 68, 0.8);
  }
}
```

Add animation for simulated alert:
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.simulated-alert {
  animation: slideIn 0.3s ease-out;
}
```

### CSS Responsive Design

Media queries for mobile devices:
```css
@media (max-width: 768px) {
  .demo-container {
    grid-template-columns: 1fr;
  }

  .characteristics-grid,
  .prevention-grid {
    grid-template-columns: 1fr;
  }

  .main-header h1 {
    font-size: 1.8rem;
  }

  .search-form {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }
}
```

### Safety Considerations
- "Vulnerable" demo uses controlled innerHTML with whitelist of safe demo payloads
- No actual XSS execution - visual simulation only
- Clear educational warnings throughout
- Input validation even in "vulnerable" demo to prevent real exploitation
- All examples are sandboxed and controlled

## HTML Document Structure

Complete document skeleton:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Understanding Reflected XSS Attacks</title>
  <style>
    /* CSS goes here - all styles inline */
  </style>
</head>
<body>
  <!-- Header Section -->
  <header class="main-header">...</header>

  <!-- Flow Diagram Section -->
  <section class="flow-diagram">...</section>

  <!-- Interactive Demo Section -->
  <section class="interactive-demo">...</section>

  <!-- Key Characteristics Section -->
  <section class="characteristics">...</section>

  <!-- Prevention Tips Section -->
  <section class="prevention">...</section>

  <!-- Footer Section -->
  <footer class="main-footer">...</footer>

  <script>
    /* JavaScript goes here - all scripts inline */
  </script>
</body>
</html>
```

### Base CSS Reset and Global Styles

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #ffffff;
}

h1, h2, h3 {
  margin-bottom: 15px;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

code {
  font-family: 'Courier New', Courier, monospace;
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

button {
  cursor: pointer;
  font-family: inherit;
}

button:hover {
  opacity: 0.9;
}

/* Additional utility classes */
.reflected-content {
  padding: 15px;
  background: white;
  border-radius: 6px;
}

.vulnerable-reflection {
  border: 2px dashed #ff4444;
  background: #fff5f5;
}

.secure-reflection {
  border: 2px solid #44ff44;
  background: #f5fff5;
}

.execution-warning {
  margin-top: 15px;
  padding: 10px;
  background: #ff4444;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
}

.simulated-alert {
  margin-top: 15px;
  padding: 15px;
  background: #fff3cd;
  border: 2px solid #ffa726;
  border-radius: 6px;
  color: #856404;
  font-weight: 600;
  text-align: center;
}

.security-note {
  margin-top: 15px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
  font-size: 0.9rem;
}
```

## Implementation Checklist

When implementing the HTML file, follow this order:

1. ✅ Create HTML5 doctype and basic structure
2. ✅ Add meta tags (charset, viewport, title)
3. ✅ Add CSS reset and global styles
4. ✅ Implement header section with gradient background
5. ✅ Implement flow diagram with colored step boxes
6. ✅ Add pulse animation CSS for reflection step
7. ✅ Implement interactive demo HTML structure (both forms)
8. ✅ Style demo boxes with proper colors and borders
9. ✅ Implement comparison panel
10. ✅ Implement characteristics grid
11. ✅ Implement prevention tips grid with hover effects
12. ✅ Implement footer
13. ✅ Add all responsive media queries
14. ✅ Implement JavaScript sanitizeHTML function
15. ✅ Implement vulnerable form event listener
16. ✅ Implement secure form event listener
17. ✅ Add input synchronization between forms
18. ✅ Test with various inputs (including XSS payloads)
19. ✅ Validate HTML
20. ✅ Test responsive design on mobile viewport

## File Output
- Primary file: `reflected-xss-demo.html`
- Location: `/Users/sebastien.boulet/git/perso/tools/reflected-xss-demo/`
- Plan file: `PLAN.md` (this file)

## Additional CSS Styling Details

### Additional styles needed:
```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Input focus states */
.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* Button hover states */
.search-button:hover {
  background: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.search-button:active {
  transform: translateY(0);
}

/* Results box when populated */
.results-box:not(:empty) {
  background: #ffffff;
  border-color: #4a90e2;
}

/* Reflected query styling */
.reflected-query {
  margin: 10px 0;
  padding: 10px;
  background: #f9f9f9;
  border-left: 3px solid #4a90e2;
  font-family: monospace;
  word-break: break-all;
}
```

## Testing Instructions

After implementation, test the following:

1. **Basic Functionality**:
   - Type in vulnerable form, submit, verify reflection appears
   - Type in secure form, submit, verify sanitized output appears
   - Verify URL parameters update correctly

2. **XSS Payload Testing**:
   - Test: `<img src=x onerror=alert('XSS')>`
   - Test: `<script>alert('XSS')</script>`
   - Test: `<b>Bold text</b>`
   - Test: Regular text input
   - Verify vulnerable side shows warning
   - Verify secure side shows HTML entities

3. **Input Synchronization** (if implemented):
   - Type in one form, verify it appears in the other

4. **Visual Testing**:
   - Verify flow diagram arrows display correctly
   - Verify pulse animation on reflection step
   - Verify color coding matches specification
   - Verify all emojis render correctly

5. **Responsive Testing**:
   - Test on mobile viewport (< 768px)
   - Verify forms stack vertically
   - Verify grids become single column
   - Verify no horizontal scroll

6. **Browser Compatibility**:
   - Test in Chrome, Firefox, Safari, Edge
   - Verify all features work across browsers

## Success Criteria
- ✅ Clear understanding that this is **Reflected XSS** (not Stored or DOM-based)
- ✅ Visual schema clearly shows the "reflection" concept
- ✅ Interactive demos demonstrate the reflection process
- ✅ Side-by-side comparison makes sanitization difference obvious
- ✅ Page is completely self-contained (no external resources)
- ✅ Educational value is high for visual learners
- ✅ Users understand: Reflected XSS = malicious input reflected back in response
- ✅ Mobile responsive design works on small screens
- ✅ All animations work smoothly
- ✅ No actual security vulnerabilities in the demo page itself

## Summary

This plan provides complete specifications for creating `reflected-xss-demo.html`:
- **6 main sections**: Header, Flow Diagram, Interactive Demo, Characteristics, Prevention Tips, Footer
- **Complete HTML structure** with all element IDs and classes specified
- **Full CSS styling** with exact colors, spacing, and responsive design
- **Complete JavaScript logic** with sanitization function and form handlers
- **Safety measures** to prevent actual XSS while demonstrating the concept
- **Implementation checklist** for step-by-step development
- **Testing instructions** to verify functionality

The file will be approximately 400-500 lines of HTML/CSS/JavaScript, completely self-contained with no external dependencies.
