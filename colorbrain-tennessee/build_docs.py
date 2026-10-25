import json, textwrap

STYLE = ("STYLE (identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients, no color fills. "
 "One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and thinner on interior detail. "
 "Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. "
 "NO text, letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay blank). "
 "No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a title and fun fact are added there later). "
 "Keep all artwork inside a 6% safe margin of each page.")

SCOUT = ("SCOUT (match the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox explorer with big eyes, "
 "pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small backpack with a round compass on it, a neckerchief tied at the neck, "
 "a vest with two chest pockets over a short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip. "
 "Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every page.")

STARS = ("STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits inside its own small plain circle like a badge, "
 "about 3% of the page width, drawn as outlined shapes to be colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star badges.")

# (key, title, division, nickname, fact, scene brief, star spots)
PAGES = [
("welcome","Welcome to Tennessee!","Middle","","Tennessee is the Volunteer State. Its flag has 3 stars for East, Middle and West!",
 "Scout waves hello beside a big blank road sign at a state welcome area; a guitar leans on the sign post; rolling blue-ridge mountains, pine trees and fluffy clouds behind.",
 "one on the sign's corner, one in the clouds at upper left, one on a rock at lower right"),
("flag","The Tennessee Flag","Middle","","Color the flag: red, white and blue. The 3 stars stand for East, Middle and West Tennessee!",
 "Scout stands proudly at lower left pointing up at a large rectangular flag on a tall pole filling the upper two thirds of the page. The flag shows a large circle at left-center with a thin ring around it, containing three five-pointed stars arranged in a triangle, plus a narrow vertical stripe at the fly end. The three stars inside the circle ARE the three flag stars for this page.",
 "the three stars inside the flag's circle (no other stars)"),
("memphis","Memphis","West","Home of the Blues","Ducks march to a fountain at Memphis's Peabody Hotel every day!",
 "Scout waves on a riverbank; behind, a huge glass pyramid building and a riverboat on the wide Mississippi River; in the foreground three ducks march in a line toward a small fountain; a blues guitar rests on a bench.",
 "one on the pyramid's peak, one on the riverboat's smokestack, one on the fountain"),
("tiptonville","Tiptonville","West","","Earthquakes in 1811 and 1812 made Reelfoot Lake. Cypress trees grow in the water!",
 "Scout waves from a wooden dock on a calm lake dotted with tall bald cypress trees standing in the water with knobby knees; a bald eagle soars overhead; ducks and lily pads on the water.",
 "one in the sky near the eagle, one on a cypress trunk, one floating on a lily pad"),
("paris","Paris","West","","Paris, Tennessee has its own 70-foot Eiffel Tower!",
 "Scout holds a folded map and looks up at a tall lattice tower standing on a small-town green with flower beds, a picket fence and park benches.",
 "one on the tower's top, one on a flower bed, one on the fence"),
("jackson","Jackson","West","Hub City","Famous train engineer Casey Jones lived in Jackson!",
 "Scout waves beside a big classic steam locomotive puffing steam on a railroad track; a water tower and an X-shaped railroad crossing sign (blank) behind; trees and a signal lamp.",
 "one on the locomotive's boiler door, one on the water tower, one in the steam cloud"),
("clarksville","Clarksville","Middle","Queen City","Olympic star Wilma Rudolph grew up here and won 3 gold medals in 1960!",
 "Scout stands on the top step of a winner's podium wearing a gold medal, arms cheering; a running track with lanes, stadium stands and flags behind; confetti.",
 "one on the first-place podium block, one on a stadium flag, one on the track lane lines"),
("nashville","Nashville","Middle","Music City","Nashville has a full-size copy of the Parthenon from Greece!",
 "Scout points at a full-size Parthenon-style temple with columns while a guitar rests beside them; music notes float in the sky; a hot-air balloon drifts behind.",
 "one in the temple's triangle pediment, one on the hot-air balloon, one among the music notes"),
("franklin","Franklin","Middle","","Franklin's historic downtown has a movie theater that opened in 1937!",
 "Scout waves in the middle of a charming small-town main street with brick shops, awnings, old-fashioned lampposts, bunting flags and a vintage movie theater with a blank marquee.",
 "one on the theater marquee, one on a lamppost, one on a shop awning"),
("columbia","Columbia","Middle","Mule Capital","Columbia hosts Mule Day every spring with a big parade!",
 "Scout holds out a carrot to a friendly mule with long ears beside a red barn and rail fence; a parade bunting banner (blank) is strung overhead; hay bales.",
 "one on the barn door, one on the mule's saddle blanket, one on a hay bale"),
("murfreesboro","Murfreesboro","Middle","","Murfreesboro was the capital of Tennessee from 1818 to 1826!",
 "Scout points with a folded map at an old courthouse with columns and a tall clock tower; big shade trees, a flag, and a park path.",
 "one on the clock face area, one on the courthouse steps, one in a tree"),
("cookeville","Cookeville","Middle","","Cummins Falls near Cookeville tumbles 75 feet. You can see lots of waterfalls here!",
 "Scout hikes with a walking stick beside a pool below a tall waterfall tumbling over rock ledges; ferns, mossy boulders and tall forest trees; stepping stones.",
 "one on a boulder in the pool, one on a cliff ledge beside the falls, one on a tree trunk"),
("chattanooga","Chattanooga","East","Scenic City","The Incline Railway up Lookout Mountain is one of the steepest in the world!",
 "Scout appears once, large, waving from the open window of a little cable-car that climbs a very steep track up a wooded mountain; a river bend and small city far below in the valley.",
 "one on the incline car's roof, one on a mountain boulder, one in the river valley"),
("sweetwater","Sweetwater","East","","The Lost Sea in Sweetwater is America's largest underground lake!",
 "Inside a cave: Scout waves from a canopy boat gliding on a still underground lake; stalactites hang from the ceiling, stalagmites rise from the shore; a big friendly trout swims below the glass-bottom boat.",
 "one on a stalactite, one on a stalagmite, one on the boat canopy"),
("oak_ridge","Oak Ridge","East","Secret City","In the 1940s Oak Ridge was a secret city. Today scientists there use super computers!",
 "Scout holds a clipboard beside a big atom sculpture with orbiting rings; behind, a science lab building with a tall chimney and a row of tall computer cabinets seen through windows; hills and trees.",
 "one on the lab door, one on the atom sculpture's base, one on a computer cabinet"),
("knoxville","Knoxville","East","Scruffy City","The Sunsphere is a gold glass ball 266 feet tall, built for the 1982 World's Fair!",
 "Scout shades their eyes and looks up at a tall slender tower topped with a big glass ball (windowed sphere) in a park with a fountain, benches and tall trees.",
 "one on the sphere, one on the fountain, one on a park bench"),
("sevierville","Sevierville","East","","A statue of singer Dolly Parton sits at the courthouse. She grew up nearby!",
 "Scout waves in front of a county courthouse with clock tower; on the lawn a big guitar sculpture on a stone pedestal with butterflies fluttering around it; wooded mountains behind.",
 "one on the stone pedestal, one on a butterfly's wing, one on the courthouse tower"),
("pigeon_forge","Pigeon Forge","East","","Dollywood in Pigeon Forge has roller coasters and a real steam train!",
 "Scout waves on a park path beside a big ferris wheel, a roller-coaster track and a little toy-style steam train with passenger cars; bunches of balloons and wooded hills behind.",
 "one on the ferris wheel's hub, one on the train's smokestack, one on a balloon"),
("gatlinburg","Gatlinburg","East","","Gatlinburg is the door to the Great Smoky Mountains, America's most-visited national park!",
 "Scout waves beside a friendly sitting black bear cub; behind, a tall observation tower with a saucer-shaped deck, pine forest, log cabin and layers of misty mountains.",
 "one on the observation deck, one on the cabin roof, one on a pine tree"),
("johnson_city","Johnson City","East","","Scientists dug up animal fossils about 5 million years old at the Gray Fossil Site!",
 "At a fossil dig site Scout brushes dirt off a giant tusk and skull emerging from the ground; ribs of an ancient animal, buckets, a shovel, a small tent and gridded dig squares; mountain ridge behind.",
 "one on the skull, one on a bucket, one on the tent"),
("kingsport","Kingsport","East","Model City","Bays Mountain Park in Kingsport has a planetarium for looking at the stars!",
 "Scout looks through a telescope on a hilltop beside a round-domed planetarium building; a lake, pines, a crescent moon and ringed planet in the sky (NO stars other than the three badges).",
 "one on the planetarium dome, one on the telescope tripod, one on the lakeshore rocks"),
("bristol","Bristol","East","","Bristol sits in two states! Its main street is part Tennessee, part Virginia.",
 "Scout stands with one boot on each side of a painted line down the middle of a main street, under a big blank arch sign; a race car, old-time shops and a vintage guitar sign.",
 "one on the arch sign, one on the race car door, one on a shop window"),
("family","My Family's Town","Middle","","My family is from ________. Draw your family inside the frame!",
 "Scout stands at lower left pointing at a very large empty rectangular picture frame on a sturdy easel that fills most of the page (the inside of the frame stays completely blank for the child to draw); paintbrushes in a cup and a paint palette at the easel's foot.",
 "one on the easel's top, one on the paint palette, one on the cup of brushes"),
("goodbye","Goodbye, Tennessee!","Middle","","Scout visited 20 towns in East, Middle and West Tennessee. Which was your favorite?",
 "Scout waves from the basket of a hot-air balloon floating over rolling hills, a winding river and tiny towns; a suitcase and compass in the basket; clouds.",
 "one on the balloon's envelope, one on the suitcase, one in a cloud"),
]
assert len(PAGES) == 24
SHEETS = [PAGES[i:i+4] for i in range(0, 24, 4)]
POS = ["Top-left", "Top-right", "Bottom-left", "Bottom-right"]

