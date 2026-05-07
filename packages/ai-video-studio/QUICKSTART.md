# Quick Start Guide - AI Video Studio

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd packages/ai-video-studio
bun install
```

### Step 2: Setup Environment

```bash
cp .env.example .env
```

### Step 3: Start Backend

```bash
bun run dev:backend
```

You should see:
```
🚀 AI Video Studio Backend running on http://localhost:3001
📡 Live events available at http://localhost:3001/api/events
🎬 Ready to create videos!
```

### Step 4: Test the API

In a new terminal:

```bash
bun run test-api.ts
```

This will:
- ✅ Check backend health
- ✅ Create a test project
- ✅ Extract brand from remotion.dev
- ✅ Generate a video script
- ✅ Create a storyboard
- ✅ Generate Remotion composition code

### Step 5: Use with Claude Code

```bash
claude "Create a 30-second video for https://remotion.dev"
```

Claude will guide you through the process!

## 📁 Where Are My Files?

All project files are saved in:
```
.remotion-ai-studio/projects/{project-id}/
├── brand-kit.json       # Extracted brand colors and fonts
├── script.json          # Generated video script
├── storyboard.json      # Visual storyboard
├── composition.tsx      # Remotion code
└── config.json          # Project metadata
```

## 🎬 What Can I Do?

### Create a Marketing Video
```bash
claude "Create a professional marketing video for my website https://example.com. 
Target audience: business professionals. Duration: 30 seconds."
```

### Create an Explainer Video
```bash
claude "Create an explainer video about our SaaS product. 
Website: https://myapp.com. Make it friendly and easy to understand."
```

### Create Social Media Content
```bash
claude "Create a 15-second video optimized for Instagram. 
Website: https://mybrand.com. Make it energetic and eye-catching."
```

## 🔧 Troubleshooting

### Backend won't start?
- Check if port 3001 is available
- Run `bun install` again
- Check `.env` file exists

### MCP not working?
- Verify `.claude/mcp.json` is configured
- Restart Claude Code
- Check backend is running

### Tests failing?
- Ensure backend is running first
- Check internet connection (for website scraping)
- Review error messages

## 📚 Learn More

- [Full Setup Guide](./SETUP.md)
- [Claude Code Integration](./CLAUDE_CODE_GUIDE.md)
- [Architecture Overview](./AI_VIDEO_STUDIO_ARCHITECTURE.md)
- [Implementation Details](./IMPLEMENTATION_SUMMARY.md)

## 🎯 Next Steps

1. ✅ Backend is working
2. ⏳ Create React frontend (coming soon)
3. ⏳ Add video rendering
4. ⏳ Create more templates
5. ⏳ Add audio integration

---

**Need help?** Check the documentation or open an issue on GitHub.

**Ready to create amazing videos?** Let's go! 🚀
