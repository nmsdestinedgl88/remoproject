#!/usr/bin/env bash
# Render every Manetrust episode to out/raw/<id>.mp4
set -u
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for id in "$@"; do
  start=$(date +%s)
  npx remotion render src/index.ts "$id" "out/raw/$id.mp4" --codec h264 --crf 17 --concurrency 4 --browser-executable "$B" --log error > "out/render_$id.log" 2>&1
  echo "$id exit=$? secs=$(( $(date +%s) - start ))"
done
