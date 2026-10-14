import json, re
A = json.load(open("src/ava/anchors.json")); ws = A["words"]
VO = {"S1":"With diabetes, a wound takes longer to heal.","S2":"That includes the wound from surgery. A long incision means more skin to mend, and more chance of infection while it does.","S3":"Minimal access surgery uses a few small openings instead of one long cut. A camera and fine instruments do the work inside.","S4":"For suitable procedures, it can mean less pain, a smaller wound to heal, lower risk of wound infection and a shorter hospital stay. A smaller wound gives slow healing less to repair.","S5":"Before any procedure, our team reviews your blood sugar, medicines and general health. Your surgeon then tells you whether minimal access surgery suits your case.","S6":"Ava Consultants and Urology Centre, off the Four-Lane, Uyo. Call the number on screen to book."}
limit = 96; pages = []; cur = []
for sc, txt in VO.items():
    sw = [w for w in ws if w["scene"] == sc]
    for i, t in enumerate(txt.split(" ")):
        w = sw[min(i, len(sw) - 1)]
        if cur and len(" ".join(c[0] for c in cur)) + len(t) + 1 > limit: pages.append(cur); cur = []
        cur.append((t, w["s"], w["e"]))
        if t.endswith(".") or (t.endswith(",") and len(" ".join(c[0] for c in cur)) > limit * 0.6): pages.append(cur); cur = []
    if cur: pages.append(cur); cur = []
def ts(f):
    ms = round(f / 30 * 1000); return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
out = []
for i, p in enumerate(pages):
    end = p[-1][2] + 20 if i == len(pages) - 1 else min(pages[i + 1][0][1], p[-1][2] + 24)
    out.append("%d\n%s --> %s\n%s\n" % (i + 1, ts(p[0][1]), ts(end), " ".join(c[0] for c in p)))
open("captions.srt", "w").write("\n".join(out)); print(len(pages), "cues")
