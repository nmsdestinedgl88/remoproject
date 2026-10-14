import json
FPS = 30
d = json.load(open("audio/words_raw.json")); sc = d["scenes"]; words = d["words"]
# §8.3: scene boundary = first word of next scene minus 0.2 s, snapped to frame
b = [0] + [round(s["first"] * FPS - 6) for s in sc[1:]] + [1800]
scenes = [{"id": s["id"], "from": b[i], "to": b[i + 1]} for i, s in enumerate(sc)]
ws = [{"w": w["word"], "s": round(w["start_s"] * FPS), "e": round(w["end_s"] * FPS), "scene": w["scene"]} for w in words]
def S(scene, word, n=0): return [w for w in ws if w["scene"] == scene and w["w"].lower() == word.lower()][n]["s"]
def E(scene, word, n=0): return [w for w in ws if w["scene"] == scene and w["w"].lower() == word.lower()][n]["e"]
a = {"scenes": scenes}
a["s1"] = {"incEnd": S("S1", "wound"), "incStart": S("S1", "wound") - 42, "head": S("S1", "diabetes"), "underline": S("S1", "heal") - 3}
a["s2"] = {"pushStart": scenes[1]["from"], "pushEnd": scenes[2]["from"] - 31, "ticksStart": S("S2", "skin"), "callout": S("S2", "infection")}
a["s3"] = {"chip": S("S3", "minimal"), "aka": S("S3", "surgery"), "split": S("S3", "few"), "ghost": S("S3", "instead"),
           "pullStart": E("S3", "cut") + 2, "camera": S("S3", "camera"), "instruments": S("S3", "instruments")}
a["s4"] = {"rows": [S("S4", "pain"), S("S4", "smaller"), S("S4", "lower"), S("S4", "shorter")], "panel": S("S4", "A", 2)}
a["s5"] = {"cards": [S("S5", "blood"), S("S5", "medicines"), S("S5", "general")], "fork": S("S5", "whether"), "final": S("S5", "suits") - 4}
a["s6"] = {"dot": S("S6", "Ava"), "address": S("S6", "Four"), "phone": S("S6", "Call")}
sfx = []  # (frame, kind)
sfx += [(a["s1"]["incStart"], "tick"), (a["s1"]["underline"], "pencil"), (a["s2"]["ticksStart"], "pencil"), (a["s2"]["callout"], "pencil"),
        (a["s3"]["split"], "tick"), (a["s3"]["ghost"], "pencil"), (a["s3"]["camera"], "pencil"), (a["s3"]["instruments"], "pencil")]
sfx += [(f, "pencil") for f in a["s4"]["rows"]] + [(f + 14, "pencil") for f in a["s5"]["cards"]] + [(a["s5"]["fork"], "pencil")]
sfx += [(a["s6"]["dot"], "tick"), (a["s6"]["address"], "pencil")]
a["sfx"] = sfx
a["words"] = ws
json.dump(a, open("src/ava/anchors.json", "w"), indent=1)
json.dump([{"word": w["word"], "start_s": w["start_s"], "end_s": w["end_s"]} for w in words], open("words.json", "w"), indent=1)
for s in scenes: print(s, round((s["to"] - s["from"]) / 30, 2))
print({k: v for k, v in a.items() if k not in ("words", "scenes", "sfx")})
