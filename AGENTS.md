# Repository Guidelines

## Project Structure & Module Organization

GenieAi is a Flask app that uses a local Ollama (`gemma3:1b`, `nomic-embed-text`). Application code is in `src/` (`app.py` chat and documents, `rag.py` retrieval, `genie.py` course features, `course.json` course details, `templates/` and `static/` the interface), tests in `tests/`, and sample course materials in `docs/sample-materials/`. Keep all Ollama calls on the Python side, bind Flask to 127.0.0.1, and document layout changes in `README.md`.

## Build, Test, and Development Commands

Install and start on macOS with `bash setup_mac.sh`, then `bash start_genieai.command`. Run tests with `python -m unittest discover -s tests -v`. There is no frontend build step. Record any new commands in `README.md`.

## Coding Style & Naming Conventions

Follow the conventions of the language and framework selected for the implementation. Configure an appropriate formatter and linter early, and use their defaults consistently. Keep indentation consistent within each file, use descriptive identifiers, and organize modules around a single responsibility. Avoid adding unrelated formatting changes to functional patches.

## Testing Guidelines

No testing framework or coverage threshold has been established. Add tests alongside new behavior using the selected ecosystem's standard framework. Use descriptive test names that identify the behavior and expected result. Cover normal operation, relevant edge cases, and failure paths. Document how to run the complete test suite before requiring it in review.

## Commit & Pull Request Guidelines

This directory has no Git repository or commit history, so no existing commit convention can be inferred. Once Git is initialized, use concise, imperative commit subjects, such as `Add initial application scaffold`. Keep each commit focused. Pull requests should explain the change, its purpose, and validation performed; link relevant issues and include screenshots for visible interface changes.

## Security & Configuration

Do not commit credentials, tokens, or local environment files. If configuration becomes necessary, provide an example file containing placeholders and document required variables. Add generated outputs and local-only files to `.gitignore` when introducing the corresponding tools.
