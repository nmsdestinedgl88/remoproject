from kit import *
GY = GROUND

def S(pose="wave", x=170, s=1.35, y=GY, **kw):
    x = max(x, 52 + 106 * s)            # keep the tail clear of the page edge
    return sc(scout(pose, **kw), x, y, s)

def stars3(*pts, r=(30, 28, 28)):
    return "".join(flag_star(x, y, rr) for (x, y), rr in zip(pts, r))

# ------------------------------------------------------------- WEST
def memphis():
    b = [sky_deco(1)]
    b.append(treeline(700, 40, 810, 110, 1))
    b.append(pyramid(560, 800, w=480, h=420))
    b.append(river(800, 900, 40, 810, 4))
    b.append("".join(duck(x, y, 120) for x, y in ((430, 905), (560, 925), (690, 905))))
    b.append(S("wave", 170))
    b.append(ground(GY + 10, 40, 810))
    b.append(fg_details(GY + 8, 1, [90, 250, 380, 520, 650, 770]))
    b.append(stars3((300, 330), (745, 440), (430, 640)))
    return city_page(11, "Memphis", "W", "Home of the Blues", "Ducks march to a fountain at Memphis's Peabody Hotel every day!", "".join(b))

def tiptonville():
    b = [sky_deco(0, (520, 260))]
    b.append(river(700, 940, 40, 810, 6))
    b.append(cypress(560, 905, 480, 190) + cypress_knee(470, 920) + cypress_knee(650, 915, 40))
    b.append(cypress(740, 880, 330, 150) + cypress_knee(690, 905, 30))
    b.append(sky(eagle(430, 360, 1.0)))
    b.append(dock(40, 320, GY - 40))
    b.append(S("wave", 170, 1.3, GY - 40))
    b.append(stars3((650, 330), (330, 600), (480, 800)))
    return city_page(13, "Tiptonville", "W", "", "Earthquakes in 1811 and 1812 made Reelfoot Lake. Cypress trees grow in the water!", "".join(b), 44)

def paris():
    b = [sky_deco(1)]
    b.append(treeline(GY - 30, 40, 810, 110, 2))
    b.append(eiffel(560, GY - 6, h=640, w=330))
    b.append(fence_picket(300, 810, GY - 6, h=60))
    b.append(S("hold", 170))
    b.append(garden_strip(300, 800, GY + 6))
    b.append(ground(GY, 40, 810))
    b.append(stars3((330, 330), (760, 560), (400, 640)))
    return city_page(15, "Paris", "W", "", "Paris, Tennessee has its own 70-foot Eiffel Tower!", "".join(b))

def jackson():
    b = [sky_deco(0, (500, 330))]
    b.append(treeline(GY - 60, 40, 810, 100, 3))
    b.append(hills_back(GY - 24, 0))
    b.append(water_tower(150, GY - 30, 470))
    b.append(locomotive(560, GY - 28, w=470))
    b.append(steam_puffs(690, 440, 3))
    b.append(rail_track(40, 810, GY - 20, 4))
    b.append(S("wave", 110, 1.3))
    b.append(fg_details(GY + 8, 2, [90, 250, 400, 530, 660, 770]))
    b.append(ground(GY + 8, 40, 810))
    b.append(stars3((430, 290), (760, 470), (300, 560)))
    return city_page(17, "Jackson", "W", "Hub City", "Famous train engineer Casey Jones lived in Jackson!", "".join(b))

# ------------------------------------------------------------- MIDDLE
def clarksville():
    b = [sky_deco(2)]
    b.append(treeline(700, 40, 810, 100, 4))
    b.append(bleachers(80, 770, 780, rows=5, rh=30))
    b.append(flag_pole(120, 780, 300, 100) + flag_pole(690, 780, 300, 100))
    b.append(podium(500, GY - 6, w=360, h=190))
    b.append(S("cheer", 500, 1.3, GY - 6 - 190))
    b.append(medal(500, GY - 6 - 190 - 96, 20))
    b.append(ground(GY - 6, 40, 810))
    b.append(stars3((250, 520), (745, 480), (190, 860)))
    return city_page(19, "Clarksville", "M", "Queen City", "Olympic star Wilma Rudolph grew up here and won 3 gold medals in 1960!", "".join(b))

