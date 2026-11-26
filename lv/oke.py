import engine, kit

TITLE = "The Fee That Pays Before You Sell"
SLUG = "oke-membership"
BRAND = ("#333333", "#800080", "#E9E2E9")
KEEP_COLOURS = True          # the user chose to keep sheet 2's dark skin; keep the generator's own colours
N = "₦"                 # naira sign

# scene starts measured from the edited voiceover (voiceover_fixed.wav, 65.93 s)
STARTS = [0.0, 6.0, 13.3, 18.4, 24.8, 30.4, 36.44, 42.34, 48.14, 54.64, 59.04, 64.74]
SCENES = [
    ("s1", 6.0, 0.3, ["Half of Costco's operating profit", "comes from a membership fee,", "not from the shelves."]),
    ("s2", 7.3, 0.3, ["Lets replicate it in Lagos.", "Oke, a Lagos founder,", "copies the model with one warehouse."]),
    ("s3", 5.1, 0.3, ["He sells grains, meat, oil and vegetables", "close to cost."]),
    ("s4", 6.4, 0.3, ["Members pay forty thousand naira a year to shop.", "The fee is where the profit lives."]),
    ("s5", 5.6, 0.3, ["He signs five thousand members.", "That is two hundred million naira in fees."]),
    ("s6", 6.04, 0.3, ["Each member spends one point two million naira a year.", "His profit: another two hundred million."]),
    ("s7", 5.9, 0.3, ["Total: four hundred million naira.", "Half of it landed before the first sale."]),
    ("s8", 5.8, 0.3, ["Costco members renew around nine times in ten,", "so the fee comes back every year."]),
    ("s9", 6.5, 0.3, ["Take Oke to two hundred thousand members", "and the fee alone is eight billion naira."]),
    ("s10", 4.4, 0.3, ["Investors and lenders want that renewal math on paper."]),
    ("s11", 5.7, 0.3, ["Maintrust Solutions writes the financial projections", "and pitch deck behind a membership business."]),
    ("s12", 3.0, 0.3, ["DM us."]),
]


def fig(i, name, left, top, h):
    return f'<img class="fig" id="{i}" src="assets/{name}.png" style="left:{left}px;top:{top}px;height:{h}px" alt="">'


HTML, ANIM = {}, {}

# 1 hook: Costco fee (number scene, no hero). Frame 0 already shows the hook.
HTML["s1"] = f'''
__K:float:s1-f|10|3__
<div class="anton abs" id="s1-h" style="left:0;top:20px;width:960px;font-size:122px;line-height:1.0">HALF OF COSTCO'S<br>PROFIT</div>
<div class="abs hot stripes blk" id="s1-blk" style="left:0;top:330px;width:580px;height:380px;border-radius:44px"><div class="anton" id="s1-fee" style="font-size:170px;line-height:1">= A FEE</div></div>
__K:ripple:s1-rp|360|left:600px;top:330px__
__K:icon:pie|s1-pie|320|left:620px;top:350px__
__K:icon:coin|s1-coin|230|left:665px;top:745px__
<div class="mono abs" id="s1-src" style="left:0;top:760px;width:560px;font-size:30px;line-height:1.35;color:var(--mute)">COSTCO FY2025<br>FEES $5.3B / OP. INCOME $10.4B</div>
'''
ANIM["s1"] = r'''
        IC.float("s1-f", s, D.s1); IC.pie("s1-pie", s + 0.1, D.s1 - 0.4);
        growY("#s1-blk", s + 2.5, 0.6, "power4.out"); slam("#s1-fee", s + 2.75); IC.stripes("#s1-blk", s + 2.5, D.s1 - 2.8);
        IC.ripple("s1-rp", s + 2.6, D.s1 - 2.9); up("#s1-src", s + 3.4, {y: 20});
        IC.coin("s1-coin", s + 4.6, D.s1 - 4.9);
'''

