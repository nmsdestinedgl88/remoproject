"""Scratch voiceover: espeak-ng via ctypes, word timings from synth events.
Replace audio/vo.wav + words.json with Gemini TTS + forced alignment for the final."""
import ctypes, json, sys, wave, struct, os
import espeakng_loader as e
lib = ctypes.CDLL(e.get_library_path())
SR = 22050
class Ev(ctypes.Structure):
    _fields_ = [("type", ctypes.c_int), ("uid", ctypes.c_uint), ("text_position", ctypes.c_int),
                ("length", ctypes.c_int), ("audio_position", ctypes.c_int), ("sample", ctypes.c_int),
                ("user_data", ctypes.c_void_p), ("id", ctypes.c_void_p)]
CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.POINTER(Ev))
lib.espeak_Initialize.restype = ctypes.c_int
sr = lib.espeak_Initialize(2, 0, e.get_data_path().encode(), 0)
sr_ = sr
for v in (b"en-029", b"en-gb-x-rp", b"en"):  # en-029 = Caribbean/West-ish English; fall back
    if lib.espeak_SetVoiceByName(v) == 0: print("voice", v, file=sys.stderr); break
lib.espeak_SetParameter(1, 146, 0)   # rate wpm
lib.espeak_SetParameter(3, 38, 0)    # pitch (lower = calmer)
SCENES = json.load(open(sys.argv[1]))
def synth(text):
    pcm, words = [], []
    def cb(wav, n, ev):
        if wav and n > 0: pcm.extend(wav[i] for i in range(n))
        i = 0
        while True:
            t = ev[i]
            if t.type == 0: break
            if t.type == 1: words.append((t.text_position, t.length, t.audio_position))
            i += 1
        return 0
    c = CB(cb)
    lib.espeak_SetSynthCallback(c)
    b = text.encode()
    lib.espeak_Synth(b, len(b) + 1, 0, 1, 0, 1 | 0x1000, None, None)  # chars, AUDIO
    lib.espeak_Synchronize()
    return pcm, words
LEAD = 0.3
out, allw, t = [0] * int(LEAD * SR), [], LEAD
GAP_SCENE, GAP_SENT = 0.9, 0.25
scenes = []
for s in SCENES:
    start = t
    for si, sent in enumerate(s["sentences"]):
        pcm, ws = synth(sent)
        # event audio_position is ms; text_position is 1-based char index
        for k, (tp, ln, ap) in enumerate(ws):
            w = sent[tp - 1: tp - 1 + ln] if ln else sent[tp - 1:].split(" ")[0]
            w = w.strip(" ,.")
            end = (ws[k + 1][2] / 1000.0) if k + 1 < len(ws) else len(pcm) / SR
            allw.append({"word": w, "start_s": round(t + ap / 1000.0, 3), "end_s": round(t + end, 3), "scene": s["id"], "sent": si})
        out.extend(pcm); t += len(pcm) / SR
        if si + 1 < len(s["sentences"]): out.extend([0] * int(GAP_SENT * SR)); t += GAP_SENT
    scenes.append({"id": s["id"], "first": allw[[w["scene"] for w in allw].index(s["id"])]["start_s"], "last": allw[-1]["end_s"]})
    out.extend([0] * int(GAP_SCENE * SR)); t += GAP_SCENE
os.makedirs("audio", exist_ok=True)
with wave.open("audio/vo_raw.wav", "wb") as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes(struct.pack("<%dh" % len(out), *out))
json.dump({"words": allw, "scenes": scenes, "duration_s": round(t, 3)}, open("audio/words_raw.json", "w"), indent=1)
print(json.dumps(scenes), round(t, 2), len(allw), "words")
