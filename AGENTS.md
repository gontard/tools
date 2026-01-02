# Tool Development Template

## Purpose
This document provides a standard structure for creating PLAN.md files for new tools. Follow this template to ensure consistency and completeness across all projects in this repository.

## Standard PLAN.md Structure

Every tool should have a PLAN.md file with these sections:

### 1. Overview & Goal
- One-line project description
- What problem it solves or what it teaches
- Primary outcome/deliverable

### 2. Target Audience
- Who will use this tool
- What knowledge level is assumed
- What they should gain from using it

### 3. Architecture
**Decision Matrix:**
- **Single HTML file** ’ Educational demos, visualizations, simple utilities (see: reflected-xss-demo)
- **Frontend + Backend** ’ API integration, data processing, dynamic content (see: youtube-transcript-tool)
- **Full Stack** ’ User accounts, databases, complex workflows

**Document:**
- Technology stack with WHY for each choice
- System components and how they interact
- Deployment strategy

### 4. Implementation Plan
- File structure (list all files to be created)
- Component/section breakdown
- Implementation order (numbered steps)
- Code examples for complex logic

### 5. Technical Specifications

**For Frontend:**
- UI components with styling details (colors, spacing, responsive breakpoints)
- HTML structure with semantic elements
- CSS approach (inline, external, framework)
- JavaScript functionality

**For Backend:**
- API endpoints with request/response examples
- Error handling strategy
- Dependencies and why they're needed
- Security/safety considerations

### 6. Testing Strategy
**Required test types:**
- Functional testing (feature works as specified)
- Error handling (graceful failures)
- Cross-browser compatibility
- Responsive design (if applicable)
- Specific test cases with example inputs

### 7. Deployment & Delivery
- Output file locations
- Deployment process steps
- Platform choice justification (GitHub Pages, Vercel, etc.)
- Configuration requirements

### 8. Success Criteria
Use checkbox format:
```
 User can [perform action]
 Tool [displays/processes/handles] [specific feature]
 Error messages are clear and actionable
 Works on mobile devices (if applicable)
```

### 9. Constraints & Limitations
- Technical limitations
- Legal/ethical considerations
- Known issues or edge cases
- Future enhancement ideas (optional)

### 10. Timeline & Scope
- Estimated effort breakdown by phase
- Total time estimate
- Dependencies or blockers

## Documentation Standards

### Code Examples
- Use proper markdown syntax highlighting
- Include function signatures with parameters
- Show both vulnerable and secure examples (for security tools)
- Provide complete, runnable code snippets

### API Specifications
```json
// Request format
{"field": "value"}

// Success response
{"success": true, "data": [...]}

// Error response
{"success": false, "error": "message"}
```

### Styling Documentation
- Exact color values (#hex or rgb)
- Spacing in px/rem/em
- Font sizes and weights
- Responsive breakpoints
- Animation keyframes if applicable

### Safety Considerations
For security/vulnerability demos:
- Whitelist safe payloads only
- Visual simulation instead of real execution
- Clear educational warnings
- No actual exploitable vulnerabilities

## Quick Start Checklist

Before writing code, ensure your PLAN.md covers:

**Context**
- [ ] Clear goal statement
- [ ] Target audience identified
- [ ] Success definition

**Architecture**
- [ ] Tech stack chosen with rationale
- [ ] Component structure defined
- [ ] Deployment strategy documented

**Implementation**
- [ ] File structure specified
- [ ] Step-by-step implementation order
- [ ] Code examples for complex parts

**Quality**
- [ ] Testing strategy with specific cases
- [ ] Error handling documented
- [ ] Success criteria checklist

**Delivery**
- [ ] Output locations specified
- [ ] Deployment steps documented
- [ ] Limitations acknowledged

## Examples
- **Simple tool**: `reflected-xss-demo/PLAN.md` - Single HTML file, inline styles/scripts
- **Complex tool**: `youtube-transcript-tool/PLAN.md` - Frontend + serverless backend, external APIs

## Tips
- Start with WHY (goal), then WHAT (architecture), then HOW (implementation)
- Include more detail for complex sections, less for straightforward parts
- Reference existing code patterns from similar tools
- Keep code examples minimal but complete
- Make success criteria measurable and testable