# 2 Lagos + Oke enters
HTML["s2"] = f'''
__K:float:s2-f|10|5__
__K:icon:pin|s2-pin|250|left:0;top:20px__
<div class="anton abs" id="s2-h" style="left:280px;top:40px;width:680px;font-size:100px;line-height:1.02">REPLICATE IT<br><span style="color:var(--hot)">IN LAGOS</span></div>
__K:uline:s2-u|420|left:280px;top:262px__
__K:ring:s2-r|470|left:510px;top:420px|14 18|INK__
{fig("s2-a", "oke_neutral", 640, 300, 760)}
<div class="anton abs" id="s2-n" style="left:0;top:380px;width:560px;font-size:230px;line-height:1">OKE</div>
<div class="mono abs" id="s2-t" style="left:6px;top:640px;width:560px;font-size:32px;letter-spacing:0.1em;color:var(--mute)">LAGOS FOUNDER (FICTIONAL)</div>
__K:icon:shop|s2-shop|260|left:20px;top:740px__
'''
ANIM["s2"] = r'''
        IC.float("s2-f", s, D.s2); IC.pin("s2-pin", s + 0.24, D.s2 - 0.6);
        up("#s2-h", s + 0.3); IC.uline("s2-u", s + 1.1);
        IC.ring("s2-r", s + 2.4, D.s2 - 2.7, 1); figIn("#s2-a", s + 2.66, "right"); push("#s2-a", s + 3.4, D.s2 - 3.7);
        up("#s2-n", s + 2.8); up("#s2-t", s + 3.5, {y: 20});
        IC.shop("s2-shop", s + 4.84, D.s2 - 5.1);
'''

# 3 close to cost: think -> point
HTML["s3"] = f'''
__K:float:s3-f|9|7__
<div class="abs" style="left:0;top:40px;width:960px;display:flex;gap:16px">
  <div class="chip" id="s3-c1">GRAINS</div><div class="chip" id="s3-c2">MEAT</div><div class="chip" id="s3-c3">OIL</div><div class="chip" id="s3-c4">VEG</div>
</div>
{fig("s3-a", "oke_think", 20, 280, 760)}{fig("s3-b", "oke_point", 20, 280, 760)}
<div class="abs hot stripes blk" id="s3-blk" style="left:440px;top:250px;width:520px;height:400px;border-radius:44px"><div class="anton" style="font-size:150px;line-height:1">AT COST</div></div>
__K:icon:truck|s3-tr|260|left:600px;top:720px__
'''
ANIM["s3"] = r'''
        IC.float("s3-f", s, D.s3); pop("#s3-c1, #s3-c2, #s3-c3, #s3-c4", s + 0.2, {st: 0.12});
        figIn("#s3-a", s + 0.3, "left"); hide("#s3-b"); IC.truck("s3-tr", s + 0.8, D.s3 - 1.1);
        swap("#s3-a", "#s3-b", s + 3.68); growY("#s3-blk", s + 3.68, 0.5, "power4.out"); IC.stripes("#s3-blk", s + 3.68, D.s3 - 3.9);
'''

# 4 the fee: neutral -> sly on "profit"
HTML["s4"] = f'''
__K:float:s4-f|9|11__
<div class="num abs" id="s4-n" style="left:0;top:40px;font-size:190px;color:var(--hot)">{N}0</div>
<div class="mono abs" id="s4-l" style="left:6px;top:250px;font-size:34px;letter-spacing:0.12em;color:var(--mute)">A YEAR, PER MEMBER</div>
<div class="abs inv blk" id="s4-blk" style="left:0;top:380px;width:560px;height:320px;border-radius:44px"><div class="anton" id="s4-bt" style="font-size:112px;line-height:1.02">THE FEE<br>= PROFIT</div></div>
__K:icon:coin|s4-coin|250|left:150px;top:760px__
__K:spark:s4-sp|70|left:540px;top:330px__
{fig("s4-a", "oke_neutral", 650, 300, 760)}{fig("s4-b", "oke_sly", 650, 300, 760)}
'''
ANIM["s4"] = r'''
        IC.float("s4-f", s, D.s4); figIn("#s4-a", s + 0.2, "right"); hide("#s4-b");
        show("#s4-n", s + 0.2, 0.3); cnt("s4-n", s + 1.03, 40000, 0.9, NAIRA); up("#s4-l", s + 1.4, {y: 20});
        IC.coin("s4-coin", s + 1.1, D.s4 - 1.4);
        growY("#s4-blk", s + 4.08, 0.6, "power4.out"); up("#s4-bt", s + 4.3, {y: 30});
        swap("#s4-a", "#s4-b", s + 5.15); IC.spark("s4-sp", s + 5.3, D.s4 - 5.6);
'''

