#!/bin/bash
# Double-click to install GenieAi (Ollama, models, Python packages) and start it.
cd "$(dirname "$0")"
bash setup_mac.sh
echo ""
read -n 1 -s -r -p "Press any key to close this window."
