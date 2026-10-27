import json, textwrap
src = open("../colorbrain-tennessee/build_docs.py").read()
head = src.split("PAGES = [")[0]
exec(head)        # STYLE, SCOUT, STARS (Tennessee wording; STARS overridden below)

STARS = ("STARS: hide exactly three small five-pointed stars (Arizona copper stars) in the scene. Each star sits inside its own small plain circle like a badge, "
 "about 3% of the page width, drawn as outlined shapes to be colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star badges.")

# key, title, zone, nickname, fact, scene brief, star spots
PAGES = [
("welcome","Welcome to Arizona!","Central","","Arizona became the 48th state in 1912. Its flag has a copper star in the middle!",
 "Scout waves hello beside a big blank road sign at a desert welcome area; tall saguaro cacti with arms, red-rock buttes and layered desert mountains behind; a roadrunner on a rock and fluffy clouds.",
 "one on the sign's corner, one in a cloud at upper left, one on a rock at lower right"),
("flag","The Arizona Flag","Central","","Color the flag: red and gold rays, a copper star and a blue field. The 13 rays shine like a desert sunset!",
 "Scout stands proudly at lower left pointing up at a large rectangular flag on a tall pole filling the upper two thirds of the page. The flag shows a big five-pointed star in the center with thirteen straight rays spreading out above it like a sunburst over the top half, and a plain lower half; no text.",
 "one on the flag's center star (a plain outlined star), one in a badge on top of the flagpole, one on a rock beside Scout"),
("yuma","Yuma","Western","Sunniest City","Yuma is called the sunniest city on Earth by Guinness World Records!",
 "Scout wearing the usual hat waves on the bank of a wide river lined with palm trees and date palms; a big smiling sun with rays high in the sky, a small riverboat, farm fields and a distant bridge.",
 "one in the middle of the sun, one on a palm trunk, one on the riverboat"),
("lake_havasu_city","Lake Havasu City","Western","","London Bridge was brought here from England and rebuilt in 1971!",
 "Scout waves on a lakeside walkway in front of a stone arched bridge with old-fashioned lamp posts crossing a canal; a small boat passes underneath, desert mountains across the lake and palm trees.",
 "one on the bridge's center arch, one on a lamp post base, one on the boat"),
("kingman","Kingman","Western","Heart of Route 66","Kingman sits on one of the longest stretches of old Route 66 left in America!",
 "Scout waves beside a classic vintage car at an old-fashioned roadside gas station on a long straight highway with a blank round highway sign; desert mountains and a train in the distance.",
 "one on the gas pump, one on the car's door, one on the blank round sign"),
("williams","Williams","Northern","Gateway to the Grand Canyon","Williams has a train that rides 65 miles to the Grand Canyon!",
 "Scout waves beside a vintage steam train at a small-town depot among tall pine trees; a few old-fashioned shops on a main street and the train's passenger cars behind.",
 "one on the locomotive's front, one on the depot sign board (blank), one on a pine tree"),
("grand_canyon_village","Grand Canyon Village","Northern","","The Grand Canyon is more than a mile deep!",
 "Scout stands safely behind a stone wall at a canyon overlook, pointing out across a huge layered canyon with winding river far below; a large bird soars, pine trees and a rustic stone lodge nearby.",
 "one on the stone wall, one on a canyon layer far away, one in the sky near the bird"),
("page","Page","Northern","","Near Page, the Colorado River curves into a giant horseshoe at Horseshoe Bend!",
 "Scout waves from a safe rocky overlook above a huge horseshoe-shaped river bend; layered sandstone cliffs, a small desert shrub and a few tiny boats far below.",
 "one on the cliff rim, one on a boulder, one on the river bend below"),
("flagstaff","Flagstaff","Northern","","Pluto was discovered at Flagstaff's Lowell Observatory in 1930!",
 "Scout looks up through a big telescope next to a white dome observatory among tall ponderosa pines; a snow-capped mountain behind, a crescent moon and a small round planet in the sky (NO stars other than the three badges).",
 "one on the observatory dome, one on the telescope tripod, one on the mountain"),
("sedona","Sedona","Northern","","Sedona is famous for its glowing red rock towers!",
 "Scout hikes with a walking stick on a trail among tall rock towers, buttes and spires with juniper trees and cactus; a hot-air balloon floats in the sky.",
 "one on a tall rock spire, one on the hot-air balloon, one on a trail boulder"),
("prescott","Prescott","Northern","","Prescott was Arizona's first territorial capital, starting in 1864!",
 "Scout waves in a town square beside an old courthouse with columns and a small cupola, big shade trees, benches and a flag; old brick shops with awnings on a street behind.",
 "one on the courthouse pediment, one on a bench, one on a shop awning"),
("holbrook","Holbrook","Northern","","Near Holbrook, the Petrified Forest has wood that turned into colorful stone!",
 "Scout stands beside giant fallen petrified logs with rainbow-ringed cut ends in a badlands of striped hills (Painted Desert); a small lizard on a log.",
 "one on a log end, one on a striped hill, one on a rock beside the lizard"),
("payson","Payson","Central","","Payson holds a big rodeo every August with cowboys and cowgirls!",
 "Scout waves at a small-town rodeo arena fence among tall pines with a friendly horse and hay bales, bunting flags, and a cowboy hat on a post.",
 "one on the arena gate, one on a hay bale, one on the horse's saddle blanket"),
("phoenix","Phoenix","Central","Valley of the Sun","Phoenix is named for a bird that rises from its ashes, and old Hohokam canals once watered the valley!",
 "Scout waves in front of a giant friendly phoenix bird sculpture rising with spread wings; behind, a skyline of city towers with a tall mountain, palm trees and a long canal with a footbridge.",
 "one on the phoenix's wing, one on a tower, one on the footbridge"),
("scottsdale","Scottsdale","Central","","Scottsdale has Taliesin West, a desert home and school designed by Frank Lloyd Wright!",
 "Scout points at a low modern desert building with slanted stone walls and big triangular roof beams in a garden of cacti; mountains behind and a boardwalk.",
 "one on the building's wall, one on a cactus pad, one on a roof beam"),
("tempe","Tempe","Central","","Tempe Town Lake was made by building dams on the Salt River!",
 "Scout waves from a lakeside path beside a long calm lake with a kayak and a rowing boat; a small rocky butte, bridges across the lake and palm trees.",
 "one on the kayak, one on the bridge, one on the butte"),
("mesa","Mesa","Central","","Mesa is one of Arizona's biggest cities, and \"mesa\" means \"table\" in Spanish!",
 "Scout waves in front of a flat-topped table-shaped rock mesa; a splash pad fountain, palm trees, a tumbleweed rolling and a desert park path.",
 "one on the top of the mesa, one on a palm trunk, one on the fountain"),
("casa_grande","Casa Grande","Southern","","Near Casa Grande, a huge building built by ancient desert people still stands!",
 "Scout waves in front of a big ancient square multi-story adobe-style tower with a protective roof canopy over it, cactus and desert shrubs and a dusty path.",
 "one on the tower wall, one on a cactus, one on the protective roof"),
("tucson","Tucson","Southern","","Saguaro National Park near Tucson protects giant saguaro cacti that can live 150 to 200 years!",
 "Scout waves among tall saguaro cacti with arms and desert flowers; mountains behind, a jackrabbit and a roadrunner on the ground.",
 "one on a saguaro's trunk, one on a flowering cactus, one on a boulder"),
("sierra_vista","Sierra Vista","Southern","Hummingbird Capital","Sierra Vista is called the Hummingbird Capital of the United States!",
 "Scout waves beside a hummingbird feeder on a post, with several hummingbirds hovering around flowers; mountains and trees behind.",
 "one on the feeder, one on a flower cluster, one on a boulder"),
("tombstone","Tombstone","Southern","Town Too Tough to Die","Tombstone is called \"The Town Too Tough to Die\" and still looks like the Old West!",
 "Scout waves on a dusty Old West main street with a wooden boardwalk, saloon-style storefronts with blank signs, a horse-drawn stagecoach and a water trough; no weapons anywhere.",
 "one on the stagecoach door, one on a storefront sign (blank), one on the water trough"),
("bisbee","Bisbee","Southern","","In Bisbee, visitors can ride into the old Queen Mine wearing a hard hat and headlamp!",
 "Scout waves at the arched entrance of an old mine tunnel with small rail tracks, an ore cart and a hanging lantern, in a colorful hillside town with stairways and tiny houses behind.",
 "one on the ore cart, one on the lantern, one on a house in the hillside town"),
("family","My Family's Town","Central","","My family is from ________. Draw your family inside the frame!",
 "Scout stands at lower left pointing at a very large empty rectangular picture frame on a sturdy easel that fills most of the page (the inside of the frame stays completely blank for the child to draw); paintbrushes in a cup and a paint palette at the easel's foot.",
 "one on the easel's top, one on the paint palette, one on the cup of brushes"),
("goodbye","Goodbye, Arizona!","Central","","Scout visited 20 towns across Arizona. Which was your favorite?",
 "Scout waves from the basket of a hot-air balloon floating over rolling desert hills with saguaro cacti, a winding river and tiny towns; a suitcase and compass in the basket; clouds.",
 "one on the balloon's envelope, one on the suitcase, one in a cloud"),
]
assert len(PAGES) == 24
SHEETS = [PAGES[i:i+4] for i in range(0, 24, 4)]
POS = ["Top-left", "Top-right", "Bottom-left", "Bottom-right"]
json.dump([dict(key=p[0], title=p[1], zone=p[2], nickname=p[3], fact=p[4]) for p in PAGES], open("pages_data.json", "w"), indent=1)