# 5 5,000 x N40,000 = N200M
HTML["s5"] = f'''
__K:float:s5-f|8|13__
{fig("s5-a", "oke_think", 0, 420, 640)}
<div class="num abs" id="s5-n" style="left:330px;top:30px;font-size:150px">0</div>
<div class="mono abs" id="s5-l" style="left:336px;top:190px;font-size:34px;letter-spacing:0.12em;color:var(--mute)">MEMBERS</div>
<div class="anton abs" id="s5-x" style="left:330px;top:250px;font-size:100px;line-height:1">&times; {N}40,000</div>
<div class="abs hot stripes" id="s5-blk" style="left:330px;top:400px;width:630px;height:300px;border-radius:44px"></div>
<div class="num abs" id="s5-t" style="left:375px;top:460px;font-size:150px;color:var(--onhot)">{N}200M</div>
<div class="mono abs" id="s5-tl" style="left:384px;top:630px;font-size:34px;letter-spacing:0.12em;color:var(--onhot)">IN FEES</div>
__K:icon:bars|s5-bars|240|left:380px;top:760px__
__K:icon:laptop|s5-lap|240|left:690px;top:760px__
'''
ANIM["s5"] = r'''
        IC.float("s5-f", s, D.s5); figIn("#s5-a", s + 0.2, "left");
        show("#s5-n", s + 0.33, 0.25); cnt("s5-n", s + 0.33, 5000, 0.9); up("#s5-l", s + 0.8, {y: 20}); up("#s5-x", s + 1.6);
        IC.bars("s5-bars", s + 0.6, D.s5 - 0.9);
        growY("#s5-blk", s + 2.78, 0.6, "power4.out"); IC.stripes("#s5-blk", s + 2.78, D.s5 - 3.0);
        slam("#s5-t", s + 3.2); up("#s5-tl", s + 3.6, {y: 20}); IC.laptop("s5-lap", s + 3.0, D.s5 - 3.3);
'''

# 6 per-member profit: neutral -> laugh on "another two hundred million"
HTML["s6"] = f'''
__K:float:s6-f|8|17__
<div class="mono abs" id="s6-l1" style="left:6px;top:30px;font-size:32px;letter-spacing:0.12em;color:var(--mute)">EACH MEMBER SPENDS</div>
<div class="num abs" id="s6-n1" style="left:0;top:80px;font-size:140px">{N}1.2M</div>
<div class="mono abs" id="s6-l2" style="left:6px;top:270px;font-size:32px;letter-spacing:0.12em;color:var(--mute)">HIS PROFIT PER MEMBER</div>
<div class="num abs" id="s6-n2" style="left:0;top:320px;font-size:140px;color:var(--hot)">{N}40,000</div>
<div class="abs hot stripes blk" id="s6-blk" style="left:0;top:530px;width:620px;height:270px;border-radius:44px"><div class="num" id="s6-t" style="font-size:128px">+{N}200M</div></div>
__K:icon:bars|s6-bars|220|left:40px;top:830px__
__K:ring:s6-r|440|left:560px;top:420px|14 18|HOT__
{fig("s6-a", "oke_neutral", 680, 300, 760)}{fig("s6-b", "oke_laugh", 680, 300, 760)}
'''
ANIM["s6"] = r'''
        IC.float("s6-f", s, D.s6); figIn("#s6-a", s + 0.2, "right"); hide("#s6-b"); IC.ring("s6-r", s + 0.4, D.s6 - 0.7, -1);
        up("#s6-l1", s + 0.18, {y: 20}); pop("#s6-n1", s + 1.5, {from: 0.8});
        up("#s6-l2", s + 3.5, {y: 20}); pop("#s6-n2", s + 3.7, {from: 0.8});
        growY("#s6-blk", s + 4.48, 0.5, "power4.out"); slam("#s6-t", s + 4.6); IC.stripes("#s6-blk", s + 4.48, D.s6 - 4.7);
        swap("#s6-a", "#s6-b", s + 4.48); IC.bars("s6-bars", s + 4.7, D.s6 - 5.0);
'''

