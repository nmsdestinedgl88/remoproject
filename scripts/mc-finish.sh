#!/usr/bin/env bash
# Finish a rendered episode: loudness to -14 LUFS, WhatsApp 720p copy, checks.  mc-finish.sh <id> <Slug>
set -eu
id=$1; slug=$2; out=deliver; mkdir -p $out
ffmpeg -y -v error -i "out/raw/$id.mp4" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k "$out/${slug}_9x16_1080x1920.mp4"
ffmpeg -y -v error -i "$out/${slug}_9x16_1080x1920.mp4" -vf scale=720:1280 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 128k "$out/${slug}_whatsapp_720x1280.mp4"
for f in "$out/${slug}_9x16_1080x1920.mp4" "$out/${slug}_whatsapp_720x1280.mp4"; do
  printf "%s " "$(basename $f)"; ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate:format=duration,size -of csv=p=0 "$f" | paste -sd' '
done
ffmpeg -hide_banner -nostats -i "$out/${slug}_9x16_1080x1920.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
black=$(ffmpeg -hide_banner -nostats -i "$out/${slug}_9x16_1080x1920.mp4" -vf blackdetect=d=0.3:pic_th=0.98 -an -f null - 2>&1 | grep -c black_start || true)
echo "black segments: $black"
