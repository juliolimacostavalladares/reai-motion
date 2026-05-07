# AI Video Studio

AI-powered video creation studio integrated with Remotion. Create professional videos through an intuitive web UI powered by intelligent agents.

## Features

- 🎨 **Brand Extraction** - Automatically extract colors and tone from websites
- 📝 **Script Generation** - AI-powered script creation based on your goals
- 🎬 **Storyboard Creation** - Visual storyboarding with automatic layouts
- 🎥 **Video Composition** - Generate Remotion compositions automatically
- 👁️ **Real-time Preview** - See your video as it's being created
- 🎯 **Template System** - Pre-configured templates or generate from scratch

## Quick Start

### Prerequisites

- Node.js 16+
- Bun 1.3.3+
- Claude Code CLI (for MCP agent support)

### Installation

```bash
cd packages/ai-video-studio
bun install
```

### Development

```bash
# Start both backend and frontend
bun run dev

# Or run separately
bun run dev:backend    # Backend on http://localhost:3001
bun run dev:frontend   # Frontend on http://localhost:3000
```

### Build

```bash
bun run build
```

## Architecture

### Backend (Express + Node.js)

- REST API for project management
- Server-Sent Events (SSE) for real-time progress updates
- Integration with Remotion rendering engine
- MCP Server for Claude Code integration

### Frontend (React)

- Web UI for video creation workflow
- Real-time preview with Remotion Player
- Project management interface
- Step-by-step guided creation flow

### Agents (via MCP)

- **Brand Extractor** - Analyzes websites for brand identity
- **Script Writer** - Generates video scripts
- **Storyboard Generator** - Creates visual storyboards
- **Video Composer** - Generates Remotion code

## Project Structure

```
src/
  server/
    index.ts                 # Express app
    live-events.ts          # SSE setup
    routes/
      projects.ts           # Project CRUD
      agents.ts             # Agent endpoints
      render.ts             # Rendering endpoints
  
  mcp/
    server.ts               # MCP server setup
    tools/                  # Agent tools
  
  utils/
    brand-extractor.ts      # Brand extraction logic
    script-generator.ts     # Script generation
    storyboard-generator.ts # Storyboard creation
    composition-generator.ts # Remotion code generation
  
  types/
    index.ts                # TypeScript types
  
  web-ui/                   # React frontend
```

## API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Agents

- `POST /api/agents/extract-brand` - Extract brand from URL
- `POST /api/agents/generate-script` - Generate video script
- `POST /api/agents/generate-storyboard` - Create storyboard
- `POST /api/agents/compose-video` - Compose video

### Rendering

- `POST /api/render/:projectId` - Render final video
- `GET /api/render/:projectId/status` - Check render status

### Events

- `GET /api/events` - Server-Sent Events stream for progress updates

## Configuration

Create a `.env` file in the project root:

```env
PORT=3001
NODE_ENV=development
```

## Data Storage

Projects are stored in `.remotion-ai-studio/projects/` directory:

```
.remotion-ai-studio/
  projects/
    {projectId}/
      config.json           # Project metadata
      brand-kit.json        # Brand extraction output
      script.json           # Script generation output
      storyboard.json       # Storyboard output
      composition.tsx       # Generated Remotion code
      renders/              # Rendered videos
```

## Next Steps

- [ ] Implement MCP Server integration
- [ ] Create React frontend
- [ ] Add video rendering with @remotion/renderer
- [ ] Implement audio/music integration
- [ ] Add template system
- [ ] Deploy to production

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

See [LICENSE.md](../../LICENSE.md) for details.
