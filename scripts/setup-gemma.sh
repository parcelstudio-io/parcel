#!/usr/bin/env bash
# Download the default Gemma reasoning model for Parcel's agent (via Ollama).
set -euo pipefail

MODEL="${OLLAMA_MODEL:-for/gemma3-thinking}"
FALLBACK="${OLLAMA_FALLBACK_MODEL:-gemma3:4b}"

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama is not installed."
  echo "Install from https://ollama.com/download then re-run: pnpm setup:gemma"
  exit 1
fi

if ! curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Starting Ollama..."
  ollama serve >/tmp/ollama-serve.log 2>&1 &
  sleep 2
fi

echo "Pulling Gemma reasoning model: ${MODEL}"
if ! ollama pull "${MODEL}"; then
  echo "Could not pull ${MODEL}, trying fallback ${FALLBACK}..."
  ollama pull "${FALLBACK}"
  MODEL="${FALLBACK}"
fi

echo ""
echo "Done. Default model: ${MODEL}"
echo "Add to webapp/.env.local:"
echo "  OLLAMA_MODEL=${MODEL}"
echo ""
echo "For iOS on a physical device, point at your machine:"
echo "  EXPO_PUBLIC_AGENT_API_URL=http://YOUR_LAN_IP:3000/api/agent/chat"