json.dump([dict(key=p[0], title=p[1], division=p[2], nickname=p[3], fact=p[4]) for p in PAGES], open("pages_data.json", "w"), indent=1)

md = ["# Page prompts - Scout Explores Tennessee (A4, sheets of four)\n",
"Render each sheet in Nano Banana (Gemini image) at the highest resolution available, **attach the Scout reference image(s) from the `reference/` folder to EVERY sheet** (`nigeria_p2.png` = the clean Scout line art; `nigeria_p7.png`, `nigeria_p9.png`, `nigeria_p85.png` = more poses/outfit). Save each result as the filename shown.\n",
"**Resolution note:** a 4K sheet gives each page about half the pixels per side of a full A4 render, so each cropped page is roughly 150-180 dpi at A4, not 300. I will upscale each page to 2480 x 3508 px and report the real figure. The prompts keep detail at a level that survives this.\n",
"## Style bible (repeated word for word in every prompt)\n", "> " + STYLE + "\n", "> " + SCOUT + "\n", "> " + STARS + "\n",
"## Sheet map\n", "| Sheet file | Top-left | Top-right | Bottom-left | Bottom-right |", "|---|---|---|---|---|"]
for i, sh in enumerate(SHEETS, 1):
    md.append(f"| `sheet_{i:02d}.png` | " + " | ".join(f"{p[1]}" for p in sh) + " |")
