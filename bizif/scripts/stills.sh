#!/bin/bash
# usage: stills.sh frame...   renders half-scale stills into out/
cd "$(dirname "$0")/.."
for fr in "$@"; do
  npx remotion still src/index.ts Bizif out/s_$fr.png --frame=$fr --scale=0.4 >/dev/null 2>&1 &
  while [ $(jobs -r | wc -l) -ge 4 ]; do sleep 1; done
done
wait