def nashville():
    b = [sky_deco(1, (250, 330))]
    b.append(treeline(GY - 30, 40, 810, 120, 5))
    b.append(parthenon(530, GY - 4, w=520, h=520))
    b.append(bushes([330, 700], GY - 4))
    b.append(guitar(770, 735, 0.82, rot=-6))
    b.append(note(300, 400, 1.4) + note(130, 440, 1.2) + note(420, 300, 1.2))
    b.append(S("point", 160))
    b.append(fg_details(GY + 8, 3))
    b.append(ground(GY, 40, 810))
    b.append(stars3((530, 300), (250, 560), (640, 330)))
    return city_page(21, "Nashville", "M", "Music City", "Nashville has a full-size copy of the Parthenon from Greece!", "".join(b))

def franklin():
    b = [sky_deco(2)]
    sg = GY - 100
    for x, h in zip((40, 190, 340), (300, 340, 280)):
        b.append(storefront(x, sg, w=140, h=h))
    b.append(storefront(500, sg, w=200, h=360, awning=False, floors=3))
    b.append(marquee(600, 560, 190, 66, "THEATRE"))
    b.append(storefront(715, sg, w=100, h=280))
    b.append(bunting(60, 400, 600, 430, 9, 40))
    b.append(road(40, 810, sg + 8, 4.5))
    b.append(S("wave", 330, 1.45))
    b.append(ground(GY, 40, 810))
    b.append(stars3((420, 300), (120, 470), (760, 840)))
    return city_page(23, "Franklin", "M", "", "Franklin's historic downtown has a movie theater that opened in 1937!", "".join(b))

def columbia():
    b = [sky_deco(0, (480, 330))]
    b.append(hills_back(GY - 20, 2))
    b.append(barn(690, GY - 40, w=260))
    b.append(fence_ranch(40, 810, GY - 6, posts=7, h=90))
    b.append(mule(520, GY + 8, 1.35))
    b.append(bunting(120, 350, 760, 400, 9, 36))
    b.append(S("wave", 170))
    b.append(fg_details(GY + 12, 4))
    b.append(ground(GY + 8, 40, 810))
    b.append(stars3((430, 470), (760, 560), (300, 640)))
    return city_page(25, "Columbia", "M", "Mule Capital", "Columbia hosts Mule Day every spring with a big parade!", "".join(b))

def murfreesboro():
    b = [sky_deco(0, (560, 330))]
    b.append(tree_round(95, GY - 4, h=300) + tree_round(760, GY - 4, h=280))
    b.append(courthouse(450, GY - 4, w=460, h=560))
    b.append(bushes([300, 600], GY - 4))
    b.append(S("point", 180, 1.4))
    b.append(fg_details(GY + 8, 5))
    b.append(ground(GY, 40, 810))
    b.append(stars3((520, 260), (730, 560), (450, 700)))
    return city_page(27, "Murfreesboro", "M", "", "Murfreesboro was the capital of Tennessee from 1818 to 1826!", "".join(b))

def cookeville():
    b = [sky_deco(1)]
    b.append(treeline(480, 40, 810, 110, 6))
    b.append(waterfall(580, 520, GY - 10, w=200, cliff_w=480))
    b.append(tree_pine(330, 560, h=140) if False else "")
    b.append(rocks([380, 760], GY - 4))
    b.append(S("point", 150, 1.4))
    b.append(fg_details(GY + 12, 6))
    b.append(ground(GY - 4, 40, 810))
    b.append(stars3((430, 330), (260, 560), (560, 660)))
    return city_page(29, "Cookeville", "M", "", "Cummins Falls near Cookeville tumbles 75 feet. You can see lots of waterfalls here!", "".join(b))

# ------------------------------------------------------------- EAST
def chattanooga():
    b = [sky_deco(2)]
    a = (70, 880); bb = (560, 470)
    ang = math.degrees(math.atan2(bb[1] - a[1], bb[0] - a[0]))
    b.append(P(f"M 40 {GY} L 40 905 L 560 450 L 810 450 L 810 {GY} Z", 5, "white"))
    b.append(tree_pine(690, 620, h=170) + tree_pine(765, 700, h=200) + tree_pine(640, 560, h=130))
    b.append(incline((75, 878), (545, 475), 15))
    t = 0.55
    cx, cy = a[0] + (bb[0] - a[0]) * t, a[1] + (bb[1] - a[1]) * t
    b.append(G(cx - 4, cy - 14, incline_car(250, 130), 1.0, rot=ang))
    b.append(G(cx - 22, cy - 78, scout_bust(), 0.42, rot=ang))
    b.append(S("lpoint", 650, 1.4))
    b.append(ground(GY, 40, 810))
    b.append(stars3((430, 300), (150, 400), (400, 870)))
    return city_page(31, "Chattanooga", "E", "Scenic City", "The Incline Railway up Lookout Mountain is one of the steepest in the world!", "".join(b), 44)

