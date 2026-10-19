#!/usr/bin/env python3
"""Write captions.srt per episode from the scripts and the scene starts used in src/mane/episodes.ts."""
import os

EP = {
    "Mon": (73.45, [0, 8.5, 13.2, 20.2, 27.4, 30.4, 42.6, 50.2, 55.8, 60.4, 70.0], [
        "Nigeria lost between 3.5 and 5 trillion naira of food after harvest in 2025.",
        "The food grew, got picked, and never reached a plate.",
        "A ten-year programme worth about 3.5 billion dollars now targets that loss.",
        "It plans solar-powered cold rooms, built with private partners. Most of it is still a plan.",
        "So what happens if the plan works?",
        "A national target is a 40 to 50 percent cut in those losses. That keeps 1.4 to 2.5 trillion naira of food in the market each year.",
        "Industry groups say Nigeria needs about 5,000 cold trucks and 100 cold rooms.",
        "Those groups also say banks often do not understand the cold chain.",
        "Banks read your business plan before they fund your cold room.",
        "Manetrust Solutions writes business plans, financial projections and market research for businesses chasing opportunities like this.",
        "DM us for a business plan a lender can read."]),
    "Tue": (63.09, [0, 5.3, 11.1, 19.1, 21.3, 36.2, 43.7, 49.0, 53.1, 61.0], [
        "A card in your wallet earns Costco about half of its operating profit.",
        "Meet Chike, a fictional founder in Lagos. He wants the same model.",
        "Chike sells rice, oil and detergent at almost cost price. Every shopper saves money on the trolley.",
        "So where does Chike earn?",
        "Every member pays an annual fee. Say 50,000 naira. With 20,000 members, that is one billion naira a year before he sells a single bag. These figures are made up for the story.",
        "Costco's renewal rate sits above 90 percent in the US and Canada. A member who renews keeps paying.",
        "More members let Chike buy in bigger bulk, so his prices drop again.",
        "Chike's club needs a plan that proves the member numbers.",
        "Manetrust Solutions writes the business plan and financial projections that show lenders how a membership model earns.",
        "DM us to start yours."]),
    "Wed": (57.29, [0, 6.1, 12.0, 20.9, 23.1, 30.4, 36.6, 43.5, 47.6, 55.1], [
        "Two funds worth 250 million dollars are open to Nigerian businesses.",
        "One is 150 million dollars for business expansion, from NACCIMA.",
        "The other is 100 million dollars in equity for local oil and gas firms, from NCDMB and the Bank of Industry.",
        "So who gets a share?",
        "SMEDAN says many small businesses lack the skills and structure to reach funds that already exist.",
        "The lender Zedvance says it targets one trillion naira in SME loans.",
        "Funds and lenders decide on what they can read. A written case is the first thing on the table.",
        "Your documents decide how far the key turns.",
        "Manetrust Solutions writes proposals, pitch decks and company profiles for businesses applying to funds like these.",
        "DM us to get yours ready."]),
    "Thu": (68.3, [0, 7.4, 13.3, 21.9, 24.5, 38.8, 49.8, 57.1, 61.4], [
        "Nigeria has fewer than 1,000 cold trucks. It needs about 25,000.",
        "Meet Bimbo, a fictional founder who sees that gap as a business.",
        "Bimbo starts with three refrigerated trucks. Farmers pay her to move tomatoes, fish and dairy without spoilage.",
        "So what could sixty trucks earn?",
        "Say each truck makes 20 trips a month at 150,000 naira. Sixty trucks earn 180 million naira a month. These figures are made up for the story.",
        "Her customers have a reason to pay. Industry groups put 2025 post-harvest losses at 3.5 to 5 trillion naira.",
        "Bimbo's problem is money. Industry groups say banks often do not understand the cold chain.",
        "Trucks need funding, and funding needs proof.",
        "Manetrust Solutions writes the business plan and market research that show a lender the size of the gap."]),
    "Fri": (68.49, [0, 9.5, 15.4, 22.7, 31.1, 34.3, 46.9, 52.9, 57.1, 66.0], [
        "SMEDAN says loans priced at 9 to 9.5 percent exist for expansion, equipment and working capital.",
        "It also says many small businesses lack the structure to qualify.",
        "Meet Kunle, a fictional baker in Ibadan. One shop, 400 loaves a day.",
        "Kunle writes down every step, from flour order to shelf. Outlet two copies outlet one.",
        "So what does twelve outlets look like?",
        "4,800 loaves a day at 1,200 naira each is 5.76 million naira a day. These figures are made up for the story.",
        "Because the steps are on paper, a lender can see what its money buys.",
        "Lenders fund what you can show them on paper.",
        "Manetrust Solutions writes the business plan and financial projections that show lenders your system and your numbers.",
        "DM us to start yours."]),
    "Sun": (65.49, [0, 10.3, 19.8, 27.4, 31.0, 42.2, 50.4, 55.3, 63.5], [
        "A study of 20 Nigerian Stock Exchange companies named one main cause of failure: poor management of cash.",
        "The study looked at non-financial firms. Liquidity, the cash on hand to pay bills, was the common thread.",
        "A business can sell well and still fail. Bills fall due before customers pay.",
        "So how does an owner see it coming?",
        "A cash flow projection lists money in and money out, month by month. A gap shows up on paper before it shows up at the bank.",
        "Studies of small Nigerian firms also point to poor management of resources and weak access to finance.",
        "A projection finds the leak before the bucket empties.",
        "Manetrust Solutions builds financial projections and business plans that map your cash, month by month.",
        "DM us for yours."]),
}


def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"


os.makedirs("deliver", exist_ok=True)
for day, (dur, starts, lines) in EP.items():
    assert len(starts) == len(lines), day
    out = []
    for i, (s, text) in enumerate(zip(starts, lines)):
        e = (starts[i + 1] - 0.1) if i + 1 < len(starts) else dur
        out.append(f"{i + 1}\n{ts(s + 0.05)} --> {ts(e)}\n{text}\n")
    open(f"deliver/{day}_captions.srt", "w").write("\n".join(out))
    print("wrote", day)
