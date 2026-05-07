# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Remotion is a monorepo framework for creating videos programmatically using React. It uses **Bun** as the package manager and **Turbo** for build orchestration across 120+ packages. The codebase spans TypeScript, React, Rust (compositor), and Go (lambda-go).

## Build & Development Commands

### Core Commands

```bash
# Install dependencies (required before any other command)
bun install

# Build all packages
bun run build

# Run tests and linting
bun run test

# Format and lint check
bun run stylecheck

# Format code (fixes formatting issues)
bun run format

# Clean build artifacts
bun run clean

# Full clean (removes node_modules)
bun run cleanall
```

### Watch Mode (for active development)

```bash
# Watch all packages
bun run watch

# Watch specific package (e.g., @remotion/media)
bun run watchmedia
bun run watchcore
bun run watchcli
bun run watchstudio
bun run watchplayer
bun run watchwebrenderer
```

### Development Servers

```bash
# Remotion Studio (main dev UI for previewing compositions)
cd packages/example && bun run dev

# Player testbed (for @remotion/player changes)
cd packages/player-example && bun run dev

# Documentation site
cd packages/docs && bun run start
```

### Testing

```bash
# Run all tests
bun run test

# Run tests for a specific package
cd packages/<package-name> && bun test

# Run tests with timeout (e.g., 60 seconds)
bun test src --timeout 60000

# E2E tests
bun run teste2e

# Lambda tests
bun run testlambda

# Web renderer tests (single concurrency)
bun run testwebrenderer

# SSR tests
bun run testssr

# Template tests
bun run testtemplates
```

### Rendering Videos (from packages/example)

```bash
# List available compositions
bunx remotion compositions

# Render a video
bunx remotion render <composition-id> --output ../../out/video.mp4

# Render a still image
bunx remotion still <composition-id> --output ../../out/still.png
```

## Code Style & Formatting

### Formatters

- **Prettier**: Used for JS/TS/JSON/YAML/Markdown
- **Oxfmt**: Used for Rust code
- **ESLint**: Linting for TypeScript/JavaScript

### Configuration

- **Prettier config**: `.prettierrc.js` — single quotes, tabs, bracket spacing off
- **Oxfmt config**: `.oxfmtrc.json` — similar to Prettier, ignores template packages
- **TypeScript**: `tsconfig.json` with strict mode enabled, ES2018 target

### Pre-commit Hook

The `prepare` script in `package.json` sets git hooks to `.githooks`. The pre-commit hook runs `bun pre-commit.ts`, which:
- Detects changed files
- Runs formatting on affected packages
- Runs linting on affected packages

**Before committing:**
1. Run `bun run build` to verify all packages build
2. Run `bun run stylecheck` to ensure CI passes
3. Include `bun.lock` if dependencies changed

## Monorepo Architecture

### Structure

- **120+ packages** in `packages/` directory
- **Turbo** orchestrates builds with task dependencies defined in `turbo.json`
- **Bun workspaces** for dependency management (see `package.json` workspaces field)
- **TypeScript project references** in `tsconfig.json` for incremental builds

### Key Packages

**Core:**
- `remotion` — Main framework package
- `@remotion/core` — Core video composition logic
- `@remotion/cli` — Command-line interface

**Rendering:**
- `@remotion/renderer` — Video rendering engine
- `@remotion/web-renderer` — Web-based renderer
- `@remotion/media` — Media handling and codecs
- `@remotion/media-parser` — Media file parsing
- `@remotion/webcodecs` — WebCodecs integration

**UI & Playback:**
- `@remotion/studio` — Interactive composition editor
- `@remotion/studio-server` — Studio backend
- `@remotion/player` — Embeddable video player

**Serverless:**
- `@remotion/lambda` — AWS Lambda rendering
- `@remotion/serverless` — Serverless rendering abstraction
- `@remotion/streaming` — Streaming video output

**Utilities & Effects:**
- `@remotion/animation-utils` — Animation helpers
- `@remotion/media-utils` — Media utilities
- `@remotion/shapes` — SVG shape components
- `@remotion/three` — Three.js integration
- `@remotion/lottie` — Lottie animation support
- `@remotion/captions` — Caption generation
- `@remotion/transitions` — Transition effects
- `@remotion/motion-blur` — Motion blur effects

**Documentation & Examples:**
- `@remotion/docs` — Docusaurus documentation site
- `@remotion/example` — Main example/testbed composition
- `@remotion/player-example` — Player component testbed

### Build Dependencies

Turbo tasks have dependencies defined in `turbo.json`. Key patterns:
- `"dependsOn": ["^make"]` — depends on dependencies' `make` tasks
- `"dependsOn": ["make"]` — depends on this package's `make` task
- `"outputs": ["dist"]` — caches the `dist` directory
- `@remotion/example#bundle` — depends on all packages being built first

## Version Management

- Current version: `packages/core/src/version.ts` (auto-generated on publish)
- Patch version increments on each release
- Version is synced across all packages via the monorepo

## Pull Request Guidelines

- **Title format**: `` `[package-name]`: [commit-message] ``
- **Example**: `` `@remotion/player`: Add new feature ``
- Include `bun.lock` in commits when dependencies change
- Run `bun run build` and `bun run stylecheck` before pushing

## Known Caveats

- `@remotion/lambda-go` requires Go >= 1.23.0 (VM ships 1.22.2, so lint may fail — non-blocking)
- `@remotion/openai-whisper` tests require `OPENAI_API_KEY` env var (1 test fails without it — expected)
- Remotion Studio sometimes reports "Already running on port 3000" if previous instance still bound — check with `curl http://localhost:3000`
- Always run `bun run build` after `bun install` before running tests or starting Studio, as packages depend on built artifacts

## Testing Strategy

- **Unit tests**: Vitest with Playwright for browser tests
- **E2E tests**: Playwright for integration testing
- **Lambda tests**: Concurrency=1 to avoid resource conflicts
- **Web renderer tests**: Concurrency=1 for stability
- **Template tests**: Verify starter templates work correctly

## Useful Patterns

### Running a single test file
```bash
cd packages/<package-name> && bun test src/path/to/test.ts
```

### Building a specific package and dependencies
```bash
bun run build --filter='@remotion/player'
```

### Checking what changed
```bash
git diff HEAD~1
git status
```

### Debugging with logs
Set `TURBO_TELEMETRY_DISABLED=1` to disable telemetry if needed.

## Documentation

- Main docs: `packages/docs/` (Docusaurus)
- Contribution guide: https://remotion.dev/docs/contributing
- API reference: https://remotion.dev/api
- See [AGENTS.md](AGENTS.md) for detailed project guidance
