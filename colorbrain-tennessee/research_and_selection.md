# Research & selection - Scout Explores Tennessee (ColorBrain, run of 2026-10-24)

**Read this first - what this run could and could not do.** The sandbox blocks Apple (`books.apple.com`, `rss.marketingtools.apple.com`, PopVortex) and Amazon/KDP (`kdp.amazon.com`, Kindle Ranker) hosts (DNS lookups failed). No browser tools were available. Everything below therefore comes from **web search snippets and the pages search could surface**. I could not capture a chart snapshot, a Best Sellers Rank, or a sales estimate, so **there are no sales numbers in this report and none were invented**. The skill's depth targets (30 platforms, 90 review sources, 2 chart snapshots) were **not met**; rows below say what was and wasn't reached. Treat the ranking as **low confidence**. The concept itself was your brief; this research mostly shapes *how* to build it.

## 1. Target market profile
- **Buyer:** parents, grandparents and teachers gifting to children aged 6-9; Tennessee families, tourists and homeschoolers; collectors of the "Scout Explores" series (a Nigeria edition already exists).
- **Reader:** ages 6-9 - medium detail, short readable facts, a character they follow.
- **Purchase triggers (inferred):** a trip to or from Tennessee, a school state-studies unit, a gift from a visit, screen-free time.
- **Brand:** JCF Publishing; blue / yellow / pink (taken from the Nigeria edition). Trim: A4 portrait (assumed).

