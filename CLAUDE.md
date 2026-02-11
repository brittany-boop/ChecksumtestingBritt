# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build
- `npm test` — Run all tests once (`vitest run`)
- `npm run test:watch` — Run tests in watch mode (`vitest`)
- Run a single test file: `npx vitest run src/App.test.jsx`

## Architecture

React + Vite todo app. State lives in `App` and flows down via props.

- `src/App.jsx` — Root component. Owns all todo state (`useState`) and handlers (add, toggle, delete). No external state library.
- `src/components/` — Presentational components (`TodoForm`, `TodoList`, `TodoItem`). Each component has a co-located `.css` file.
- `src/main.jsx` — Entry point, renders `App` into `#root`.

## Testing

Uses Vitest with jsdom environment and `@testing-library/react`. Test setup is in `src/test/setup.js` (includes manual `cleanup` in `afterEach`). Tests go alongside source files as `*.test.jsx`.