md.append("\nThe 24 art pages = Welcome, Flag, 20 towns, My Family's Town, Goodbye. Front matter (cover aside), titles, fun facts and page numbers are typeset by code afterwards, so the art carries no text.\n")
for i, sh in enumerate(SHEETS, 1):
    md.append(f"## Sheet {i} - `sheet_{i:02d}.png`\n")
    for pos, p in zip(POS, sh):
        md.append(f"- **{pos}:** {p[1]} - {p[5].split(';')[0].split('.')[0]}.")
    body = ("Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait proportions (1:1.414), at the highest resolution available (4K). "
            "Leave a plain white gutter between the four pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. "
            + STYLE + " " + SCOUT + " " + STARS + " ")
    for pos, p in zip(POS, sh):
        body += f"{pos} page - {p[1]}: {p[5]} Star badges: {p[6]}. "
    body += "Detail level for all four: medium (ages 6-9). Keep each page's artwork inside its own safe margin. Output only the sheet itself, with no mockup, table, hands or pencils."
    md.append("\n**Prompt (paste with the Scout reference image attached):**\n")
    md.append("```\n" + textwrap.fill(body, 110) + "\n```\n")
md.append("## Re-render single page template (Stage 5 only)\n```\nCreate one A4 portrait coloring book page (2480 x 3508 px). [STYLE + SCOUT + STARS as above]. Page: [brief]. Fix: [defect]. Output only the page.\n```\n")
open("page_prompts.md", "w").write("\n".join(md))
print(len("\n".join(md)))
