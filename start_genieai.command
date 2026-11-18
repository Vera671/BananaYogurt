#!/bin/bash
# Start GenieAi. Double-click this file in Finder, or run: bash start_genieai.command
# Keep this window open while you use GenieAi. Press Ctrl+C to stop it.
cd "$(dirname "$0")"
[ -x .venv/bin/python ] || { echo "GenieAi isn't installed yet. Run: bash setup_mac.sh"; exit 1; }
if ! curl -s -o /dev/null http://localhost:11434/api/version; then
  echo "Starting Ollama..."
  open -a Ollama >/dev/null 2>&1 || { O=$(command -v ollama || echo /Applications/Ollama.app/Contents/Resources/ollama); nohup "$O" serve >/tmp/ollama.log 2>&1 & }
  for _ in $(seq 1 30); do curl -s -o /dev/null http://localhost:11434/api/version && break; sleep 1; done
fi
PORT=5000
# macOS AirPlay Receiver often holds port 5000, so fall back to 5001.
if lsof -nP -iTCP:5000 -sTCP:LISTEN >/dev/null 2>&1; then PORT=5001; fi
echo ""
echo "GenieAi is running at http://127.0.0.1:$PORT  (keep this window open; Ctrl+C to stop)"
(sleep 2; open "http://127.0.0.1:$PORT") &
PORT=$PORT exec .venv/bin/python src/app.py
