# AI Video Studio - Setup Guide

## Prerequisites

1. **Node.js 16+** and **Bun 1.3.3+**
2. **Claude Code CLI** (for MCP agent support)

## Installation Steps

### 1. Install Dependencies

```bash
cd packages/ai-video-studio
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure as needed.

### 3. Configure MCP for Claude Code

Add the MCP server to your Claude Code configuration:

**Option A: Project-level (Recommended)**

Create or edit `.claude/mcp.json` in the project root:

```json
{
  "mcpServers": {
    "remotion-ai-video-studio": {
      "command": "bun",
      "args": [
        "packages/ai-video-studio/src/mcp/server.ts"
      ],
      "cwd": "C:\\Users\\julio\\Documents\\reai-motion"
    }
  }
}
```

**Option B: Global configuration**

Edit `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "remotion-ai-video-studio": {
      "command": "bun",
      "args": [
        "C:\\Users\\julio\\Documents\\reai-motion\\packages\\ai-video-studio\\src\\mcp\\server.ts"
      ]
    }
  }
}
```

### 4. Start the Development Server

```bash
# Start both backend and frontend
bun run dev

# Or start separately
bun run dev:backend    # Backend on http://localhost:3001
bun run dev:frontend   # Frontend on http://localhost:3000 (when implemented)
```

### 5. Test MCP Connection

Open Claude Code and try:

```
Can you help me create a video for https://example.com?
```

Claude should be able to call the MCP tools to extract brand information.

## Verification

### Check Backend is Running

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-05-07T...",
  "version": "1.0.0"
}
```

### Check MCP Server

The MCP server runs when Claude Code calls it. Check logs in Claude Code for:
```
AI Video Studio MCP Server running on stdio
```

### Test SSE Events

```bash
curl -N http://localhost:3001/api/events
```

Should establish an SSE connection and send:
```
data: {"type":"connected","clientId":"client-..."}
```

## Troubleshooting

### MCP Server Not Found

- Verify the path in `.claude/mcp.json` is correct
- Ensure `bun` is in your PATH
- Try absolute paths instead of relative

### Backend Won't Start

- Check if port 3001 is already in use
- Verify all dependencies are installed: `bun install`
- Check `.env` file exists and is valid

### CORS Errors

- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS configuration in `src/server/index.ts`

## Next Steps

1. **Implement Frontend** - Create React UI in `web-ui/`
2. **Test Agents** - Try each agent endpoint via API
3. **Add Templates** - Create Remotion templates in `templates/`
4. **Implement Rendering** - Add video rendering with `@remotion/renderer`

## Development Workflow

1. Make changes to backend code
2. Server auto-restarts (via `tsx watch`)
3. Test via API or Claude Code
4. Check logs for errors

## Production Deployment

TODO: Add production deployment instructions

## Support

For issues, see the main [CONTRIBUTING.md](../../CONTRIBUTING.md) or open an issue on GitHub.