# 7 total N400M, split in half (biggest figure in the video)
HTML["s7"] = f'''
__K:float:s7-f|8|19__
<div class="mono abs" id="s7-l" style="left:6px;top:20px;font-size:34px;letter-spacing:0.12em;color:var(--mute)">TOTAL</div>
<div class="num abs" id="s7-n" style="left:0;top:70px;font-size:230px;color:var(--hot)">{N}0M</div>
<div class="abs hot stripes blk" id="s7-b1" style="left:0;top:360px;width:470px;height:180px;border-radius:36px"><div class="num" style="font-size:62px">{N}200M FEES</div></div>
<div class="abs inv blk" id="s7-b2" style="left:0;top:555px;width:470px;height:180px;border-radius:36px"><div class="num" style="font-size:62px">{N}200M SHELF</div></div>
<div class="anton abs" id="s7-h" style="left:0;top:760px;width:470px;font-size:84px;line-height:1">HALF <span style="color:var(--hot)">= FEES</span></div>
__K:icon:pie|s7-pie|220|left:520px;top:300px__
{fig("s7-a", "oke_spread", 470, 520, 540)}
'''
ANIM["s7"] = r'''
        IC.float("s7-f", s, D.s7); up("#s7-l", s + 0.27, {y: 20});
        show("#s7-n", s + 0.27, 0.25); cnt("s7-n", s + 1.19, 400, 0.9, NAIRA, "M");
        figIn("#s7-a", s + 0.4, "up"); IC.pie("s7-pie", s + 0.6, D.s7 - 0.9);
        growX("#s7-b1", s + 2.99, 0.5); growX("#s7-b2", s + 3.15, 0.5); IC.stripes("#s7-b1", s + 2.99, D.s7 - 3.2);
        up("#s7-h", s + 3.6);
'''

# 8 renewals: think -> thumbs on "nine"
HTML["s8"] = f'''
__K:float:s8-f|8|23__
{fig("s8-a", "oke_think", 20, 300, 760)}{fig("s8-b", "oke_thumbs", 20, 300, 760)}
__K:ripple:s8-rp|340|left:560px;top:0__
__K:icon:clock|s8-clk|300|left:580px;top:20px__
<div class="anton abs" id="s8-h" style="left:400px;top:380px;width:560px;font-size:200px;line-height:1">9 IN 10</div>
<div class="anton abs" id="s8-r" style="left:400px;top:600px;width:560px;font-size:130px;line-height:1;color:var(--hot)">RENEW</div>
<div class="mono abs" id="s8-l" style="left:404px;top:770px;width:556px;font-size:30px;line-height:1.35;letter-spacing:0.08em;color:var(--mute)">COSTCO MEMBERS<br>(AROUND, PER ANALYSTS)</div>
'''
ANIM["s8"] = r'''
        IC.float("s8-f", s, D.s8); figIn("#s8-a", s + 0.2, "left"); hide("#s8-b");
        IC.clock("s8-clk", s + 0.3, D.s8 - 0.6); IC.ripple("s8-rp", s + 2.0, D.s8 - 2.3);
        up("#s8-h", s + 1.95); swap("#s8-a", "#s8-b", s + 1.95);
        up("#s8-r", s + 2.4); up("#s8-l", s + 3.5, {y: 20});
'''

# 9 scale: think -> point on "eight billion"
HTML["s9"] = f'''
__K:float:s9-f|8|29__
<div class="num abs" id="s9-n" style="left:0;top:30px;font-size:170px">0</div>
<div class="mono abs" id="s9-l" style="left:6px;top:210px;font-size:34px;letter-spacing:0.12em;color:var(--mute)">MEMBERS</div>
__K:icon:bars|s9-bars|260|left:20px;top:290px__
__K:icon:pin|s9-pin|220|left:330px;top:320px__
<div class="abs hot stripes blk" id="s9-blk" style="left:0;top:600px;width:600px;height:330px;border-radius:44px">
  <div class="num" id="s9-t" style="font-size:170px">{N}8BN</div><div class="mono" style="font-size:34px;letter-spacing:0.12em">IN FEES ALONE</div></div>
{fig("s9-a", "oke_think", 640, 300, 760)}{fig("s9-b", "oke_point", 640, 300, 760)}
'''
ANIM["s9"] = r'''
        IC.float("s9-f", s, D.s9); figIn("#s9-a", s + 0.2, "right"); hide("#s9-b");
        show("#s9-n", s + 0.19, 0.25); cnt("s9-n", s + 0.19, 200000, 0.9); up("#s9-l", s + 0.7, {y: 20});
        IC.bars("s9-bars", s + 0.5, D.s9 - 0.8); IC.pin("s9-pin", s + 1.2, D.s9 - 1.5);
        growY("#s9-blk", s + 3.3, 0.9, "power4.out"); IC.stripes("#s9-blk", s + 3.3, D.s9 - 3.5);
        slam("#s9-t", s + 4.8); swap("#s9-a", "#s9-b", s + 4.8);
'''

