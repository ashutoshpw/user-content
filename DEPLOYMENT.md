# Deployment Guide

This guide covers deploying the User Content monorepo applications.

## Prerequisites

- Bun 1.3.10 or later installed
- Node.js 18+ (for compatibility)
- Git

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd user-content
bun install
```

### 2. Configure Environment Variables

#### Parent App

Create `apps/parent/.env.local`:
```bash
NEXT_PUBLIC_RENDERER_URL=http://localhost:3001/embed
```

#### Renderer App

Create `apps/renderer/.env.local`:
```bash
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Run in Development

```bash
# Run all apps in development mode
bun dev

# Or run individual apps
cd apps/parent && bun dev      # Port 3000
cd apps/renderer && bun dev    # Port 3001
cd apps/render-worker && bun dev # Port 3002
```

### 4. Access Applications

- **Parent App**: http://localhost:3000
- **Renderer App**: http://localhost:3001/embed
- **Render Worker**: http://localhost:3002

## Production Build

### Build All Packages

```bash
bun run build
```

This will:
1. Build all shared packages (runtime-protocol, design-system, ui-runtime, video-runtime)
2. Build all Next.js apps (parent, renderer)
3. Compile the render-worker TypeScript

### Start Production Servers

```bash
# Parent app
cd apps/parent && bun start

# Renderer app
cd apps/renderer && bun start

# Render worker
cd apps/render-worker && bun start
```

## Deployment Options

### Option 1: Deploy to Vercel (Recommended for Next.js apps)

#### Parent App

```bash
cd apps/parent
vercel
```

Environment variables to set:
- `NEXT_PUBLIC_RENDERER_URL`: URL of your deployed renderer (e.g., https://renderer.vercel.app/embed)

#### Renderer App

```bash
cd apps/renderer
vercel
```

Environment variables to set:
- `NEXT_PUBLIC_ALLOWED_ORIGINS`: Comma-separated list of allowed parent origins (e.g., https://parent.vercel.app)

### Option 2: Docker Deployment

#### Parent App Dockerfile

```dockerfile
FROM oven/bun:1.3.10 as builder
WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/parent ./apps/parent
COPY packages ./packages
COPY turbo.json ./
RUN bun install
RUN bun run build --filter=@user-content/parent

FROM oven/bun:1.3.10-slim
WORKDIR /app
COPY --from=builder /app/apps/parent/.next ./apps/parent/.next
COPY --from=builder /app/apps/parent/public ./apps/parent/public
COPY --from=builder /app/apps/parent/package.json ./apps/parent/
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/apps/parent
EXPOSE 3000
CMD ["bun", "start"]
```

#### Renderer App Dockerfile

```dockerfile
FROM oven/bun:1.3.10 as builder
WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/renderer ./apps/renderer
COPY packages ./packages
COPY turbo.json ./
RUN bun install
RUN bun run build --filter=@user-content/renderer

FROM oven/bun:1.3.10-slim
WORKDIR /app
COPY --from=builder /app/apps/renderer/.next ./apps/renderer/.next
COPY --from=builder /app/apps/renderer/public ./apps/renderer/public
COPY --from=builder /app/apps/renderer/package.json ./apps/renderer/
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/apps/renderer
EXPOSE 3001
CMD ["bun", "start"]
```

#### Render Worker Dockerfile

```dockerfile
FROM oven/bun:1.3.10 as builder
WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/render-worker ./apps/render-worker
COPY packages ./packages
COPY turbo.json ./
RUN bun install
RUN bun run build --filter=@user-content/render-worker

FROM oven/bun:1.3.10-slim
WORKDIR /app
COPY --from=builder /app/apps/render-worker/dist ./apps/render-worker/dist
COPY --from=builder /app/apps/render-worker/package.json ./apps/render-worker/
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/apps/render-worker
EXPOSE 3002
CMD ["bun", "start"]
```

### Option 3: Traditional VPS/Cloud Deployment

1. Install Bun on your server
2. Clone the repository
3. Run `bun install && bun run build`
4. Use PM2 or systemd to manage processes:

```bash
# Install PM2
bun add -g pm2

# Start apps
pm2 start "cd apps/parent && bun start" --name parent
pm2 start "cd apps/renderer && bun start" --name renderer
pm2 start "cd apps/render-worker && bun start" --name render-worker

# Save PM2 configuration
pm2 save
pm2 startup
```

## Environment Variables Reference

### Parent App

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_RENDERER_URL` | URL of the renderer app embed endpoint | `http://localhost:3001/embed` |

### Renderer App

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ALLOWED_ORIGINS` | Comma-separated list of allowed parent origins | `http://localhost:3000,https://parent.example.com` |

### Render Worker

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3002` |

## Security Considerations

1. **Origin Validation**: Ensure `NEXT_PUBLIC_ALLOWED_ORIGINS` only includes trusted domains
2. **HTTPS**: Always use HTTPS in production for iframe communication
3. **Rate Limiting**: Add rate limiting to the render worker API
4. **Code Execution**: Code mode (`ui-code`, `video-code`) is experimental - consider disabling in production
5. **Content Security Policy**: Configure CSP headers appropriately for your deployment

## Monitoring and Logging

- Monitor iframe communication errors through the renderer's error messages
- Track render job status via the render worker's `/status/:jobId` endpoint
- Set up application logging for all three apps
- Monitor build cache performance with Turbopack

## Troubleshooting

### Build Failures

```bash
# Clear turborepo cache
rm -rf .turbo node_modules/.cache

# Reinstall dependencies
rm -rf node_modules bun.lockb
bun install

# Rebuild
bun run build
```

### Runtime Issues

1. **Iframe not loading**: Check CORS and origin validation settings
2. **Video preview not working**: Ensure Remotion dependencies are installed
3. **Code mode failures**: Check browser console for compilation errors

## Performance Optimization

1. **Enable build caching** for faster rebuilds
2. **Use CDN** for static assets in Next.js apps
3. **Configure Redis** for render job queue (optional enhancement)
4. **Enable compression** on the renderer for large payloads

## Scaling

- **Parent & Renderer**: Scale horizontally using load balancers
- **Render Worker**: Use job queue (Bull/BullMQ) for handling multiple render requests
- **Database**: Add PostgreSQL/MongoDB for payload persistence (optional)

## Support

For issues and questions:
- Check the README.md for architecture details
- Review the PRD.md for design decisions
- File issues in the repository