def sweetwater():
    b = []
    b.append(cave_arch(GY - 20, 160))
    b.append(river(760, 930, 50, 800, 5))
    b.append(stalagmites([90, 170, 730, 790], GY - 20, [110, 70, 120, 80]))
    b.append(G(0, 0, "".join(fish(x, y, 120) for x, y in ((220, 850), (560, 880)))))
    b.append(boat(450, 790, 340))
    b.append(sc(scout("wave"), 450, 770, 1.0))
    b.append(stars3((260, 330), (640, 470), (420, 300)))
    return city_page(33, "Sweetwater", "E", "", "The Lost Sea in Sweetwater is America's largest underground lake!", "".join(b))

def oak_ridge():
    b = [sky_deco(0, (520, 300))]
    b.append(hills_back(GY - 10, 1))
    b.append(lab_building(610, GY - 8, w=330, h=260))
    b.append(sky(atom(330, 440, 120)))
    b.append(bushes([440, 780], GY - 4))
    b.append(S("point", 160))
    b.append(fg_details(GY + 10, 7))
    b.append(ground(GY, 40, 810))
    b.append(stars3((600, 320), (140, 450), (460, 660)))
    return city_page(35, "Oak Ridge", "E", "Secret City", "In the 1940s Oak Ridge was a secret city. Today scientists there use super computers!", "".join(b))

def knoxville():
    b = [sky_deco(2)]
    b.append(treeline(GY - 30, 40, 810, 110, 7))
    b.append(sunsphere(590, GY - 6, h=640))
    b.append(tree_round(770, GY - 6, h=330) + tree_pine(80, GY - 6, h=330))
    b.append(S("wave", 250))
    b.append(fg_details(GY + 8, 8))
    b.append(ground(GY, 40, 810))
    b.append(stars3((420, 330), (760, 520), (350, 640)))
    return city_page(37, "Knoxville", "E", "Scruffy City", "The Sunsphere is a gold glass ball 266 feet tall, built for the 1982 World's Fair!", "".join(b))

def sevierville():
    b = [sky_deco(0, (500, 300))]
    b.append(tree_round(95, GY - 4, h=280) + tree_round(770, GY - 4, h=260))
    b.append(courthouse(450, GY - 4, w=440, h=520))
    b.append(rocks([700], GY - 4))
    b.append(guitar(705, GY - 90, 0.5, rot=14))
    b.append(sky("".join(butterfly(x, y, 1.6) for x, y in ((620, 560), (780, 600), (540, 700)))))
    b.append(S("wave", 160))
    b.append(fg_details(GY + 8, 9))
    b.append(ground(GY, 40, 810))
    b.append(stars3((330, 330), (760, 450), (330, 700)))
    return city_page(39, "Sevierville", "E", "", "A statue of singer Dolly Parton sits at the courthouse. She grew up nearby!", "".join(b))

def pigeon_forge():
    b = [sky_deco(2)]
    b.append(ferris_wheel(610, 640, 160))
    b.append(sky(balloon_bunch(280, 400, 1.2)))
    b.append(locomotive(360, GY - 28, w=330))
    b.append(rail_track(40, 810, GY - 20, 4))
    b.append(steam_puffs(420, 600, 3))
    b.append(S("wave", 120, 1.3))
    b.append(fg_details(GY + 8, 10))
    b.append(ground(GY + 8, 40, 810))
    b.append(stars3((470, 300), (760, 440), (140, 480)))
    return city_page(41, "Pigeon Forge", "E", "", "Dollywood in Pigeon Forge has roller coasters and a real steam train!", "".join(b), 44)

