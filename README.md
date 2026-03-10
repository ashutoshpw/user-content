# User Content - Dynamic Chat-Generated UI + Remotion Runtime

A monorepo implementation of a system where a parent chat app generates novel interfaces at runtime and renders them inside an iframe-backed renderer app, supporting both dynamic interactive UI micro-apps and dynamic Remotion-based video compositions.

## Architecture

### Apps

- **parent** - Chat interface, orchestration, and payload generation (Next.js on port 3000)
- **renderer** - Iframe runtime host for UI + Remotion preview (Next.js on port 3001)
- **render-worker** - Server-side Remotion export service (Express on port 3002)

### Packages

- **runtime-protocol** - Shared message contracts and payload schemas
- **ui-runtime** - UI spec renderer + code runtime
- **video-runtime** - DynamicComposition + Remotion spec/code runtime
- **design-system** - Shared primitives and styling tokens

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.3.10 or later
- Node.js 18 or later (for compatibility)

### Installation

```bash
# Install bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install
```

### Development

```bash
# Run all apps in development mode
bun dev

# Or run specific apps
cd apps/parent && bun dev      # Parent app on http://localhost:3000
cd apps/renderer && bun dev    # Renderer app on http://localhost:3001
cd apps/render-worker && bun dev # Render worker on http://localhost:3002
```

### Build

```bash
# Build all apps and packages
bun run build
```

## Runtime Model

The parent app owns generation, session state, and orchestration.

The renderer app is a stable iframe host loaded from a single URL:
- `/embed` - Main renderer endpoint
- `/embed?mode=ui` - UI-specific mode (optional)
- `/embed?mode=video` - Video-specific mode (optional)

The parent sends a payload after a handshake. The payload determines what gets rendered.

### Supported Runtime Kinds

```typescript
type RenderKind = "ui" | "video";
type RuntimeMode = "spec" | "code";
```

Supported combinations:
- `ui-spec` - Declarative UI using predefined primitives
- `ui-code` - Dynamic TSX/JSX compilation and execution
- `video-spec` - Declarative Remotion video using primitives
- `video-code` - Dynamic Remotion component compilation

## Features

### Phase 1 - Protocol & Handshake ✅
- Stable parent ↔ iframe communication
- Generic renderer shell
- Resize and error propagation

### Phase 2 - UI Runtime (Spec) ✅
- Declarative UI DSL/AST
- 15+ UI primitives (Page, Stack, Row, Grid, Card, Text, Button, Badge, Divider, Image, Table, BarChart, LineChart, AreaChart, Metric, Tabs)
- Spec validation and error handling

### Phase 3 - UI Runtime (Code) ✅
- Browser-side TSX/JSX compilation
- Constrained dependency injection
- Error boundaries and timeouts

### Phase 4 - Video Runtime ✅
- DynamicComposition for Remotion
- Live preview in iframe using @remotion/player
- 12+ Remotion primitives (AbsoluteFill, Sequence, Text, Image, Audio, Video, TitleScene, MetricScene, ChartBarScene, FadeIn, SlideUp, AnimatedNumber)

### Phase 5 - Remotion Studio ✅
- Studio compatibility layer
- Shared dynamic composition
- Dev workflow for debugging

### Phase 6 - Server-side Export ✅
- Render worker for MP4/WebM export
- Job queue and status tracking
- Same payload model as preview

## Environment Variables

### Parent App

Create `apps/parent/.env.local`:
```bash
NEXT_PUBLIC_RENDERER_URL=http://localhost:3001/embed
```

### Renderer App

Create `apps/renderer/.env.local`:
```bash
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000
```

## Example Payloads

### UI Spec Example

```json
{
  "kind": "ui",
  "mode": "spec",
  "spec": {
    "type": "Page",
    "children": [
      {
        "type": "Card",
        "props": { "title": "Dashboard" },
        "children": [
          {
            "type": "Metric",
            "props": {
              "value": "1,234",
              "label": "Active Users",
              "change": "+12.5%"
            }
          }
        ]
      }
    ]
  }
}
```

### Video Spec Example

```json
{
  "kind": "video",
  "mode": "spec",
  "fps": 30,
  "durationInFrames": 150,
  "width": 1280,
  "height": 720,
  "spec": {
    "type": "AbsoluteFill",
    "children": [
      {
        "type": "TitleScene",
        "props": {
          "title": "Welcome",
          "subtitle": "Dynamic Video"
        }
      }
    ]
  }
}
```

## Project Structure

```
.
├── apps/
│   ├── parent/              # Next.js chat interface
│   │   ├── src/
│   │   │   ├── app/
│   │   │   └── components/
│   │   └── package.json
│   ├── renderer/            # Next.js renderer host
│   │   ├── src/
│   │   │   ├── app/
│   │   │   └── remotion/
│   │   └── package.json
│   └── render-worker/       # Express render service
│       ├── src/
│       └── package.json
├── packages/
│   ├── runtime-protocol/    # Message types
│   ├── ui-runtime/          # UI renderer
│   ├── video-runtime/       # Video renderer
│   └── design-system/       # Shared components
├── package.json             # Root workspace
├── turbo.json              # Turborepo config
└── bun.lockb               # Bun lockfile
```

## Security Considerations

- Origin validation for iframe messages
- Strict dependency whitelisting in code mode
- Payload schema validation
- Maximum code size limits
- Error boundaries for safe failures

## Deployment

### Production Build

```bash
bun run build
```

### Running in Production

```bash
# Parent app
cd apps/parent && bun start

# Renderer app
cd apps/renderer && bun start

# Render worker
cd apps/render-worker && bun start
```

## Contributing

This is a monorepo managed by Turborepo and Bun workspaces. All packages are private and part of the `@user-content` scope.

## License

Private - Not for distribution
