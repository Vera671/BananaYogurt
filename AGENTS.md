# Repository Guidelines

## Project Structure & Module Organization

This directory is currently an empty project scaffold. No source code, tests, assets, or build configuration exist yet. When introducing the initial implementation, keep application code in `src/`, automated tests in `tests/`, and supporting documentation in `docs/`, unless the chosen framework requires another layout. Create asset directories only when needed. Document the actual layout in `README.md` as the project develops.

## Build, Test, and Development Commands

No build, test, or local development commands are currently configured. When adding tooling, provide reproducible commands for installing dependencies, running locally, building, and testing. Record those commands in `README.md` and commit the relevant manifests and lockfiles. Do not assume commands such as `npm test` or `make build` are available before their configuration exists.

## Coding Style & Naming Conventions

Follow the conventions of the language and framework selected for the implementation. Configure an appropriate formatter and linter early, and use their defaults consistently. Keep indentation consistent within each file, use descriptive identifiers, and organize modules around a single responsibility. Avoid adding unrelated formatting changes to functional patches.

## Testing Guidelines

No testing framework or coverage threshold has been established. Add tests alongside new behavior using the selected ecosystem's standard framework. Use descriptive test names that identify the behavior and expected result. Cover normal operation, relevant edge cases, and failure paths. Document how to run the complete test suite before requiring it in review.

## Commit & Pull Request Guidelines

This directory has no Git repository or commit history, so no existing commit convention can be inferred. Once Git is initialized, use concise, imperative commit subjects, such as `Add initial application scaffold`. Keep each commit focused. Pull requests should explain the change, its purpose, and validation performed; link relevant issues and include screenshots for visible interface changes.

## Security & Configuration

Do not commit credentials, tokens, or local environment files. If configuration becomes necessary, provide an example file containing placeholders and document required variables. Add generated outputs and local-only files to `.gitignore` when introducing the corresponding tools.