# 10 on paper: neutral -> worried on "want"
HTML["s10"] = f'''
__K:float:s10-f|8|31__
<div class="anton abs" id="s10-h" style="left:0;top:30px;width:620px;font-size:170px;line-height:1">ON PAPER</div>
__K:uline:s10-u|520|left:0;top:210px__
<div class="mono abs" id="s10-l" style="left:6px;top:250px;width:600px;font-size:32px;letter-spacing:0.1em;color:var(--mute)">INVESTORS + LENDERS ASK</div>
__K:ring:s10-r|420|left:90px;top:360px|14 18|INK__
__K:icon:doc|s10-doc|340|left:130px;top:400px__
{fig("s10-a", "oke_neutral", 660, 300, 760)}{fig("s10-b", "oke_worried", 660, 300, 760)}
'''
ANIM["s10"] = r'''
        IC.float("s10-f", s, D.s10); figIn("#s10-a", s + 0.2, "right"); hide("#s10-b");
        up("#s10-l", s + 0.3, {y: 20}); IC.doc("s10-doc", s + 0.6, D.s10 - 0.9); IC.ring("s10-r", s + 0.8, D.s10 - 1.1, 1);
        swap("#s10-a", "#s10-b", s + 1.85); up("#s10-h", s + 3.4); IC.uline("s10-u", s + 3.7);
'''

# 11 Manetrust: name, then two chips
HTML["s11"] = f'''
__K:float:s11-f|8|37__
<div class="anton abs" id="s11-h" style="left:0;top:40px;width:960px;font-size:172px;line-height:1;color:var(--hot)">MANETRUST</div>
<div class="mono abs" id="s11-l" style="left:6px;top:260px;font-size:34px;letter-spacing:0.12em;color:var(--mute)">WRITES THE</div>
<div class="chip abs" id="s11-c1" style="left:0;top:370px;font-size:52px">FINANCIAL PROJECTIONS</div>
__K:icon:line|s11-ln|220|left:720px;top:330px__
<div class="chip abs" id="s11-c2" style="left:0;top:600px;font-size:52px">PITCH DECK</div>
__K:icon:doc|s11-doc|220|left:720px;top:560px__
__K:icon:shield|s11-sh|200|left:0;top:740px__
<div class="mono abs" id="s11-m" style="left:230px;top:810px;width:700px;font-size:30px;letter-spacing:0.1em;color:var(--mute)">FOR A MEMBERSHIP BUSINESS</div>
'''
ANIM["s11"] = r'''
        IC.float("s11-f", s, D.s11); up("#s11-h", s + 0.26); IC.shield("s11-sh", s + 0.6, D.s11 - 0.9);
        up("#s11-l", s + 1.2, {y: 20}); pop("#s11-c1", s + 1.76, {from: 0.8}); IC.line("s11-ln", s + 1.9, D.s11 - 2.2);
        pop("#s11-c2", s + 3.44, {from: 0.8}); IC.doc("s11-doc", s + 3.6, D.s11 - 3.9); up("#s11-m", s + 4.0, {y: 20});
'''

# 12 action
HTML["s12"] = f'''
<div class="abs hot stripes blk" id="s12-blk" style="left:0;top:260px;width:960px;height:420px;border-radius:44px"><div class="anton" id="s12-t" style="font-size:280px;line-height:1">DM US</div></div>
__K:ripple:s12-rp|300|left:330px;top:700px__
__K:icon:phone|s12-ph|280|left:340px;top:710px__
'''
ANIM["s12"] = r'''
        growY("#s12-blk", s + 0.1, 0.3, "power4.out"); slam("#s12-t", s + 0.3); IC.stripes("#s12-blk", s + 0.1, D.s12);
        IC.phone("s12-ph", s + 0.4, D.s12 - 0.4); IC.ripple("s12-rp", s + 0.6, D.s12 - 0.6);
'''

# count-up that lands exactly on a formatted value (commas, prefix, suffix)
CNT_JS = r'''
      const NAIRA = "₦";
      const fmt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const cnt = (id, t, to, d, pre = "", suf = "") => { const el = document.getElementById(id), o = { v: 0 };
        el.textContent = pre + "0" + suf; tl.to(o, { v: to, duration: d, ease: "power2.out", onUpdate: () => { el.textContent = pre + fmt(o.v) + suf; } }, t); };
'''

HTML = kit.fill(HTML, BRAND)
EXTRA_CSS = kit.CSS
PRE_JS = kit.JS + CNT_JS

if __name__ == "__main__":
    engine.main(globals())
