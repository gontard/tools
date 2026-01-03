# Reflected XSS Demo

## Goal

Interactive educational page explaining Reflected XSS attacks through visual diagrams and safe, sandboxed demonstrations. Targets developers and security learners who prefer visual learning over text-heavy explanations.

## Architecture

- **Type**: Single HTML file
- **Stack**: HTML5, CSS3 (inline), vanilla JavaScript (inline)
- **Files**:
  ```
  reflected-xss-demo/
  ├── PLAN.md
  └── index.html
  ```

## Steps

- [ ] Step 1: Create HTML skeleton with doctype, meta tags, and section structure
- [ ] Step 2: Implement CSS reset, global styles, and color variables
- [ ] Step 3: Build header section with gradient background
- [ ] Step 4: Build flow diagram showing 5-step attack process with animations
- [ ] Step 5: Build interactive demo with vulnerable and secure side-by-side forms
- [ ] Step 6: Build comparison panel showing sanitization difference
- [ ] Step 7: Build characteristics grid (5 key traits)
- [ ] Step 8: Build prevention tips grid (5 strategies)
- [ ] Step 9: Implement JavaScript: sanitization function and form handlers
- [ ] Step 10: Add responsive media queries for mobile

## Specifications

### Page Sections

1. **Header**: Title "Understanding Reflected XSS Attacks", subtitle, description
2. **Flow Diagram**: 5 steps showing attack flow (Attacker creates URL → Victim clicks → Server reflects → Browser executes → Malicious action)
3. **Interactive Demo**: Two forms side-by-side (vulnerable vs secure)
4. **Comparison Panel**: Shows same input handled both ways
5. **Characteristics**: 5 key traits of Reflected XSS
6. **Prevention Tips**: 5 mitigation strategies
7. **Footer**: Educational disclaimer, OWASP link

### Color Scheme

| Element | Background | Border |
|---------|------------|--------|
| Header | gradient #4a90e2 → #357abd | - |
| Attacker/Danger | #ffebee | #ff4444 |
| Victim | #e3f2fd | #2196f3 |
| Server | #f5f5f5 | #757575 |
| Browser | #fff3e0 | #ff9944 |
| Success | #e8f5e9 | #44ff44 |

### Interactive Demo Behavior

**Vulnerable form:**
- Reflects input using innerHTML (simulated danger)
- Whitelist of safe demo payloads: `<img src=x onerror=alert('XSS')>`, `<script>alert('XSS')</script>`, `<b>test</b>`
- Shows warning + simulated alert for recognized payloads

**Secure form:**
- Sanitizes input before reflection using HTML entity encoding
- Shows the escaped output

**Sanitization function:**
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

### Animations

- Pulse animation on "Server Reflects" step (box-shadow 0 0 20px → 30px)
- SlideIn animation for simulated alert

## Testing

- Enter `<img src=x onerror=alert('XSS')>` in vulnerable form → warning + simulated alert
- Enter same in secure form → displays as escaped text `&lt;img...`
- Enter regular text in both → reflected normally
- Resize to < 768px → forms stack vertically, grids become single column
- Verify no actual script execution occurs (open browser console)

## Acceptance Criteria

- [ ] Flow diagram clearly shows "reflection" concept with 5 distinct steps
- [ ] Interactive demo shows difference between vulnerable and secure handling
- [ ] No actual XSS vulnerabilities (whitelist + simulation only)
- [ ] Responsive on mobile devices (< 768px breakpoint)
- [ ] Self-contained single HTML file with all CSS/JS inline
- [ ] Educational warnings clearly visible
