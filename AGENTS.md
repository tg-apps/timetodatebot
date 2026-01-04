# AGENTS.md

This file contains guidelines and commands for agentic coding assistants working in the timetodatebot repository.

## Project Overview

This is a TypeScript Telegram bot built with Bun that calculates time remaining to specific dates. The bot uses Grammy.js for Telegram API integration, Drizzle ORM with SQLite for data persistence, and Zod for type validation.

## Technology Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Framework**: Grammy.js for Telegram Bot API
- **Database**: SQLite with Drizzle ORM
- **Language**: TypeScript (strict mode)
- **Package Manager**: Bun
- **Formatter**: Oxfmt (oxlint's formatter)
- **Type Validation**: Zod

## Development Commands

### Build Commands

```bash
# Development mode
bun run dev

# Production build
bun run build

# Cross-platform builds
bun run build:linux
bun run build:windows

# Run production binary
bun run start
```

### Code Quality

```bash
# Format code
bun run format
```

### Testing

```bash
# Run all tests
bun run test

# Run specific test file
bun test tests/pluralization.test.ts
```

**Test Framework**: Bun's builtin test runner is configured for this project. Test files are located in the `/tests/` directory and use `.test.ts` extension.

## Code Style Guidelines

### File Structure & Naming

- **Files**: kebab-case for files (e.g., `birthday-handler.ts`)
- **Directories**: kebab-case for directories
- **Functions**: camelCase with descriptive names, use `handle_` prefix for command handlers
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Database tables**: snake_case

### Import Style

- Use ES6 imports with `import type` for type-only imports
- Path alias: `~/*` maps to `./src/*` (configured in tsconfig.json)
- Experimental import sorting is enabled via Oxfmt

### TypeScript Configuration

- Strict mode enabled with maximum strictness settings
- ESNext target with bundler module resolution
- No implicit any, strict null checks, and comprehensive type safety
- Unused locals/parameters are flagged

### Code Patterns

#### Handler Pattern

```typescript
// Command handlers follow this pattern
async function handle_commandName(context: CommandContext<Context>) {
  // Handler logic
  await context.reply(response, { parse_mode: "MarkdownV2" });
}
```

#### Database Pattern

- Use Drizzle ORM with typed schemas
- Database instance is imported and used directly
- Tables use snake_case naming convention

#### Error Handling

- Use Zod's `safeParse` for input validation
- Throw errors for missing critical environment variables
- Handle bot command errors gracefully with fallback responses

#### Response Format

- All bot responses use `MarkdownV2` parse mode
- Russian language throughout the interface
- Consistent error messages and help text

### Project Structure

```
src/
├── db/           # Database connection and schema
├── handlers/     # Command handlers (one per feature)
├── lib/          # Utility functions and helpers
├── schemas/      # Zod validation schemas
└── constants.ts  # Static strings and constants
```

### Bot Command Structure

- Register commands in main `src/index.ts` file
- Each command has dedicated handler in `handlers/` directory
- Support for command aliases (e.g., ["newyear", "ny", "ng"])
- Private chat only enforcement for unknown commands

### Environment Variables

- `TOKEN`: Required Telegram bot token
- `NODE_ENV`: Set to "production" for production builds

## Development Workflow

1. **Code Changes**: Make changes following the style guidelines above
2. **Formatting**: Run `bun run format` before committing
3. **Testing**: Run `bun run test` to ensure all tests pass
4. **Building**: Use `bun run build` for production builds
5. **Deployment**: Deploy the `dist/bot` binary

## Key Dependencies

### Core Dependencies

- `grammy`: Telegram Bot API framework
- `@grammyjs/runner`: Bot runner for production deployment
- `drizzle-orm`: Type-safe database ORM
- `zod`: Schema validation and type safety

### Development Dependencies

- `@types/bun`: Bun TypeScript definitions
- `oxfmt`: Code formatter with import sorting
- `typescript`: TypeScript compiler

## Notes for Agents

- This is a Russian-language bot - maintain language consistency
- Test coverage is available for core functionality - add tests for new features
- Database migrations should be handled carefully (SQLite)
- The bot uses Telegram's MarkdownV2 format which requires escaping special characters
- All user data is stored locally in SQLite database file `database.db`
- The codebase follows strict TypeScript patterns - maintain type safety

## Configuration Files

- `tsconfig.json`: Strict TypeScript configuration with path aliases
- `.oxfmtrc.json`: Formatter configuration (80-character width, import sorting)
- `package.json`: Bun-based scripts and ESM module type
- `.env`: Environment variables (gitignored)
