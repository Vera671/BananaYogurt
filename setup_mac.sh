#!/bin/bash
# GenieAi one-step setup for macOS (Apple Silicon or Intel).
#   bash setup_mac.sh            install everything, add sample course materials, start GenieAi
#   bash setup_mac.sh --no-demo  same, without the sample materials
# Safe to run again: steps that are already done are skipped.
set -euo pipefail
cd "$(dirname "$0")"
step() { printf '\n\033[1;35m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31m%s\033[0m\n\n' "$1"; exit 1; }
DEMO=1; [ "${1:-}" = "--no-demo" ] && DEMO=0

step "1/6 Checking macOS"
major=$(sw_vers -productVersion | cut -d. -f1)
if [ "$major" -lt 14 ]; then
  echo "Warning: current Ollama needs macOS 14 Sonoma or newer. You have $(sw_vers -productVersion)."
fi
echo "macOS $(sw_vers -productVersion) on $(uname -m)"

step "2/6 Checking Python"
if [ "$(command -v python3 || true)" = "/usr/bin/python3" ] && ! xcode-select -p >/dev/null 2>&1; then
  xcode-select --install >/dev/null 2>&1 || true
  fail "macOS needs Apple's Command Line Tools to run Python.
A window should have opened: click Install and wait for it to finish (about 5-10 minutes).
Then run this again:  bash setup_mac.sh"
fi
PY=$(command -v python3 || true)
[ -n "$PY" ] || fail "Python 3 was not found. Install it from https://www.python.org/downloads/ and run this again."
"$PY" -c 'import sys; sys.exit(sys.version_info < (3, 9))' || fail "GenieAi needs Python 3.9 or newer. Install it from https://www.python.org/downloads/"
echo "Using $("$PY" --version) at $PY"

step "3/6 Checking Ollama"
OLLAMA=""
for candidate in "$(command -v ollama || true)" /Applications/Ollama.app/Contents/Resources/ollama "$HOME/Applications/Ollama.app/Contents/Resources/ollama"; do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then OLLAMA="$candidate"; break; fi
done
if [ -z "$OLLAMA" ]; then
  echo "Ollama is not installed. Downloading it from ollama.com (a few hundred MB)..."
  curl -fL --progress-bar -o /tmp/Ollama.dmg https://ollama.com/download/Ollama.dmg || fail "Could not download Ollama. Check your internet connection and run this again."
  volume=$(hdiutil attach -nobrowse -noautoopen /tmp/Ollama.dmg | grep -o '/Volumes/.*' | tail -1)
  [ -d "$volume/Ollama.app" ] || fail "The Ollama download looks damaged. Delete /tmp/Ollama.dmg and run this again."
  if ditto "$volume/Ollama.app" /Applications/Ollama.app 2>/dev/null; then APP=/Applications/Ollama.app
  else mkdir -p "$HOME/Applications"; ditto "$volume/Ollama.app" "$HOME/Applications/Ollama.app"; APP="$HOME/Applications/Ollama.app"; fi
  hdiutil detach "$volume" -quiet || true
  rm -f /tmp/Ollama.dmg
  OLLAMA="$APP/Contents/Resources/ollama"
  echo "Installed Ollama in $APP"
fi
if ! curl -s -o /dev/null http://localhost:11434/api/version; then
  echo "Starting Ollama..."
  open -a Ollama >/dev/null 2>&1 || (nohup "$OLLAMA" serve >/tmp/ollama.log 2>&1 &)
  for _ in $(seq 1 60); do curl -s -o /dev/null http://localhost:11434/api/version && break; sleep 1; done
  curl -s -o /dev/null http://localhost:11434/api/version || { nohup "$OLLAMA" serve >/tmp/ollama.log 2>&1 & sleep 5; }
  curl -s -o /dev/null http://localhost:11434/api/version || fail "Ollama did not start. Open the Ollama app from Applications, then run this again."
fi
echo "Ollama is running."

step "4/6 Downloading the AI models (gemma3:1b ~800 MB, nomic-embed-text ~270 MB)"
"$OLLAMA" pull gemma3:1b
"$OLLAMA" pull nomic-embed-text

step "5/6 Installing GenieAi's Python packages"
[ -x .venv/bin/python ] || "$PY" -m venv .venv
.venv/bin/python -m pip install --quiet --upgrade pip
.venv/bin/python -m pip install --quiet -r requirements.txt
echo "Packages installed."

step "6/6 Preparing course materials"
if [ "$DEMO" = 1 ]; then .venv/bin/python -m flask --app src.app seed-demo; fi
echo "Indexing documents with nomic-embed-text (the first time takes a minute)..."
.venv/bin/python -m flask --app src.app index-documents || echo "Some documents could not be indexed. Open GenieAi and check the Library."
chmod +x start_genieai.command 2>/dev/null || true

printf '\n\033[1;32mGenieAi is installed.\033[0m Starting it now...\n'
exec bash start_genieai.command
