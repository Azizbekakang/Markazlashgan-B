# Contributing

## Workflow

1. Create a focused branch from `main`.
2. Keep changes small and describe the reason in the commit.
3. Add or update tests when changing behavior.
4. Open a pull request and wait for CI checks before merging.

## Local verification

Use Node.js 20 or later:

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Code expectations

- Prefer TypeScript types over implicit `any`.
- Keep secrets and personal/student data out of commits and logs.
- Validate and authorize all future server-side mutations.
- Keep UI accessible: semantic controls, visible focus, and meaningful labels.
- Update the README when configuration or deployment behavior changes.
