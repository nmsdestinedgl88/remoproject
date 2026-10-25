import textwrap, json
import importlib.util, sys
spec = importlib.util.spec_from_file_location("bd", "build_docs.py"); bd = importlib.util.module_from_spec(spec); spec.loader.exec_module(bd)
P = {p[0]: list(p) for p in bd.PAGES}
STYLE = bd.STYLE.replace("NO text, letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay blank).",
  "NO text, letters, numbers, signatures, watermarks anywhere in the artwork (signs and banners stay blank and unmarked). NO borders, frames or boxes around any page or around the empty top zone, and no ruled lines across the page. NO large solid-black filled areas: shadows, water and cave voids are drawn with outlines and thin ripple lines only, so everything can be colored.")
SCOUT = bd.SCOUT + " Scout appears EXACTLY ONCE on each page - never two foxes, never a twin or reflection."
STARS = ("STARS: hide exactly THREE small five-pointed stars (Tennessee flag stars) on each page, no more and no fewer. Each star sits inside its own small plain circle, like a round badge "
 "about 3% of the page width, outlined and empty inside so it can be colored. Place them exactly where the page brief says and number them 1, 2, 3. "
 "Do NOT draw any other star anywhere: no star patterns, star decorations, star medals or star-shaped sparkles on guitars, saddles, costumes, signs or the sky. "
 "Before finishing each page, count the star badges: there must be exactly three.")

# fixes per page: (scene override or None, star spots)
FIX = {
 "welcome": (None, "1: on the blank sign's corner; 2: in the clouds at upper left; 3: on a rock at lower right"),
 "flag": (None, "1, 2, 3: the three stars inside the flag's circle (each star in the flag is a plain outlined star; the circle is the flag's own circle) - draw no other stars on the page"),
 "memphis": (None, "1: on the pyramid's peak; 2: on the riverboat's smokestack; 3: on the fountain"),
 "tiptonville": (None, "1: in the sky near the eagle; 2: on a cypress trunk; 3: on a lily pad"),
 "paris": (None, "1: at the very top of the tower; 2: on the flower bed; 3: on a park bench"),
 "nashville": (None, "1: in the temple's triangular pediment; 2: on the hot-air balloon; 3: on a cloud behind the temple"),
 "franklin": (None, "1: on the theater marquee; 2: on a lamppost; 3: on a shop awning"),
 "cookeville": (None, "1: on the large boulder in the pool; 2: on a ledge of the cliff beside the falls; 3: on the tree trunk at the right"),
 "chattanooga": ("Scout appears once, large, waving from the open window of a small FUNICULAR (incline railway) car that runs on two parallel steel rails with cross ties up a very steep wooded mountain slope; the car's floor is stepped to sit level on the steep slope. This is NOT a hanging cable car or gondola: no overhead cable, no pylon. A river bend and a small city are far below in the valley.",
                 "1: on the roof of the incline car; 2: on a boulder beside the track; 3: on the river in the valley below"),
 "sweetwater": ("Inside a cave: Scout waves from a small boat with a canopy gliding on a still underground lake; stalactites hang from the ceiling and stalagmites rise from the shore; a big friendly trout swims beneath the boat. Water and cave openings are drawn with outlines and ripple lines, with NO solid black fill.",
                "1: on a stalactite at upper left; 2: on a stalagmite at the right; 3: on the boat's canopy"),
 "oak_ridge": ("Scout (just one fox, holding a clipboard) stands beside a big atom sculpture with orbiting rings; behind, a science lab building with a domed roof and tall computer cabinets seen through its windows; hills and trees. There is exactly ONE fox in the picture.",
               "1: on the lab building's door; 2: on the atom sculpture's base; 3: on a computer cabinet seen through a window"),
 "sevierville": (None, "1: on the clock tower; 2: on the stone pedestal; 3: on a butterfly's wing. The guitar sculpture is plain: no stars on it"),
 "johnson_city": (None, "1: on the giant skull; 2: on a bucket; 3: on the tent"),
 "bristol": ("Scout stands with one boot on each side of a painted line running down the middle of a main street, under a big blank arch sign (no writing at all); a race car and old-time shops line the street; all shop signs and the arch are completely blank.",
             "1: on top of the arch sign; 2: on the race car's door; 3: on one shop window"),
 "family": (None, "1: on the top of the easel; 2: on the paint palette; 3: on the cup of brushes"),
}
RE = ["welcome", "flag", "memphis", "tiptonville", "paris", "nashville", "franklin", "cookeville", "chattanooga", "sweetwater", "oak_ridge", "sevierville", "johnson_city", "bristol", "family"]
sheets = [RE[i:i+4] for i in range(0, len(RE), 4)]
POS = ["Top-left", "Top-right", "Bottom-left", "Bottom-right"]
md = ["# Re-render prompts - Scout Explores Tennessee (round 2)\n",
"Round 1 gave 20 of 24 pages (sheets 2-6; sheet 1 was never uploaded). Ten of those failed the star count or had a wrong landmark, so these four sheets re-render **15 pages**: the 4 missing from sheet 1 plus the 11 that failed (`page_review.md`). Attach the Scout reference images from `reference/` to every sheet. Save as the filenames shown.\n",
"**What changed in the prompts:** no frames or ruled lines around pages or the header zone; no solid black fills; Scout exactly once; a hard three-star rule with numbered positions and a ban on decorative stars; Chattanooga is now a funicular on rails (not a gondola).\n",
"## Sheet map\n", "| File | Top-left | Top-right | Bottom-left | Bottom-right |", "|---|---|---|---|---|"]
for i, sh in enumerate(sheets, 1):
    md.append(f"| `sheet_r{i:02d}.png` | " + " | ".join(P[k][1] for k in sh) + (" | *(blank white)*" if len(sh) < 4 else "") + " |")
for i, sh in enumerate(sheets, 1):
    md.append(f"\n## Sheet r{i:02d} - `sheet_r{i:02d}.png`\n")
    body = ("Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait proportions (1:1.414), at the highest resolution available (4K). "
            "Leave a plain white gutter between the four pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. "
            + STYLE + " " + SCOUT + " " + STARS + " ")
    for pos, k in zip(POS, sh):
        scene = FIX[k][0] or P[k][5]
        body += f"{pos} page - {P[k][1]}: {scene} Star badges: {FIX[k][1]}. "
        md.append(f"- **{pos}:** {P[k][1]}")
    if len(sh) < 4:
        body += "Bottom-right page: leave this panel completely blank white. "
    body += "Detail level for all pages: medium (ages 6-9). Keep each page's artwork inside its own safe margin and leave the top 18% of every page empty. Output only the sheet itself, with no mockup, table, hands or pencils."
    md.append("\n```\n" + textwrap.fill(body, 110) + "\n```")
open("page_prompts_rerender.md", "w").write("\n".join(md) + "\n")
print("ok")