## 2. Store scouting
**applescout - access mode: WebSearch only. Confidence: Low.**
- Apple chart endpoints, genre charts and title pages were unreachable (`getaddrinfo ENOTFOUND books.apple.com`, `rss.marketingtools.apple.com`, `www.popvortex.com`). No chart rows captured (0 of the expected ~100).
- A `site:books.apple.com` search for coloring books returned only **App Store coloring apps** (e.g. *Baby & Kids Coloring Book*, *Coloring for Kids 2*, *KidsFun Coloring Books*) and no Apple Books titles - [search results](https://apps.apple.com/us/app/id1489073573). **Channel-fit finding (inferred):** coloring demand on Apple's platform shows up as apps, not ebooks. Apple Books is not a recommended channel for this product.
- Fixed-layout ebooks are possible but a specialist format; one provider still builds them for Amazon, Apple and Google Play ([Gatekeeper Press KB](https://kb.gatekeeperpress.com/doc/can-gatekeeper-create-fixed-layout-ebooks)).

**kindlescout - access mode: Fallback, search-only. Confidence: Low.**
- `kdp.amazon.com` help pages and Kindle Ranker were unreachable, so the royalty bands, payment rules and category thresholds could **not** be verified from KDP this run. No BSR table, no category-competitiveness metrics, no `Category_Mix`.
- Third-party estimate (label: **estimated, third-party, capture date unknown**): the AsInsight March 2026 "coloring books for kids" report lists a JoyCat paint-with-water book at $9.99 near 10K monthly sales, but the top slots are crayons and marker sets, not books; its May 2026 "kids coloring book" report puts a Bluey water-reveal book ($4.79) first at ~7K ([AsInsight](https://www.asinsight.com/report/US/kids-coloring-book)). Typical top-seller prices run ~$5-$15. These are **not** state-themed print coloring books, so they say little about this niche.
- Print is the format: a coloring book is a KDP **paperback** product, not a Kindle ebook.
- No workbooks were built (nothing to put in them). I did not fake `Apple_vs_Kindle`; the comparison is the two bullets above.

## 3. Platforms (30-platform scan) - honest status
| Group | Platforms | Status |
|---|---|---|
| Print-on-demand | Amazon KDP, Lulu, Blurb, IngramSpark | Amazon only partly (third-party snippets). KDP royalty: a [third-party summary of KDP's June 2025 change](https://v13.net/2025/05/amazon-kdp-just-cut-your-royalties/) says paperbacks priced below roughly $9.99 moved from 60% to 50% royalty - **CHECK on KDP**; the cutoff differs between sources. Lulu/Blurb/IngramSpark: **not researched**. |
| Marketplaces / printables | Etsy, Creative Fabrica, Design Bundles, Creative Market, Teachers Pay Teachers, Gumroad, Payhip, Selar, others | **Not reached.** A search for state coloring printables returned mostly scraped mirror pages on unrelated domains (flagged unreliable), no sales data. |
| Ebook stores | Apple Books, Google Play, Kobo, B&N Press, Draft2Digital | Apple: see section 2. Others **not researched**. |
| Storefront builders | Shopify, Stan Store, Ko-fi, Sellfy, Podia, Lemon Squeezy, Whop, Big Cartel, Squarespace, Patreon, Kajabi, Envato, Paystack | **Not researched** (poor fit for a print coloring book; direct-sale option only). |

**Competing products actually found (state-level):** *Doodles Volunteer State Coloring Fun* (Setria James; 35 images with Tennessee facts; [LitPick review, 4 stars](https://litpick.com/node/23848)); Dover's *United States Coloring Book* (all 50 states, ages 3-8; [listing](https://shop.mtwyouth.org/products/united-states-coloring-book-dover-history-coloring-book-9780486401683-new)); *The United States Activity and Fact Book* (two pages per state; [listing](https://shop.bookvault.app/product/the-united-states-activity-and-fact-book/)); Montpelier's *America State by State* ($15.99, perforated pages; [listing](https://shop.montpelier.org/products/america-state-by-state-book)). I found no town-by-town Tennessee coloring book with a recurring character - a **possible** gap, **not verified** on Amazon.

## 4. Review themes (limited - far short of 90 sources)
Sources reached: a Walmart-hosted 1-star review, vendor/buyer guides, a LitPick review. Counts are **not** meaningful (a handful of items), so none are given.
- **Bleed-through / one-sided:** a 1-star review of a coloring book says colors soak through the thin paper and ruin the back image ([Walmart listing](https://www.walmart.com/ip/53295239)); vendor guides advise one design per page with a blank back because bleed-through is a common review complaint ([KDPBuilder](https://kdpbuilder.com/blog/how-to-make-a-coloring-book-with-ai)). Guides put cheap coloring paper at about 55-70 GSM and recommend 100+ for marker use ([Lazada guide](https://stationery.lazada.com.ph/best-coloring-book-sets-for-kids-by-age-group-a-complete-guide-20260805/)).
- **Duplicated / copied art:** same Walmart review - "This is a copy of 3 other books!"
- **Facts too dry / art too simple for the age:** the 11-year-old LitPick reviewer found the Tennessee pictures "beautiful but simple" and doubted 5-8-year-olds would enjoy the facts ([LitPick](https://litpick.com/node/23848)). *(Paraphrase of the review's gist, not a quote.)*
- **AI-art consistency problems:** vendors of AI-coloring tools say line weight drifts and characters change between pages ([Rangy](https://rangy.ai/blog/ai-coloring-pages)). **Seller claim, not customer feedback.** I found no buyer review tying AI art to low ratings.
- **Unmet wants / praise:** not established from reachable sources.

## 5. Candidate scoring (1-5; weights 25/25/15/15/10/10)
Evidence labels: nearly every score is **inferred** (no chart data). "Demand" is lowered accordingly.
| Concept | Demand | Review gap | Competition | Pay | Produce | Market | Pass 1 | Skeptic pass |
|---|---|---|---|---|---|---|---|---|
| A. Scout Explores Tennessee (20 towns) | 3 | 4 | 4 | 3 | 4 | 4 | **3.60** | 3.10 |
| C. Scout Explores the USA (50 states) | 4 | 4 | 2 | 3 | 2 | 4 | 3.35 | 3.10 |
| E. Tennessee music edition | 3 | 3 | 4 | 3 | 4 | 4 | 3.35 | 3.10 |
| B. Tennessee symbols & landmarks | 3 | 3 | 3 | 3 | 5 | 3 | 3.20 | - |
| F. Three-regions travel activity book | 2 | 3 | 4 | 3 | 4 | 3 | 3.00 | - |
| D. Smoky Mountains nature | 3 | 2 | 3 | 3 | 4 | 3 | 2.85 | - |

*Math:* A = .25x3 + .25x4 + .15x4 + .15x3 + .10x4 + .10x4 = 3.60. **Self-consistency:** re-scoring skeptically (demand 3->2, review gap 4->3 for A) leaves A, C and E tied at 3.10, so the data does **not** separate them. The tie-break is not data: it is your brief, series continuity with the Nigeria edition, and producibility (C needs 50 consistent pages). Neither scout scored any concept (no Opportunities sheet exists), so there is no scout cross-check to reconcile.

## 6. Top 3
1. **Scout Explores Tennessee** - *A Tennessee Coloring Book for Kids: Cities, Towns & Fun Facts from Across the Volunteer State (Ages 6-9)*. 24 art pages (Welcome, Flag, 20 towns, family page, goodbye) + front matter; single-sided with blank backs, ~56 printed pages. Fixes: bleed-through (blank backs), duplicate-art distrust (every page unique and place-specific), art-consistency (one character reference), dry facts (one short fun fact per page). *Channel:* Amazon KDP paperback (**CHECK** categories/thresholds - not verified); Apple Books not recommended.
2. **Scout Explores the USA** - series extension; heavier to produce.
3. **Tennessee music edition** - same character, music-city theme.

## 7. Decision
Build #1. #2 and #3 stay as briefs. Pricing, categories and royalties are deferred to prica and the KDP sheet and will be marked **CHECK**.
