# Contributing Guide

## Development Setup

### Prerequisites

- Bun 1.3.10+
- Node.js 18+
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-content
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Parent app
   cp apps/parent/.env.local.example apps/parent/.env.local

   # Renderer app
   cp apps/renderer/.env.local.example apps/renderer/.env.local
   ```

4. **Start development servers**
   ```bash
   bun dev
   ```

## Project Structure

```
.
├── apps/
│   ├── parent/              # Next.js chat/orchestration app
│   ├── renderer/            # Next.js iframe renderer
│   └── render-worker/       # Express video export service
├── packages/
│   ├── runtime-protocol/    # Shared message types
│   ├── ui-runtime/          # UI spec/code runtime
│   ├── video-runtime/       # Remotion runtime
│   └── design-system/       # Shared UI components
├── package.json             # Root workspace config
├── turbo.json              # Turborepo pipeline
└── bun.lockb               # Bun lockfile
```

## Development Workflow

### Adding New Features

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes in the appropriate package/app**

3. **Test locally**
   ```bash
   bun dev
   ```

4. **Build to ensure no errors**
   ```bash
   bun run build
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of your feature"
   git push origin feature/your-feature-name
   ```

### Working with Packages

#### Adding a new package

```bash
mkdir -p packages/my-package/src
cd packages/my-package

# Create package.json
cat > package.json << EOF
{
  "name": "@user-content/my-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts"
}
EOF

# Create tsconfig.json
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

#### Using workspace packages

In your app's package.json:
```json
{
  "dependencies": {
    "@user-content/my-package": "workspace:*"
  }
}
```

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in each package
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
feat: add new chart primitive to design-system
fix: resolve iframe handshake timeout issue
docs: update README with deployment instructions
```

## Testing Changes

### Manual Testing

1. **UI Spec Mode**
   - Start dev servers
   - Open http://localhost:3000
   - Click "UI Spec (Dashboard)"
   - Verify the dashboard renders correctly

2. **Video Spec Mode**
   - Click "Video Spec (Animation)"
   - Verify the video preview plays correctly
   - Check that the player controls work

3. **Error Handling**
   - Test with malformed payloads
   - Verify error messages display properly

### Building

Always test that your changes build successfully:

```bash
# Build all packages and apps
bun run build

# Build specific package
bun run build --filter=@user-content/ui-runtime

# Build specific app
bun run build --filter=@user-content/parent
```

## Common Tasks

### Adding a New UI Primitive

1. **Add component to design-system**
   ```typescript
   // packages/design-system/src/components.tsx
   export const MyComponent: React.FC<MyProps> = ({ ...props }) => {
     return <div>...</div>;
   };
   ```

2. **Export from index**
   ```typescript
   // packages/design-system/src/index.tsx
   export * from "./components";
   ```

3. **Add to UI registry**
   ```typescript
   // packages/ui-runtime/src/registry.tsx
   import { MyComponent } from "@user-content/design-system";

   export const uiRegistry = {
     // ... existing
     MyComponent,
   };
   ```

4. **Test in parent app**
   - Add example payload using the new component
   - Verify it renders correctly

### Adding a New Remotion Primitive

1. **Add to video-runtime registry**
   ```typescript
   // packages/video-runtime/src/remotion-spec/registry.tsx
   export const MyScene: React.FC<Props> = ({ ...props }) => {
     return <AbsoluteFill>...</AbsoluteFill>;
   };

   export const remotionRegistry = {
     // ... existing
     MyScene,
   };
   ```

2. **Test with example payload**

### Updating Message Protocol

If you change the message types in runtime-protocol:

1. Update `packages/runtime-protocol/src/messages.ts`
2. Rebuild all packages: `bun run build`
3. Update parent and renderer to use new types
4. Test handshake still works correctly

## Troubleshooting

### Dependency Issues

```bash
# Clear everything and reinstall
rm -rf node_modules bun.lockb
bun install
```

### Build Cache Issues

```bash
# Clear turborepo cache
rm -rf .turbo

# Clear Next.js cache
rm -rf apps/parent/.next
rm -rf apps/renderer/.next
```

### TypeScript Errors

```bash
# Check types without building
bun run lint

# Check specific package
cd packages/ui-runtime && bun run lint
```

## Architecture Decisions

### Why Bun?

- Fast package installation and task running
- Native TypeScript support
- Better monorepo performance than npm/yarn
- Compatible with Node.js ecosystem

### Why Turborepo?

- Efficient task orchestration
- Intelligent caching
- Parallel execution
- Easy to scale

### Why Next.js for Parent and Renderer?

- Server and client rendering
- Fast development with Hot Module Replacement
- Built-in optimization
- Easy deployment

### Why Separate Render Worker?

- Isolates CPU-intensive video rendering
- Can be scaled independently
- Prevents blocking the web apps
- Better resource management

## Getting Help

- Check existing documentation in README.md and PRD.md
- Review related code in the codebase
- Ask questions in team discussions
- File an issue for bugs or unclear behavior

## Code Review Guidelines

When reviewing PRs:

- ✅ Check that builds pass
- ✅ Verify changes match the description
- ✅ Test locally if possible
- ✅ Check for potential security issues
- ✅ Ensure code follows existing patterns
- ✅ Look for performance implications
