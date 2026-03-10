# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo for dynamic UI and video content generation. A parent chat app generates novel interfaces at runtime and renders them inside iframe-backed renderer apps. Supports four render modes: UI spec, UI code, video spec, and video code.

## Commands

```bash
bun install          # Install all dependencies
bun dev              # Run all apps in dev (parent:4419, renderer:7318, render-worker:9386)
bun build            # Build all apps and packages (turborepo orchestrated)
bun lint             # Lint all packages
bun test             # Run tests
bun clean            # Clean builds and node_modules

# Single package/app
bun --filter @user-content/ui-runtime build
bun --filter parent dev
```

## Architecture

**Apps:**
- `apps/parent` — Next.js 15 chat interface that generates render payloads and sends them to the renderer via iframe postMessage
- `apps/renderer` — Next.js 15 universal iframe host at `/embed`, renders all four payload types using ui-runtime and video-runtime packages
- `apps/render-worker` — Express server for server-side Remotion video export (MP4/WebM)

**Packages:**
- `packages/runtime-protocol` — TypeScript types for parent↔renderer postMessage communication (RenderPayload, message types, version tracking)
- `packages/design-system` — Foundational React components (Page, Stack, Row, Grid, Card, Text, Button, Badge, Table, Metric, Tabs, etc.)
- `packages/ui-runtime` — Renders UI specs (declarative JSON AST) or compiles/executes JSX code at runtime via Babel standalone. Contains component registry, spec schema validation, and CodeRuntime with sandboxed execution
- `packages/video-runtime` — Same pattern for Remotion video: spec-based or code-based rendering with its own registry (AbsoluteFill, Sequence, TitleScene, ChartBarScene, animations, etc.)

## Key Patterns

**Render payload flow:** Parent sends `renderer:load` message with a `RenderPayload` (one of `ui-spec`, `ui-code`, `video-spec`, `video-code`) → Renderer receives via postMessage → Delegates to ui-runtime or video-runtime → Renderer sends back `renderer:ready`, `renderer:resize`, or `renderer:error`.

**Code runtime security:** Both ui-runtime and video-runtime compile user code with Babel standalone in the browser, enforce a 50KB code size limit, and inject only whitelisted dependencies (no direct global access).

**Build order matters:** Turborepo handles this via `^build` dependencies. Packages must build before apps. The dependency chain is: runtime-protocol → design-system → ui-runtime/video-runtime → apps.

**iframe origin validation:** Renderer checks `NEXT_PUBLIC_ALLOWED_ORIGINS` for incoming messages.

## Environment Variables

- `apps/parent`: `NEXT_PUBLIC_RENDERER_URL` (default: `http://localhost:7318/embed`)
- `apps/renderer`: `NEXT_PUBLIC_ALLOWED_ORIGINS` (default: `http://localhost:3000,http://localhost:4419`)
- `apps/render-worker`: `PORT` (default: 9386 dev / 3002 prod)

## Tech Stack

Bun 1.3.10, Turborepo 2.3.3, Next.js 15.3.0, React 18.3.1, TypeScript 5.7.2, Remotion 4.0.286, Babel standalone 7.26.5, Recharts 2.15.0
