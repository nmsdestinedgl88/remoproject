#!/bin/sh
# usage: review.sh <film dir> t1 t2 ...   -> stills + contact sheets (6 per row) in the film dir
P=$(cd "$1" && pwd); shift
cd /root/lemo-opuscar; export PLAYWRIGHT_CHROME=/opt/pw-browsers/chromium
python3 /home/user/remoproject/lemo/common/build_index.py "$P" >/dev/null
rm -rf "$P/stills"; node core/render/still.mjs "$P" "$@" --size 1080x1920 --out "$P/stills" 2>&1 | grep -iE "pageerror|error" | head -3
n=0; set1=""; set2=""
for t in "$@"; do n=$((n+1)); f="$P/stills/t_$t.jpg"; if [ $n -le 6 ]; then set1="$set1 $f"; else set2="$set2 $f"; fi; done
.venv/bin/python core/render/sheet.py "$P/sheetA.jpg" $set1 --cols 6 --w 330 >/dev/null
[ -n "$set2" ] && .venv/bin/python core/render/sheet.py "$P/sheetB.jpg" $set2 --cols 6 --w 330 >/dev/null
echo reviewed
