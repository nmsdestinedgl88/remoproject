import sys, os, glob
sys.path.insert(0, ".")
import process_base as pb
K = 1.024                                    # grid-tile units -> 1x crop pixels
def s(t): return [(round(x * K), round(y * K)) for x, y in t]
def e(t, r): return [(round(x * K), round(y * K), r) for x, y in t]
pb.EDITS = {
 "01_welcome":         dict(add=s([(420, 130)])),
 "03_yuma":            dict(add=s([(500, 200), (520, 515)])),
 "04_lake_havasu_city":dict(add=s([(255, 470)])),
 "05_kingman":         dict(erase=e([(355, 655)], 32)),
 "13_payson":          dict(add=s([(270, 150)])),
 "20_sierra_vista":    dict(add=s([(330, 150)])),
 "21_tombstone":       dict(add=s([(493, 293)])),
 "22_bisbee":          dict(add=s([(360, 230)])),
}
_orig = pb.apply_edits
def apply_edits(big, name):
    if name == "22_bisbee": big = pb.hollow_solid(big)     # tunnel mouth: big solid black -> outline only
    return _orig(big, name)
pb.apply_edits = apply_edits
pb.OUT = "pages_final"; os.makedirs(pb.OUT, exist_ok=True)
if __name__ == "__main__":
    from multiprocessing import Pool
    fs = sorted(glob.glob("pages_raw/*.png"))
    with Pool(4) as p:
        for r in p.imap_unordered(pb.process, fs): print("done", r, flush=True)
