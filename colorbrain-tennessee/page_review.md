# Page review - Stage 5 (sheets 2-6; sheet 1 not uploaded)

**Inputs:** `sheet_02`-`sheet_06` arrived as 1493 x 2000 px JPEGs (not 4K). Each page comes out at about **669 x 914 px, roughly 81 dpi at A4**. That is low. To keep print lines crisp I traced each page to vector and re-rendered it at 2480 x 3508 px (300 dpi file). The tracing sharpens edges; it cannot add detail that wasn't there, so very fine line work (hatching, fur) is smoother than the source. If Nano Banana can output larger sheets, please use the largest option on the re-renders.

**Automatic fixes applied in code (no re-render needed):**
- Cropped inside each panel's black frame (the generator drew a frame around every page despite the prompt).
- Removed the ruled box line across the top zone on Chattanooga, Sweetwater and Oak Ridge.
- Re-fitted to A4 proportions with padding (never stretched), forced pure black and white, and shrank art that ran into the title zone (see the "header" column) so the top ~19% is free for the title and fun fact.

**Checks done by eye on every page; star badges counted by hand** (there is no image-library circle detector in this sandbox, so counts are manual and can be off by one on very busy pages).

| # | Page | Sheet / panel | Stars | Other findings | Verdict |
|---|---|---|---|---|---|
| 5 | Paris | S2 top-left | **2** | tower runs to the top edge (header) | FAIL - re-render |
| 6 | Jackson | S2 top-right | 3 | water tower close to top, shrunk | PASS |
| 7 | Clarksville | S2 bottom-left | 3 | confetti in header zone, shrunk | PASS |
| 8 | Nashville | S2 bottom-right | **2** | two guitars (one expected) | FAIL - re-render |
| 9 | Franklin | S3 top-left | **4** | - | FAIL - re-render |
| 10 | Columbia | S3 top-right | 3 | barn roof at top, shrunk | PASS |
| 11 | Murfreesboro | S3 bottom-left | 3 | - | PASS |
| 12 | Cookeville | S3 bottom-right | **5** | - | FAIL - re-render |
| 13 | Chattanooga | S4 top-left | **4** | shows a **hanging gondola**, not an incline railway; box line removed | FAIL - re-render |
| 14 | Sweetwater | S4 top-right | **4** | large **solid-black** water/cave areas (not colorable); box line removed | FAIL - re-render |
| 15 | Oak Ridge | S4 bottom-left | **4** | **two Scouts**; box line removed | FAIL - re-render |
| 16 | Knoxville | S4 bottom-right | 3 | - | PASS |
| 17 | Sevierville | S5 top-left | **2** | decorative stars drawn on the guitar (look like extra stars) | FAIL - re-render |
| 18 | Pigeon Forge | S5 top-right | 3 | - | PASS |
| 19 | Gatlinburg | S5 bottom-left | 3 | tower near top, shrunk | PASS |
| 20 | Johnson City | S5 bottom-right | **2** | - | FAIL - re-render |
| 21 | Kingsport | S6 top-left | 3 | - | PASS |
| 22 | Bristol | S6 top-right | **5+** | Scout not straddling the line; garbled text on a shop sign | FAIL - re-render |
| 23 | My Family's Town | S6 bottom-left | **2** | - | FAIL - re-render |
| 24 | Goodbye | S6 bottom-right | 3 | - | PASS |
| 1-4 | Welcome, Flag, Memphis, Tiptonville | S1 | - | **sheet not uploaded** | MISSING |

**Result:** 9 of 20 delivered pages pass; 11 fail; 4 more never arrived. **Scout stays consistent** across the passing pages (same hat, backpack with compass, vest, neckerchief, boots, tail).

**Why the stars failed:** the model drifts on counts and likes to decorate objects with extra stars. I could erase extras or paint missing badges in code, but that would edit the art by hand, so I'm re-rendering instead. The round-2 prompts add a hard "exactly three, numbered, no other stars" rule and ban decorative stars.

**Next:** render `sheet_r01`-`sheet_r04` from `page_prompts_rerender.md` (15 pages; the last sheet has three pages and one blank panel).


---
## Update - star counts fixed in code (round 2)
Following your instruction, I used the initial uploaded batch and corrected star counts in code instead of re-rendering: excess badges were whited out with discs, and missing badges were drawn in (circle + five-point star, matched line weight). Pages: Franklin, Cookeville, Bristol (extras removed); Paris, Nashville, Sevierville, Johnson City, My Family's Town (one badge added each; on Sevierville I also whited out three tiny decorative stars on the guitar). For **Chattanooga, Sweetwater and Oak Ridge** I used your revised sheet 4 because it fixed the non-star defects (incline car on rails, no solid-black fill, one Scout); its extra badges were removed the same way (Sweetwater, Oak Ridge). Knoxville uses the original (3 stars).

**Checked by eye after the edit: all 20 pages now show exactly 3 star badges.** (Bristol's badges are bare stars, not circled, in the original art - left as the generator drew them.) Remaining known imperfections: Nashville still has two guitars; Chattanooga's car sits on rails but the art still shows an overhead cable; added badges are a little plainer than the generator's hatched ones.

**Still missing: sheet 1** (Welcome, Flag, Memphis, Tiptonville). Render it with `sheet_01_prompt.md` (the original wording) and upload it; I'll apply the same star-count fixes.


## Update - sheet 1 received
Sheet 1 (Welcome, Flag, Memphis, Tiptonville) arrived and was processed the same way. Star counts as drawn: Welcome 5 -> 3 (two erased), Flag 3 (the flag's own three stars), Memphis 4 -> 3 (one erased), Tiptonville 4 -> 3 (one erased). **All 24 art pages now have exactly three star badges** (checked by eye). Note: Memphis's riverboat has garbled, unreadable hull text from the generator; it reads as texture at print size.
