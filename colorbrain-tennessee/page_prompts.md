# Page prompts - Scout Explores Tennessee (A4, sheets of four)

Render each sheet in Nano Banana (Gemini image) at the highest resolution available, **attach the Scout reference image(s) from the `reference/` folder to EVERY sheet** (`nigeria_p2.png` = the clean Scout line art; `nigeria_p7.png`, `nigeria_p9.png`, `nigeria_p85.png` = more poses/outfit). Save each result as the filename shown.

**Resolution note:** a 4K sheet gives each page about half the pixels per side of a full A4 render, so each cropped page is roughly 150-180 dpi at A4, not 300. I will upscale each page to 2480 x 3508 px and report the real figure. The prompts keep detail at a level that survives this.

## Style bible (repeated word for word in every prompt)

> STYLE (identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients, no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text, letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page.

> SCOUT (match the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip. Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every page.

> STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star badges.

## Sheet map

| Sheet file | Top-left | Top-right | Bottom-left | Bottom-right |
|---|---|---|---|---|
| `sheet_01.png` | Welcome to Tennessee! | The Tennessee Flag | Memphis | Tiptonville |
| `sheet_02.png` | Paris | Jackson | Clarksville | Nashville |
| `sheet_03.png` | Franklin | Columbia | Murfreesboro | Cookeville |
| `sheet_04.png` | Chattanooga | Sweetwater | Oak Ridge | Knoxville |
| `sheet_05.png` | Sevierville | Pigeon Forge | Gatlinburg | Johnson City |
| `sheet_06.png` | Kingsport | Bristol | My Family's Town | Goodbye, Tennessee! |

The 24 art pages = Welcome, Flag, 20 towns, My Family's Town, Goodbye. Front matter (cover aside), titles, fun facts and page numbers are typeset by code afterwards, so the art carries no text.

## Sheet 1 - `sheet_01.png`

- **Top-left:** Welcome to Tennessee! - Scout waves hello beside a big blank road sign at a state welcome area.
- **Top-right:** The Tennessee Flag - Scout stands proudly at lower left pointing up at a large rectangular flag on a tall pole filling the upper two thirds of the page.
- **Bottom-left:** Memphis - Scout waves on a riverbank.
- **Bottom-right:** Tiptonville - Scout waves from a wooden dock on a calm lake dotted with tall bald cypress trees standing in the water with knobby knees.

**Prompt (paste with the Scout reference image attached):**

```
Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait
proportions (1:1.414), at the highest resolution available (4K). Leave a plain white gutter between the four
pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. STYLE
(identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients,
no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and
thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but
readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text,
letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay
blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a
title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page. SCOUT (match
the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox
explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small
backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a
short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip.
Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every
page. STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits
inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be
colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star
badges. Top-left page - Welcome to Tennessee!: Scout waves hello beside a big blank road sign at a state
welcome area; a guitar leans on the sign post; rolling blue-ridge mountains, pine trees and fluffy clouds
behind. Star badges: one on the sign's corner, one in the clouds at upper left, one on a rock at lower right.
Top-right page - The Tennessee Flag: Scout stands proudly at lower left pointing up at a large rectangular
flag on a tall pole filling the upper two thirds of the page. The flag shows a large circle at left-center
with a thin ring around it, containing three five-pointed stars arranged in a triangle, plus a narrow vertical
stripe at the fly end. The three stars inside the circle ARE the three flag stars for this page. Star badges:
the three stars inside the flag's circle (no other stars). Bottom-left page - Memphis: Scout waves on a
riverbank; behind, a huge glass pyramid building and a riverboat on the wide Mississippi River; in the
foreground three ducks march in a line toward a small fountain; a blues guitar rests on a bench. Star badges:
one on the pyramid's peak, one on the riverboat's smokestack, one on the fountain. Bottom-right page -
Tiptonville: Scout waves from a wooden dock on a calm lake dotted with tall bald cypress trees standing in the
water with knobby knees; a bald eagle soars overhead; ducks and lily pads on the water. Star badges: one in
the sky near the eagle, one on a cypress trunk, one floating on a lily pad. Detail level for all four: medium
(ages 6-9). Keep each page's artwork inside its own safe margin. Output only the sheet itself, with no mockup,
table, hands or pencils.
```

## Sheet 2 - `sheet_02.png`

- **Top-left:** Paris - Scout holds a folded map and looks up at a tall lattice tower standing on a small-town green with flower beds, a picket fence and park benches.
- **Top-right:** Jackson - Scout waves beside a big classic steam locomotive puffing steam on a railroad track.
- **Bottom-left:** Clarksville - Scout stands on the top step of a winner's podium wearing a gold medal, arms cheering.
- **Bottom-right:** Nashville - Scout points at a full-size Parthenon-style temple with columns while a guitar rests beside them.

**Prompt (paste with the Scout reference image attached):**

```
Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait
proportions (1:1.414), at the highest resolution available (4K). Leave a plain white gutter between the four
pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. STYLE
(identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients,
no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and
thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but
readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text,
letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay
blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a
title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page. SCOUT (match
the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox
explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small
backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a
short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip.
Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every
page. STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits
inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be
colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star
badges. Top-left page - Paris: Scout holds a folded map and looks up at a tall lattice tower standing on a
small-town green with flower beds, a picket fence and park benches. Star badges: one on the tower's top, one
on a flower bed, one on the fence. Top-right page - Jackson: Scout waves beside a big classic steam locomotive
puffing steam on a railroad track; a water tower and an X-shaped railroad crossing sign (blank) behind; trees
and a signal lamp. Star badges: one on the locomotive's boiler door, one on the water tower, one in the steam
cloud. Bottom-left page - Clarksville: Scout stands on the top step of a winner's podium wearing a gold medal,
arms cheering; a running track with lanes, stadium stands and flags behind; confetti. Star badges: one on the
first-place podium block, one on a stadium flag, one on the track lane lines. Bottom-right page - Nashville:
Scout points at a full-size Parthenon-style temple with columns while a guitar rests beside them; music notes
float in the sky; a hot-air balloon drifts behind. Star badges: one in the temple's triangle pediment, one on
the hot-air balloon, one among the music notes. Detail level for all four: medium (ages 6-9). Keep each page's
artwork inside its own safe margin. Output only the sheet itself, with no mockup, table, hands or pencils.
```

## Sheet 3 - `sheet_03.png`

- **Top-left:** Franklin - Scout waves in the middle of a charming small-town main street with brick shops, awnings, old-fashioned lampposts, bunting flags and a vintage movie theater with a blank marquee.
- **Top-right:** Columbia - Scout holds out a carrot to a friendly mule with long ears beside a red barn and rail fence.
- **Bottom-left:** Murfreesboro - Scout points with a folded map at an old courthouse with columns and a tall clock tower.
- **Bottom-right:** Cookeville - Scout hikes with a walking stick beside a pool below a tall waterfall tumbling over rock ledges.

**Prompt (paste with the Scout reference image attached):**

```
Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait
proportions (1:1.414), at the highest resolution available (4K). Leave a plain white gutter between the four
pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. STYLE
(identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients,
no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and
thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but
readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text,
letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay
blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a
title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page. SCOUT (match
the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox
explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small
backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a
short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip.
Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every
page. STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits
inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be
colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star
badges. Top-left page - Franklin: Scout waves in the middle of a charming small-town main street with brick
shops, awnings, old-fashioned lampposts, bunting flags and a vintage movie theater with a blank marquee. Star
badges: one on the theater marquee, one on a lamppost, one on a shop awning. Top-right page - Columbia: Scout
holds out a carrot to a friendly mule with long ears beside a red barn and rail fence; a parade bunting banner
(blank) is strung overhead; hay bales. Star badges: one on the barn door, one on the mule's saddle blanket,
one on a hay bale. Bottom-left page - Murfreesboro: Scout points with a folded map at an old courthouse with
columns and a tall clock tower; big shade trees, a flag, and a park path. Star badges: one on the clock face
area, one on the courthouse steps, one in a tree. Bottom-right page - Cookeville: Scout hikes with a walking
stick beside a pool below a tall waterfall tumbling over rock ledges; ferns, mossy boulders and tall forest
trees; stepping stones. Star badges: one on a boulder in the pool, one on a cliff ledge beside the falls, one
on a tree trunk. Detail level for all four: medium (ages 6-9). Keep each page's artwork inside its own safe
margin. Output only the sheet itself, with no mockup, table, hands or pencils.
```

## Sheet 4 - `sheet_04.png`

- **Top-left:** Chattanooga - Scout appears once, large, waving from the open window of a little cable-car that climbs a very steep track up a wooded mountain.
- **Top-right:** Sweetwater - Inside a cave: Scout waves from a canopy boat gliding on a still underground lake.
- **Bottom-left:** Oak Ridge - Scout holds a clipboard beside a big atom sculpture with orbiting rings.
- **Bottom-right:** Knoxville - Scout shades their eyes and looks up at a tall slender tower topped with a big glass ball (windowed sphere) in a park with a fountain, benches and tall trees.

**Prompt (paste with the Scout reference image attached):**

```
Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait
proportions (1:1.414), at the highest resolution available (4K). Leave a plain white gutter between the four
pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. STYLE
(identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients,
no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and
thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but
readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text,
letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay
blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a
title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page. SCOUT (match
the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox
explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small
backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a
short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip.
Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every
page. STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits
inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be
colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star
badges. Top-left page - Chattanooga: Scout appears once, large, waving from the open window of a little cable-
car that climbs a very steep track up a wooded mountain; a river bend and small city far below in the valley.
Star badges: one on the incline car's roof, one on a mountain boulder, one in the river valley. Top-right page
- Sweetwater: Inside a cave: Scout waves from a canopy boat gliding on a still underground lake; stalactites
hang from the ceiling, stalagmites rise from the shore; a big friendly trout swims below the glass-bottom
boat. Star badges: one on a stalactite, one on a stalagmite, one on the boat canopy. Bottom-left page - Oak
Ridge: Scout holds a clipboard beside a big atom sculpture with orbiting rings; behind, a science lab building
with a tall chimney and a row of tall computer cabinets seen through windows; hills and trees. Star badges:
one on the lab door, one on the atom sculpture's base, one on a computer cabinet. Bottom-right page -
Knoxville: Scout shades their eyes and looks up at a tall slender tower topped with a big glass ball (windowed
sphere) in a park with a fountain, benches and tall trees. Star badges: one on the sphere, one on the
fountain, one on a park bench. Detail level for all four: medium (ages 6-9). Keep each page's artwork inside
its own safe margin. Output only the sheet itself, with no mockup, table, hands or pencils.
```

## Sheet 5 - `sheet_05.png`

- **Top-left:** Sevierville - Scout waves in front of a county courthouse with clock tower.
- **Top-right:** Pigeon Forge - Scout waves on a park path beside a big ferris wheel, a roller-coaster track and a little toy-style steam train with passenger cars.
- **Bottom-left:** Gatlinburg - Scout waves beside a friendly sitting black bear cub.
- **Bottom-right:** Johnson City - At a fossil dig site Scout brushes dirt off a giant tusk and skull emerging from the ground.

**Prompt (paste with the Scout reference image attached):**

```
Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait
proportions (1:1.414), at the highest resolution available (4K). Leave a plain white gutter between the four
pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. STYLE
(identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients,
no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and
thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but
readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text,
letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay
blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a
title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page. SCOUT (match
the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox
explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small
backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a
short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip.
Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every
page. STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits
inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be
colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star
badges. Top-left page - Sevierville: Scout waves in front of a county courthouse with clock tower; on the lawn
a big guitar sculpture on a stone pedestal with butterflies fluttering around it; wooded mountains behind.
Star badges: one on the stone pedestal, one on a butterfly's wing, one on the courthouse tower. Top-right page
- Pigeon Forge: Scout waves on a park path beside a big ferris wheel, a roller-coaster track and a little toy-
style steam train with passenger cars; bunches of balloons and wooded hills behind. Star badges: one on the
ferris wheel's hub, one on the train's smokestack, one on a balloon. Bottom-left page - Gatlinburg: Scout
waves beside a friendly sitting black bear cub; behind, a tall observation tower with a saucer-shaped deck,
pine forest, log cabin and layers of misty mountains. Star badges: one on the observation deck, one on the
cabin roof, one on a pine tree. Bottom-right page - Johnson City: At a fossil dig site Scout brushes dirt off
a giant tusk and skull emerging from the ground; ribs of an ancient animal, buckets, a shovel, a small tent
and gridded dig squares; mountain ridge behind. Star badges: one on the skull, one on a bucket, one on the
tent. Detail level for all four: medium (ages 6-9). Keep each page's artwork inside its own safe margin.
Output only the sheet itself, with no mockup, table, hands or pencils.
```

## Sheet 6 - `sheet_06.png`

- **Top-left:** Kingsport - Scout looks through a telescope on a hilltop beside a round-domed planetarium building.
- **Top-right:** Bristol - Scout stands with one boot on each side of a painted line down the middle of a main street, under a big blank arch sign.
- **Bottom-left:** My Family's Town - Scout stands at lower left pointing at a very large empty rectangular picture frame on a sturdy easel that fills most of the page (the inside of the frame stays completely blank for the child to draw).
- **Bottom-right:** Goodbye, Tennessee! - Scout waves from the basket of a hot-air balloon floating over rolling hills, a winding river and tiny towns.

**Prompt (paste with the Scout reference image attached):**

```
Create one sheet holding four separate coloring book pages in a 2 x 2 grid. The sheet is A4 portrait
proportions (1:1.414), at the highest resolution available (4K). Leave a plain white gutter between the four
pages and around the outside, with no dividing lines or frames, and let no artwork cross a gutter. STYLE
(identical for every page): pure black line art on a pure white background. No grey, no shading, no gradients,
no color fills. One consistent bold outline weight (about 4 pt at A4), slightly thicker on outer contours and
thinner on interior detail. Friendly, detailed children's-activity-book cartoon style for ages 6-9: rich but
readable backgrounds, no tiny fiddly areas, every shape fully closed so it can be colored in. NO text,
letters, numbers, signatures, watermarks, borders or frames anywhere in the artwork (signs and banners stay
blank). No copyrighted characters, logos or brands. Leave the top 18% of every page completely empty white (a
title and fun fact are added there later). Keep all artwork inside a 6% safe margin of each page. SCOUT (match
the attached reference image exactly - same face, proportions and outfit on every page): a friendly young fox
explorer with big eyes, pointed ears, fluffy cheek fur, a wide-brimmed safari hat with a band, a small
backpack with a round compass on it, a neckerchief tied at the neck, a vest with two chest pockets over a
short-sleeved shirt, shorts with a pocket, lace-up hiking boots, and a big bushy tail with a zigzag white tip.
Scout is about one third of the page height, the clear focal subject, and wears the identical outfit on every
page. STARS: hide exactly three small five-pointed stars in the scene (Tennessee flag stars). Each star sits
inside its own small plain circle like a badge, about 3% of the page width, drawn as outlined shapes to be
colored in, placed where the brief says. Draw no other stars anywhere and no more or fewer than three star
badges. Top-left page - Kingsport: Scout looks through a telescope on a hilltop beside a round-domed
planetarium building; a lake, pines, a crescent moon and ringed planet in the sky (NO stars other than the
three badges). Star badges: one on the planetarium dome, one on the telescope tripod, one on the lakeshore
rocks. Top-right page - Bristol: Scout stands with one boot on each side of a painted line down the middle of
a main street, under a big blank arch sign; a race car, old-time shops and a vintage guitar sign. Star badges:
one on the arch sign, one on the race car door, one on a shop window. Bottom-left page - My Family's Town:
Scout stands at lower left pointing at a very large empty rectangular picture frame on a sturdy easel that
fills most of the page (the inside of the frame stays completely blank for the child to draw); paintbrushes in
a cup and a paint palette at the easel's foot. Star badges: one on the easel's top, one on the paint palette,
one on the cup of brushes. Bottom-right page - Goodbye, Tennessee!: Scout waves from the basket of a hot-air
balloon floating over rolling hills, a winding river and tiny towns; a suitcase and compass in the basket;
clouds. Star badges: one on the balloon's envelope, one on the suitcase, one in a cloud. Detail level for all
four: medium (ages 6-9). Keep each page's artwork inside its own safe margin. Output only the sheet itself,
with no mockup, table, hands or pencils.
```

## Re-render single page template (Stage 5 only)
```
Create one A4 portrait coloring book page (2480 x 3508 px). [STYLE + SCOUT + STARS as above]. Page: [brief]. Fix: [defect]. Output only the page.
```
