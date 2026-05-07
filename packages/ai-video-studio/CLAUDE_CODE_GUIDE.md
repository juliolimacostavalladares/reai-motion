# AI Video Studio - Claude Code Integration Guide

## Quick Start with Claude Code

### Example 1: Create a Video from Website

```bash
claude "Create a professional marketing video for https://example.com. 
The video should be 30 seconds long and explain our main product benefits.
Target audience is business professionals."
```

**What happens:**
1. Claude extracts brand colors and tone from the website
2. Asks clarifying questions about your video goals
3. Generates a script based on your answers
4. Creates a storyboard with visual descriptions
5. Generates Remotion composition code
6. Returns a preview link

### Example 2: Create Video with Custom Questionnaire

```bash
claude "Create a video with these specs:
- Website: https://mycompany.com
- Goal: Explain our SaaS product
- Audience: Startup founders
- Duration: 45 seconds
- Main message: We save you 10 hours per week
- Call to action: Start free trial"
```

### Example 3: Iterate on Existing Project

```bash
claude "I have a video project in progress. 
Can you regenerate the script to be more energetic and add a stronger CTA?"
```

## MCP Tools Available

### 1. extract_brand

Extracts brand identity from a website.

**Input:**
```json
{
  "url": "https://example.com",
  "sessionId": "session-123"
}
```

**Output:**
```json
{
  "colors": {
    "primary": "#0066CC",
    "secondary": "#FF6B35",
    "accent": "#F7B801",
    "background": "#FFFFFF",
    "text": "#000000"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Open Sans"
  },
  "tone": "professional, energetic"
}
```

### 2. generate_script

Creates a video script based on brand and questionnaire.

**Input:**
```json
{
  "brandKit": {...},
  "questionnaire": {
    "videoGoal": "Explain product benefits",
    "targetAudience": "Business professionals",
    "duration": 30,
    "mainMessage": "Save time and money",
    "callToAction": "Start free trial"
  },
  "sessionId": "session-123"
}
```

**Output:**
```json
{
  "scenes": [
    {
      "id": "scene-1",
      "duration": 5,
      "text": "Introducing our solution",
      "voiceOver": "Welcome. Today we're sharing something special.",
      "visualDescription": "Logo animation with fade-in effect"
    }
  ],
  "totalDuration": 30,
  "musicStyle": "upbeat, modern",
  "pacing": "medium"
}
```

### 3. generate_storyboard

Creates visual storyboard from script.

**Input:**
```json
{
  "script": {...},
  "brandKit": {...},
  "sessionId": "session-123"
}
```

**Output:**
```json
{
  "scenes": [
    {
      "id": "scene-1",
      "thumbnail": "data:image/svg+xml;base64,...",
      "layout": "centered",
      "elements": [...]
    }
  ]
}
```

### 4. compose_video

Generates Remotion composition code.

**Input:**
```json
{
  "storyboard": {...},
  "template": "marketing",
  "brandKit": {...},
  "projectId": "project-123",
  "sessionId": "session-123"
}
```

**Output:**
```json
{
  "compositionPath": "/path/to/composition.tsx",
  "previewUrl": "/preview/project-123"
}
```

## Workflow Diagram

```
User Input (Claude Code)
        ↓
┌─────────────────────────────────┐
│  Claude Code CLI                │
│  (Orchestrates agents)          │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  MCP Tools                      │
│  1. extract_brand               │
│  2. generate_script             │
│  3. generate_storyboard         │
│  4. compose_video               │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Backend Server                 │
│  (Processes requests)           │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Output Files                   │
│  - brand-kit.json               │
│  - script.json                  │
│  - storyboard.json              │
│  - composition.tsx              │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Web UI / Preview               │
│  (User sees video preview)      │
└─────────────────────────────────┘
```

## Advanced Usage

### Custom Templates

```bash
claude "Create a video using the 'social-media' template.
Website: https://example.com
Duration: 15 seconds (optimized for TikTok/Instagram)"
```

### Regenerate Specific Phase

```bash
claude "I like the script but want to regenerate the storyboard 
with a different visual style. Make it more minimalist."
```

### Export and Render

```bash
claude "The video looks good. Can you render it as an MP4 file 
with high quality?"
```

## Troubleshooting

### "MCP tool not found"

- Ensure `.claude/mcp.json` is configured correctly
- Restart Claude Code
- Check that the backend server is running

### "Failed to extract brand"

- Verify the website URL is accessible
- Check internet connection
- Try a different website

### "Script generation failed"

- Ensure all questionnaire fields are filled
- Check that brandKit was successfully extracted
- Review error message for specific issues

## Tips & Best Practices

1. **Be specific** - Provide clear goals and target audience
2. **Use real websites** - Better brand extraction with actual sites
3. **Iterate** - You can regenerate any phase multiple times
4. **Preview first** - Always preview before rendering
5. **Save projects** - Projects are automatically saved locally

## Next Steps

- [ ] Implement web UI for visual project management
- [ ] Add audio/music integration
- [ ] Create more templates (product demo, testimonial, etc.)
- [ ] Add video rendering with @remotion/renderer
- [ ] Implement user authentication for cloud storage
- [ ] Add collaboration features

## Support

For issues or questions:
1. Check the [SETUP.md](./SETUP.md) guide
2. Review error messages in Claude Code
3. Check backend logs: `tail -f .remotion-ai-studio/logs.txt`
4. Open an issue on GitHub

---

**Happy video creating! 🎬**