md = ["# Page prompts - Scout Explores Arizona (A4, sheets of four)\n",
"Same procedure as the Tennessee book. Render each sheet in Nano Banana at the highest resolution available and **attach the Scout reference images in `reference/` to every sheet** (`nigeria_p2.png` is the clean Scout line art; `nigeria_p7.png`, `nigeria_p9.png` and `nigeria_p85.png` show more poses). Save each result as the filename shown.\n",
"**Lessons from Tennessee built into these prompts:** no real-person statues or lookalikes, no brand names, no weapons, no text on signs, and the three-star rule. Star counts still drift on the generator, so I fix them in code afterwards. **Resolution note:** sheets came back at about 1493 x 2000 px last time, so each page is roughly 80 dpi; I trace the art to vector before print.\n",
"## Style bible (repeated word for word in every prompt)\n", "> " + STYLE + "\n", "> " + SCOUT + "\n", "> " + STARS + "\n",
"## Sheet map\n", "| Sheet file | Top-left | Top-right | Bottom-left | Bottom-right |", "|---|---|---|---|---|"]
for i, sh in enumerate(SHEETS, 1):
    md.append(f"| `sheet_{i:02d}.png` | " + " | ".join(p[1] for p in sh) + " |")
for i, sh in enumerate(SHEETS, 1):
    md.append(f"\n## Sheet {i} - `sheet_{i:02d}.png`\n")
    for pos, p in zip(POS, sh):
        md.append(f"- **{pos}:** {p[1]}")
    body = ("Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait proportions (1:1.414), at the highest resolution available (4K). "
            "Leave a plain white gutter between the four pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. "
            + STYLE + " " + SCOUT + " " + STARS + " ")
    for pos, p in zip(POS, sh):
        body += f"{pos} page - {p[1]}: {p[5]} Star badges: {p[6]}. "
    body += "Detail level for all four: medium (ages 6-9). Keep each page's artwork inside its own safe margin. Output only the sheet itself, with no mockup, table, hands or pencils."
    md.append("\n```\n" + textwrap.fill(body, 110) + "\n```\n")
open("page_prompts.md", "w").write("\n".join(md))
print("ok", len("\n".join(md)))
