# Dynamic renderer workspace (bun + turborepo)

This workspace implements the PRD for a chat-driven parent app and iframe renderer that can load UI and Remotion video payloads at runtime.

## Apps
- `apps/parent` — orchestration UI that handshakes with the renderer, sends `renderer:load` payloads, shows debug events, and offers sample payloads for ui-spec/ui-code/video-spec/video-code.
- `apps/renderer` — stable iframe host exposed at `/embed`; validates origins, emits `renderer:ready`, handles `renderer:load`, and renders via ui/video runtimes while streaming resize/error events back.
- `apps/render-worker` — stub server for server-side Remotion export with an opt-in `ENABLE_REMOTION_RENDER` flag (uses `@remotion/renderer` when enabled).

## Packages
- `@repo/runtime-protocol` — shared message and payload contracts.
- `@repo/design-system` — primitives (Page, Stack, Grid, Card, Text, Button, Badge, Divider, Image, Table, Metric, Tabs, charts).
- `@repo/ui-runtime` — spec validator, registry, recursive renderer, and code-runtime (sucrase + guarded dependency scope).
- `@repo/video-runtime` — Remotion `DynamicComposition`, video spec renderer, code-runtime, and shared `RemotionRoot`.

## Running locally (bun)
```bash
bun install
bun run dev    # launches all apps via turbo
# or separately
cd apps/parent && bun dev    # http://localhost:3000
cd apps/renderer && bun dev  # http://localhost:3001 (iframe host /embed)
```

## Rendering flow
1) Renderer sends `renderer:ready` from `/embed` with supported kinds.  
2) Parent posts `renderer:load` containing `ui-spec` / `ui-code` / `video-spec` / `video-code`.  
3) Renderer renders payload, emits `renderer:resize` for dynamic height and `renderer:error` on failures.

## Server-side export
`apps/render-worker` exposes `POST /render` accepting a `RenderJob`. By default it returns a stub response; set `ENABLE_REMOTION_RENDER=true` to attempt Remotion rendering via `@remotion/renderer` (writes files to `./renders`).

## Notes
- Package manager is `bun` (`packageManager: bun@1.3.10`).
- UI/video code runtimes whitelist dependencies and cap source size to reduce risk.
- Allowed parent origins for `/embed` can be set via `NEXT_PUBLIC_ALLOWED_PARENTS` (comma separated).
