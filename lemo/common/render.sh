#!/bin/sh
# usage: render.sh <film dir> <output name>   builds index.html, events, picture, mix, and the finished mp4 in the film dir
set -e
P=$(cd "$1" && pwd); NAME=$2
cd /root/lemo-opuscar; export PLAYWRIGHT_CHROME=/opt/pw-browsers/chromium
python3 /home/user/remoproject/lemo/common/build_index.py "$P"
node core/render/events.mjs "$P" --size 1080x1920 | tail -1
node core/render/video.mjs "$P" --fps 24 --workers 3 --size 1080x1920 --out "$P/out/video.mp4" > "$P/out/render.log" 2>&1
.venv/bin/python /home/user/remoproject/lemo/common/mix.py "$P"
D=$(python3 -c "import json;print(json.load(open('$P/events.json'))['dur'])")
M=$(ffmpeg -hide_banner -i "$P/out/mix.wav" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1 | python3 -c "
import sys,json
t=sys.stdin.read(); j=json.loads(t[t.rindex('{'):t.rindex('}')+1]); print(f\"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}\")")
ffmpeg -v error -y -i "$P/out/video.mp4" -i "$P/out/mix.wav" -filter_complex "[1:a]loudnorm=I=-14.5:TP=-1.5:LRA=11:$M:linear=true,alimiter=limit=0.84,volume=-3dB[a]" -map 0:v -map "[a]" -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p -c:a aac -b:a 192k -t "$D" -movflags +faststart "$P/$NAME.mp4"
ffmpeg -nostats -i "$P/$NAME.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
ffmpeg -v error -y -ss 20 -i "$P/$NAME.mp4" -frames:v 1 "$P/poster.jpg"
echo "done $P/$NAME.mp4"