def gatlinburg():
    b = [sky_deco(2)]
    b.append(mountain_layer(GY - 30, ((150, 400, 520), (520, 470, 600), (800, 330, 420))))
    b.append(space_needle(640, GY - 4, h=560))
    b.append(tree_pine(100, GY - 4, h=300) + tree_pine(780, GY - 4, h=260))
    b.append(S("wave", 280))
    b.append(G(470, GY, matted(bear_cub(0, 0, 1.0), 9, 1.2), 1.2))
    b.append(fg_details(GY + 8, 11))
    b.append(ground(GY, 40, 810))
    b.append(stars3((430, 300), (750, 470), (140, 460)))
    return city_page(43, "Gatlinburg", "E", "", "Gatlinburg is the door to the Great Smoky Mountains, America's most-visited national park!", "".join(b), 46)

def johnson_city():
    b = [sky_deco(2)]
    b.append(mountain_layer(GY - 150, ((140, 330, 440), (470, 400, 520), (760, 300, 400))))
    b.append(fossil_dig(570, GY - 4, w=520))
    b.append(shovel(790, GY - 4, 190))
    b.append(S("point", 190))
    b.append(fg_details(GY + 8, 12))
    b.append(ground(GY, 40, 810))
    b.append(stars3((430, 300), (270, 470), (700, 560)))
    return city_page(45, "Johnson City", "E", "", "Scientists dug up animal fossils about 5 million years old at the Gray Fossil Site!", "".join(b), 44)

def kingsport():
    b = []
    b.append(sky(star_field(60, 160, 800, 420, n=12)))
    b.append(cloudy((690, 230, 24)))
    b.append(hills_back(GY - 6, 0))
    b.append(dome(560, GY - 6, w=420))
    b.append(tree_pine(790, GY - 6, h=340))
    b.append(telescope(120, GY - 6, h=250))
    b.append(S("point", 330, 1.35))
    b.append(fg_details(GY + 8, 13))
    b.append(ground(GY, 40, 810))
    b.append(stars3((450, 260), (740, 520), (130, 560)))
    return city_page(47, "Kingsport", "E", "Model City", "Bays Mountain Park in Kingsport has a planetarium for looking at the stars!", "".join(b))

def bristol():
    b = [sky_deco(1)]
    sg = GY - 6
    b.append(road(40, 810, sg - 76, 4.5))
    b.append(P(f"M 150 {sg} L 150 520 M 700 {sg} L 700 520", 8))
    b.append(P("M 120 520 L 730 520 L 730 400 L 120 400 Z", 5, "white"))
    b.append(TXT(425, 480, "BRISTOL", 70))
    b.append(TXT(210, 466, "TENNESSEE", 24) + TXT(640, 466, "VIRGINIA", 24))
    b.append(tree_round(780, sg - 80, h=300) + tree_round(90, sg - 80, h=280))
    b.append(car_side(610, sg - 20, w=300))
    b.append(S("wave", 300, 1.35))
    b.append(fg_details(GY + 8, 14))
    b.append(ground(GY, 40, 810))
    b.append(stars3((425, 300), (110, 330), (610, 360)))
    return city_page(49, "Bristol", "E", "", "Bristol sits in two states! Its main street is part Tennessee, part Virginia.", "".join(b))

# ordered book
CITIES = [memphis, tiptonville, paris, jackson, clarksville, nashville, franklin, columbia, murfreesboro, cookeville,
          chattanooga, sweetwater, oak_ridge, knoxville, sevierville, pigeon_forge, gatlinburg, johnson_city, kingsport, bristol]

if __name__ == "__main__":
    import os, sys
    from PIL import Image
    os.makedirs("out", exist_ok=True)
    only = sys.argv[1:]
    ims = []
    for f in CITIES:
        if only and f.__name__ not in only: continue
        svg = f(); open(f"out/{f.__name__}.svg", "w").write(svg)
        cairosvg.svg2png(bytestring=svg.encode(), write_to=f"out/{f.__name__}.png", output_width=660)
        ims.append(Image.open(f"out/{f.__name__}.png"))
    for k in range(0, len(ims), 6):
        chunk = ims[k:k+6]
        rows = [chunk[i:i+3] for i in range(0, len(chunk), 3)]
        m = Image.new("RGB", (660*3, ims[0].height*len(rows)), "white")
        for r, row in enumerate(rows):
            for c, im in enumerate(row): m.paste(im, (c*660, r*ims[0].height))
        m.save(f"out/sheet{k//6}.png")
