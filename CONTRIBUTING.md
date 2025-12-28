# Contributing to Bangladesh Election Map

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Architecture](#project-architecture)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Keep political discussions neutral and factual
- Report any inappropriate behavior to maintainers

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bangladesh-election.git
   cd bangladesh-election/app
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
pnpm dev
```

### Running Tests

```bash
pnpm test
pnpm test:watch  # Watch mode
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
```

### Formatting

```bash
pnpm format      # Format all files
pnpm format:check # Check formatting
```

## Code Style

### TypeScript

- Use TypeScript for all new files
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` if type is truly unknown

```typescript
// Good
interface UserProps {
  name: string;
  age: number;
}

function getUser(id: string): User | null {
  // ...
}

// Avoid
type UserProps = {
  name: string;
  age: any;
}
```

### React Components

- Use functional components with hooks
- Use named exports for components
- Place component-specific hooks in the same directory
- Keep components focused and single-purpose

```typescript
// components/example/Example.tsx
'use client';

import { useState } from 'react';

interface ExampleProps {
  title: string;
  onAction?: () => void;
}

export function Example({ title, onAction }: ExampleProps) {
  const [state, setState] = useState(false);

  return (
    <div className="...">
      {title}
    </div>
  );
}
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CandidatePanel.tsx` |
| Hooks | camelCase with `use` prefix | `useMapData.ts` |
| Utilities | camelCase | `url-utils.ts` |
| Types | camelCase | `candidate.ts` |
| Constants | camelCase | `colors.ts` |

### Directory Structure

```
components/
├── feature-name/
│   ├── FeatureName.tsx      # Main component
│   ├── useFeatureName.ts    # Feature-specific hook
│   ├── index.ts             # Barrel export (optional)
│   └── SubComponent.tsx     # Sub-components
```

### Imports

Imports are automatically sorted by ESLint. The order is:
1. External packages
2. Internal aliases (`@/`)
3. Relative imports

```typescript
import { useState } from 'react';
import { z } from 'zod';

import { PARTY_COLORS } from '@/constants/colors';
import type { Candidate } from '@/types/candidate';

import { SubComponent } from './SubComponent';
```

### CSS/Styling

- Use Tailwind CSS classes
- Follow the Golden Delta color palette (teal, gold, emerald, coral)
- Use responsive prefixes (`sm:`, `md:`, `lg:`)
- Keep dark mode in mind (dark backgrounds)

```tsx
// Good
<div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 md:p-6">

// Avoid inline styles unless necessary
<div style={{ backgroundColor: '#1a1a1a' }}>
```

### Bengali Text

- Use the `text-bangla` class for Bengali text sizing
- Always provide English fallbacks where appropriate
- Use proper Bengali numerals when displaying numbers in Bengali context

## Commit Guidelines

### Commit Message Format

```
type(scope): short description

Longer description if needed.
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```
feat(map): add party color mode toggle
fix(voting): handle rate limit edge case
docs(readme): update installation instructions
refactor(hooks): extract viewport filtering logic
```

## Pull Request Process

### Before Submitting

- [ ] Run `pnpm lint` and fix any issues
- [ ] Run `pnpm typecheck` with no errors
- [ ] Run `pnpm build` successfully
- [ ] Test your changes locally
- [ ] Update documentation if needed

### PR Title Format

Use the same format as commit messages:
```
feat(map): add constituency search feature
```

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Changes
- Change 1
- Change 2

## Testing
How to test these changes.

## Screenshots (if applicable)
Add screenshots for UI changes.
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Code follows style guidelines

## Project Architecture

### Key Concepts

**App Router**: We use Next.js 15 App Router with the following conventions:
- `page.tsx` - Route pages
- `layout.tsx` - Shared layouts
- `route.ts` - API endpoints
- `error.tsx` - Error boundaries

**State Management**: We use React's built-in state management:
- `useState` for component state
- Props for parent-child communication
- No global state library (intentionally simple)

**Data Fetching**:
- Server Components for static data
- Client Components with `fetch` for dynamic data
- Redis for persistent storage (voting data)

### Important Files

| File | Purpose |
|------|---------|
| `app/src/middleware.ts` | Rate limiting, security headers |
| `app/src/constants/site.ts` | Site configuration |
| `app/src/constants/colors.ts` | Color palette |
| `app/src/types/*.ts` | TypeScript interfaces |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/janatar-dabi` | GET | Get votes for constituency |
| `/api/janatar-dabi` | POST | Submit vote |
| `/api/meme-pulse` | GET | Get videos for district |

## Questions?

Open an issue with the `question` label or reach out to maintainers.

---

Thank you for contributing!
