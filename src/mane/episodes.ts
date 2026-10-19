// Week of 19 Oct 2026. Scene starts (t) and hit times come from the delivered voiceovers' word timings.
import type {EpisodeData, Scene} from './Episode';

const BRAND_OBJ = {x: 230, y: 1440, s: 0.65};
const brand = (t: number, chips: Scene['chips'], obj: Scene['obj'], kicker?: string): Scene => ({
  t,
  layout: 'brand',
  kicker,
  chips,
  avatar: {pose: 'present', side: 'right'},
  obj,
  sfx: [[0.3, 'swap'], ...(chips ?? []).map((c) => [c.at ?? 1, 'pop'] as [number, 'pop'])].slice(0, 3) as Scene['sfx'],
});
const action = (t: number, sub: string, obj: Scene['obj']): Scene => ({
  t,
  layout: 'action',
  sub,
  avatar: {pose: 'thumbs', side: 'right'},
  obj,
  sfx: [
    [0, 'stamp'],
    [0.4, 'chime'],
  ],
});

export const MON: EpisodeData = {
  id: 'Mon-PostHarvest',
  vo: 'mon.wav',
  dur: 73.45,
  object: 'crate',
  objSize: 420,
  tint: {color: '#E9E2E9', op: 0.85},
  scenes: [
    {t: 0, layout: 'hook', kicker: 'NIGERIA · 2025', num: {pre: '₦', to: 3.5, dec: 1, tail: '–5TN', at: 0.05}, headSize: 210, label: 'OF FOOD LOST AFTER HARVEST', obj: {x: 540, y: 1250, s: 1.1}, sfx: [[0, 'whoosh'], [1.0, 'stamp']]},
    {t: 8.5, layout: 'headline', head: 'NEVER REACHED\nA *PLATE*', headSize: 140, icons: [{k: 'plate', x: 680, y: 1090, s: 260, at: 2.6}], obj: {x: 300, y: 1260, s: 1.0, state: 'tilt'}, sfx: [[0, 'whoosh'], [2.6, 'pop']]},
    {t: 13.2, layout: 'block', kicker: '10-YEAR PROGRAMME', num: {pre: '$', to: 3.5, dec: 1, suf: 'BN', at: 1.6}, label: 'Postharvest Systems Transformation Programme', icons: [{k: 'calendar', x: 100, y: 850, s: 220, at: 0.8}], obj: {x: 790, y: 1310, s: 0.85}, sfx: [[0, 'whoosh'], [1.6, 'tick'], [0.8, 'pop']]},
    {t: 20.2, layout: 'headline', kicker: 'THE PLAN', head: 'SOLAR COLD ROOMS:\nSTILL A *PLAN*', headSize: 104, icons: [{k: 'cold', x: 90, y: 940, s: 240, at: 1.0}, {k: 'doc', x: 370, y: 980, s: 200, at: 4.9}], obj: {x: 800, y: 1290, s: 0.95, state: 'cold'}, sfx: [[0, 'whoosh'], [1.0, 'pop'], [4.9, 'pop']]},
    {t: 27.4, layout: 'headline', head: 'IF IT\n*WORKS?*', headSize: 180, icons: [{k: 'bulb', x: 700, y: 400, s: 250, at: 0.5}], obj: {x: 540, y: 1230, s: 1.15}, sfx: [[0, 'whoosh'], [0.5, 'pop']]},
    {t: 30.4, layout: 'block', kicker: 'A 40–50% CUT IN LOSSES', num: {pre: '₦', to: 1.4, dec: 1, tail: '–2.5TN', at: 5.2}, label: 'of food kept in the market each year', icons: [{k: 'bars', x: 100, y: 850, s: 220, at: 5.4}], obj: {x: 810, y: 1330, s: 0.85, level: 1, la: 5.2, ld: 1.2}, sfx: [[0, 'whoosh'], [5.2, 'tick'], [6.1, 'stamp']]},
    {t: 42.6, layout: 'split', kicker: 'INDUSTRY ESTIMATE · NEEDED', split: [{num: {to: 5000, comma: true, at: 2.9}, label: 'cold trucks', icon: 'truck'}, {num: {to: 100, at: 5.4}, label: 'cold rooms of 500 tonnes', icon: 'cold'}], obj: {x: 540, y: 1290, s: 0.85, level: 0}, sfx: [[0, 'whoosh'], [2.7, 'pop'], [5.2, 'pop']]},
    {t: 50.2, layout: 'headline', kicker: 'INDUSTRY GROUPS SAY', head: "BANKS DON'T GET\nTHE *COLD CHAIN*", headSize: 108, icons: [{k: 'bank', x: 100, y: 900, s: 240, at: 1.8}], obj: {x: 800, y: 1290, s: 0.95, state: 'shake'}, sfx: [[0, 'whoosh'], [1.8, 'pop']]},
    {t: 55.8, layout: 'headline', head: 'PLAN FIRST.\n*FUNDING* SECOND.', headSize: 124, icons: [{k: 'doc', x: 720, y: 930, s: 250, at: 0.6}], obj: {x: 300, y: 1300, s: 0.95}, sfx: [[0, 'whoosh'], [1.8, 'stamp']]},
    brand(60.4, [{text: 'BUSINESS PLANS', icon: 'doc', at: 2.2}, {text: 'FINANCIAL PROJECTIONS', icon: 'bars', at: 3.4}, {text: 'MARKET RESEARCH', icon: 'magnifier', at: 4.9}], BRAND_OBJ),
    action(70.0, 'For a business plan a lender can read', BRAND_OBJ),
  ],
};

export const TUE: EpisodeData = {
  id: 'Tue-MembershipCard',
  vo: 'tue.wav',
  dur: 63.09,
  object: 'card',
  objSize: 420,
  tint: {color: '#F2E8F2', op: 0.75},
  scenes: [
    {t: 0, layout: 'hook', kicker: 'COSTCO · MEMBERSHIP FEES', num: {pre: '~', to: 50, suf: '%', at: 0.05}, label: "of Costco's operating profit comes from a card", obj: {x: 540, y: 1250, s: 1.1, state: 'flip'}, sfx: [[0, 'whoosh'], [1.0, 'stamp']]},
    {t: 5.3, layout: 'name', head: 'CHIKE', tag: 'FICTIONAL FOUNDER · LAGOS', icons: [{k: 'shop', x: 730, y: 330, s: 250, at: 2.0}], obj: {x: 760, y: 1270, s: 1.0}, sfx: [[0, 'whoosh'], [2.0, 'pop']]},
    {t: 11.1, layout: 'chips', head: 'SOLD AT\n*COST PRICE*', headSize: 112, chips: [{text: 'Rice', at: 1.0}, {text: 'Oil', at: 2.0}, {text: 'Detergent', at: 3.0}], icons: [{k: 'coin', x: 740, y: 700, s: 220, at: 3.7}], obj: {x: 540, y: 1330, s: 0.95}, sfx: [[0, 'whoosh'], [1.0, 'pop'], [3.0, 'pop']]},
    {t: 19.1, layout: 'headline', head: 'WHERE DOES\nCHIKE *EARN?*', headSize: 124, avatar: {pose: 'think_up', side: 'left'}, obj: {x: 790, y: 1260, s: 1.05, state: 'spin'}, sfx: [[0, 'whoosh'], [0.2, 'swap']]},
    {
      t: 21.3,
      layout: 'equation',
      kicker: 'THE MEMBERSHIP MATH',
      cells: [
        {num: {pre: '₦', to: 50000, comma: true, at: 3.0}, label: 'annual fee'},
        {num: {to: 20000, comma: true, at: 4.9}, label: 'members'},
        {num: {pre: '₦', to: 1, suf: 'BN', at: 6.9}, label: 'a year'},
      ],
      tag: 'FICTIONAL FIGURES FOR THE STORY',
      icons: [{k: 'people', x: 90, y: 1170, s: 220, at: 5.0}],
      obj: {x: 820, y: 1340, s: 0.85, state: 'stack'},
      sfx: [[0, 'whoosh'], [3.0, 'tick'], [7.0, 'stamp']],
    },
    {t: 36.2, layout: 'block', align: 'right', outline: true, kicker: 'COSTCO · US & CANADA', num: {to: 90, suf: '%+', at: 1.8}, label: 'of members renew', icons: [{k: 'shield', x: 760, y: 850, s: 220, at: 5.0}], obj: {x: 290, y: 1300, s: 0.95, state: 'renew'}, sfx: [[0, 'whoosh'], [1.8, 'tick'], [5.0, 'pop']]},
    {t: 43.7, layout: 'headline', head: 'MORE MEMBERS,\nLOWER *PRICES*', headSize: 112, icons: [{k: 'people', x: 90, y: 760, s: 220, at: 0.3}, {k: 'bars', x: 360, y: 760, s: 220, at: 2.0}], obj: {x: 790, y: 1270, s: 1.0}, sfx: [[0, 'whoosh'], [0.3, 'pop'], [2.0, 'pop']]},
    {t: 49.0, layout: 'headline', head: 'PROVE THE\nMEMBER *NUMBERS*', headSize: 112, avatar: {pose: 'think_clip', side: 'right'}, icons: [{k: 'doc', x: 90, y: 780, s: 210, at: 1.2}], obj: {x: 280, y: 1340, s: 0.9}, sfx: [[0, 'whoosh'], [0.2, 'swap'], [2.4, 'stamp']]},
    brand(53.1, [{text: 'BUSINESS PLAN', icon: 'doc', at: 2.0}, {text: 'FINANCIAL PROJECTIONS', icon: 'bars', at: 3.0}], BRAND_OBJ),
    action(61.0, 'To start yours', BRAND_OBJ),
  ],
};

export const WED: EpisodeData = {
  id: 'Wed-TwoFunds',
  vo: 'wed.wav',
  dur: 57.29,
  object: 'key',
  objSize: 420,
  tint: {color: '#DCD8DE', op: 0.8},
  scenes: [
    {t: 0, layout: 'hook', kicker: 'OPEN TO NIGERIAN BUSINESSES', num: {pre: '$', to: 250, suf: 'M', at: 0.05}, label: 'across two funds', obj: {x: 540, y: 1240, s: 1.1, state: 'spin'}, sfx: [[0, 'whoosh'], [1.0, 'stamp']]},
    {t: 6.1, layout: 'block', kicker: 'NACCIMA', num: {pre: '$', to: 150, suf: 'M', at: 0.9}, label: 'fund for business expansion', icons: [{k: 'factory', x: 100, y: 850, s: 220, at: 3.4}], obj: {x: 800, y: 1310, s: 0.9}, sfx: [[0, 'whoosh'], [0.9, 'tick'], [3.4, 'pop']]},
    {t: 12.0, layout: 'block', align: 'right', outline: true, kicker: 'NCDMB + BANK OF INDUSTRY', num: {pre: '$', to: 100, suf: 'M', at: 0.8}, label: 'equity for local oil & gas firms', icons: [{k: 'gear', x: 760, y: 850, s: 220, at: 3.5}], obj: {x: 290, y: 1310, s: 0.9}, sfx: [[0, 'whoosh'], [0.8, 'tick'], [3.5, 'pop']]},
    {t: 20.9, layout: 'headline', head: 'WHO GETS\n*IN?*', headSize: 180, icons: [{k: 'door', x: 700, y: 1030, s: 260, at: 0.3}], obj: {x: 400, y: 1270, s: 1.0}, sfx: [[0, 'whoosh'], [0.3, 'pop']]},
    {t: 23.1, layout: 'headline', kicker: 'SMEDAN SAYS', head: 'FUNDS EXIST.\n*STRUCTURE* IS\nMISSING.', headSize: 112, icons: [{k: 'magnifier', x: 90, y: 1000, s: 240, at: 1.0}], obj: {x: 770, y: 1280, s: 1.0, state: 'shake'}, sfx: [[0, 'whoosh'], [1.0, 'pop']]},
    {t: 30.4, layout: 'block', align: 'right', kicker: 'ZEDVANCE', num: {pre: '₦', to: 1, suf: 'TN', at: 2.4}, label: 'SME lending target', icons: [{k: 'coin', x: 100, y: 850, s: 220, at: 2.8}], obj: {x: 790, y: 1310, s: 0.9}, sfx: [[0, 'whoosh'], [2.4, 'tick'], [2.8, 'pop']]},
    {t: 36.6, layout: 'headline', kicker: 'WHAT FUNDS READ', head: 'A WRITTEN\nCASE *FIRST*', headSize: 136, icons: [{k: 'doc', x: 720, y: 880, s: 250, at: 3.8}], obj: {x: 300, y: 1290, s: 0.95}, sfx: [[0, 'whoosh'], [3.8, 'pop'], [5.0, 'stamp']]},
    {t: 43.5, layout: 'headline', head: 'DOCUMENTS\nTURN THE *KEY*', headSize: 136, icons: [{k: 'door', x: 80, y: 880, s: 220, at: 1.4}], obj: {x: 580, y: 1230, s: 1.25, state: 'turn'}, sfx: [[0, 'whoosh'], [1.2, 'swap'], [1.6, 'pop']]},
    brand(47.6, [{text: 'PROPOSALS', icon: 'doc', at: 1.9}, {text: 'PITCH DECKS', icon: 'bars', at: 3.0}, {text: 'COMPANY PROFILES', icon: 'shield', at: 3.8}], BRAND_OBJ),
    action(55.1, 'To get yours ready', BRAND_OBJ),
  ],
};

export const THU: EpisodeData = {
  id: 'Thu-ColdTrucks',
  vo: 'thu.wav',
  dur: 71.0, // voiceover ends at 68.3; the DM US card holds 2.7s after it (the closing line was not recorded)
  object: 'thermo',
  objSize: 420,
  tint: {color: '#E2DCE8', op: 0.75},
  firstLevel: 0.9,
  scenes: [
    {t: 0, layout: 'hook', kicker: 'NIGERIA · COLD CHAIN', num: {pre: '<', to: 1000, comma: true, at: 0.05}, headSize: 220, label: 'cold trucks on the road', sub: 'It needs about 25,000', subAt: 4.8, obj: {x: 540, y: 1330, s: 1.0, level: 0.15, la: 0.6, ld: 3}, sfx: [[0, 'whoosh'], [1.0, 'stamp'], [4.8, 'pop']]},
    {t: 7.4, layout: 'name', head: 'BIMBO', tag: 'FICTIONAL FOUNDER · COLD HAUL', icons: [{k: 'truck', x: 740, y: 300, s: 240, at: 3.6}], obj: {x: 300, y: 1300, s: 0.95, level: 0.3}, sfx: [[0, 'whoosh'], [3.6, 'pop']]},
    {t: 13.3, layout: 'chips', head: 'STARTS WITH\n*3* COLD TRUCKS', headSize: 112, chips: [{text: 'Tomatoes', at: 4.6}, {text: 'Fish', at: 5.6}, {text: 'Dairy', icon: 'cold', at: 6.4, hot: true}], icons: [{k: 'truck', x: 720, y: 640, s: 230, at: 0.8}], obj: {x: 800, y: 1330, s: 0.9, level: 0.3}, sfx: [[0, 'whoosh'], [0.8, 'pop'], [6.4, 'pop']]},
    {t: 21.9, layout: 'headline', head: 'WHAT COULD\n*60 TRUCKS*\nEARN?', headSize: 124, avatar: {pose: 'think_up', side: 'left'}, obj: {x: 790, y: 1300, s: 1.0, level: 0.5, la: 0.3, ld: 1.4}, sfx: [[0, 'whoosh'], [0.2, 'swap']]},
    {
      t: 24.5,
      layout: 'equation',
      kicker: 'FLEET MATH · A MONTH',
      cells: [
        {num: {to: 20, at: 1.9}, label: 'trips per truck'},
        {num: {pre: '₦', to: 150000, comma: true, at: 3.6}, label: 'per trip'},
        {num: {to: 60, at: 6.5}, label: 'trucks'},
        {num: {pre: '₦', to: 180, suf: 'M', at: 8.6}, label: 'a month'},
      ],
      tag: 'FICTIONAL FIGURES FOR THE STORY',
      obj: {x: 830, y: 1400, s: 0.75, level: 0.9, la: 8.6, ld: 1.2},
      sfx: [[0, 'whoosh'], [1.9, 'tick'], [8.8, 'stamp']],
    },
    {t: 38.8, layout: 'block', kicker: 'WHY FARMERS PAY · INDUSTRY GROUPS', num: {pre: '₦', to: 3.5, dec: 1, tail: '–5TN', at: 7.2}, label: 'post-harvest losses in 2025', icons: [{k: 'plate', x: 90, y: 850, s: 230, at: 1.0}], obj: {x: 800, y: 1330, s: 0.9, level: 0.2, la: 7.2, ld: 1.2}, sfx: [[0, 'whoosh'], [1.0, 'pop'], [7.2, 'tick']]},
    {t: 49.8, layout: 'headline', head: "BIMBO'S PROBLEM:\n*MONEY*", headSize: 124, sub: "Industry groups say banks often don't understand the cold chain", subAt: 2.7, icons: [{k: 'bank', x: 90, y: 960, s: 230, at: 2.9}], obj: {x: 790, y: 1330, s: 0.95, level: 0.2}, sfx: [[0, 'whoosh'], [2.9, 'pop']]},
    {t: 57.1, layout: 'headline', head: 'TRUCKS NEED FUNDING.\nFUNDING NEEDS\n*PROOF*.', headSize: 104, icons: [{k: 'doc', x: 720, y: 900, s: 250, at: 2.2}], obj: {x: 300, y: 1310, s: 0.95, level: 0.6, la: 3.4, ld: 1}, sfx: [[0, 'whoosh'], [3.4, 'stamp']]},
    brand(61.4, [{text: 'BUSINESS PLAN', icon: 'doc', at: 2.2}, {text: 'MARKET RESEARCH', icon: 'magnifier', at: 3.4}], {...BRAND_OBJ, level: 0.6}, 'SHOW A LENDER THE GAP'),
    action(68.3, 'To start yours', {...BRAND_OBJ, level: 0.6}),
  ],
};

export const FRI: EpisodeData = {
  id: 'Fri-OneBakery',
  vo: 'fri.wav',
  dur: 68.49,
  object: 'loaf',
  objSize: 420,
  tint: {color: '#E6D7E6', op: 0.7},
  scenes: [
    {t: 0, layout: 'hook', kicker: 'SMEDAN · EXPANSION LOANS', num: {to: 9, tail: '–9.5%', at: 0.05}, label: 'interest on loans for expansion, equipment and working capital', obj: {x: 540, y: 1270, s: 1.05}, sfx: [[0, 'whoosh'], [1.0, 'stamp']]},
    {t: 9.5, layout: 'headline', kicker: 'SMEDAN ALSO SAYS', head: 'MANY LACK THE\n*STRUCTURE*\nTO QUALIFY', headSize: 112, icons: [{k: 'magnifier', x: 90, y: 1000, s: 230, at: 3.4}], obj: {x: 790, y: 1290, s: 0.95, state: 'wobble'}, sfx: [[0, 'whoosh'], [3.4, 'swap']]},
    {t: 15.4, layout: 'name', head: 'KUNLE', tag: 'FICTIONAL BAKER · IBADAN', num: {to: 400, at: 4.8}, label: 'loaves a day, one shop', icons: [{k: 'shop', x: 730, y: 330, s: 250, at: 3.8}], obj: {x: 290, y: 1320, s: 1.0}, sfx: [[0, 'whoosh'], [3.8, 'pop'], [4.8, 'tick']]},
    {t: 22.7, layout: 'chips', kicker: 'THE SYSTEM', head: 'EVERY STEP\n*WRITTEN* DOWN', headSize: 104, chips: [{text: 'Flour order', icon: 'truck', at: 3.0}, {text: 'Shelf', icon: 'shop', at: 4.2}, {text: 'Outlet 2 copies outlet 1', icon: 'doc', at: 5.4, hot: true}], obj: {x: 810, y: 1330, s: 0.9, state: 'copy'}, sfx: [[0, 'whoosh'], [3.0, 'pop'], [5.4, 'pop']]},
    {t: 31.1, layout: 'grid', head: 'TWELVE\n*OUTLETS?*', headSize: 120, grid: {n: 12, icon: 'shop', cols: 4, at: 0.6, step: 0.08}, obj: {x: 830, y: 1390, s: 0.8, state: 'pulse'}, sfx: [[0, 'whoosh'], [0.6, 'pop']]},
    {
      t: 34.3,
      layout: 'equation',
      kicker: 'TWELVE OUTLETS, ONE DAY',
      cells: [
        {num: {to: 4800, comma: true, at: 0.3}, label: 'loaves'},
        {num: {pre: '₦', to: 1200, comma: true, at: 3.4}, label: 'each'},
        {num: {pre: '₦', to: 5.76, dec: 2, suf: 'M', at: 5.6}, label: 'a day'},
      ],
      tag: 'FICTIONAL FIGURES FOR THE STORY',
      icons: [{k: 'coin', x: 90, y: 1160, s: 220, at: 3.5}],
      obj: {x: 820, y: 1340, s: 0.85},
      sfx: [[0, 'whoosh'], [3.4, 'tick'], [5.8, 'stamp']],
    },
    {t: 46.9, layout: 'headline', head: 'A LENDER SEES\nWHAT ITS MONEY\n*BUYS*', headSize: 108, icons: [{k: 'gear', x: 90, y: 820, s: 230, at: 0.5}, {k: 'doc', x: 370, y: 840, s: 210, at: 2.0}], obj: {x: 800, y: 1310, s: 0.95}, sfx: [[0, 'whoosh'], [0.5, 'pop'], [3.2, 'stamp']]},
    {t: 52.9, layout: 'headline', head: "LENDERS FUND\nWHAT'S ON\n*PAPER*", headSize: 120, avatar: {pose: 'think_clip', side: 'right'}, obj: {x: 280, y: 1330, s: 0.95}, sfx: [[0, 'whoosh'], [0.2, 'swap']]},
    brand(57.1, [{text: 'BUSINESS PLAN', icon: 'doc', at: 2.7}, {text: 'FINANCIAL PROJECTIONS', icon: 'bars', at: 3.9}], BRAND_OBJ),
    action(66.0, 'To start yours', BRAND_OBJ),
  ],
};

export const SAT: EpisodeData = {
  id: 'Sat-SeedMoney',
  vo: 'sat.wav',
  dur: 92.49,
  object: 'seed',
  objSize: 420,
  tint: {color: '#DCC8DC', op: 0.55},
  firstLevel: 0,
  scenes: [
    {t: 0, layout: 'hook', kicker: 'BAYELSA STATE · SME GRANTS', num: {pre: '₦', to: 126, suf: 'M', at: 0.05}, label: 'shared by 630 small businesses', obj: {x: 540, y: 1250, s: 1.1, level: 0}, sfx: [[0, 'whoosh'], [1.0, 'stamp']]},
    {t: 7.3, layout: 'block', kicker: '126,000,000 ÷ 630', num: {pre: '₦', to: 200000, comma: true, at: 0.6}, label: 'per business, on average', icons: [{k: 'coin', x: 100, y: 850, s: 220, at: 1.2}], obj: {x: 800, y: 1320, s: 0.9, level: 0}, sfx: [[0, 'whoosh'], [0.6, 'tick'], [1.2, 'pop']]},
    {t: 11.3, layout: 'name', head: 'GRACE', tag: 'SKILLED TAILOR · FICTIONAL STORY', icons: [{k: 'sewing', x: 730, y: 330, s: 250, at: 1.6}], obj: {x: 300, y: 1310, s: 1.0, level: 0}, sfx: [[0, 'whoosh'], [1.6, 'pop']]},
    {t: 15.2, layout: 'headline', kicker: 'HER PLAN', head: 'A PRODUCT LINE\nTHAT *FEEDS*\nITSELF', headSize: 112, icons: [{k: 'bulb', x: 90, y: 1000, s: 230, at: 2.6}], obj: {x: 780, y: 1300, s: 1.0, level: 1, la: 1.4, ld: 1.4}, sfx: [[0, 'whoosh'], [2.6, 'pop']]},
    {t: 20.1, layout: 'chips', kicker: 'MONTH ONE', chips: [{text: 'Fabric + accessories', icon: 'sewing', at: 1.4}, {text: '50 pieces sewn', icon: 'gear', at: 3.8}, {text: '₦12,000 each, online', icon: 'phone', at: 7.0, hot: true}], obj: {x: 790, y: 1330, s: 0.95, level: 1}, sfx: [[0, 'whoosh'], [1.4, 'pop'], [7.0, 'pop']]},
    {t: 29.7, layout: 'block', align: 'right', kicker: 'EACH SALE · STORY FIGURES', num: {pre: '₦', to: 8000, comma: true, at: 1.0}, label: 'profit, 2× her variable cost', icons: [{k: 'coin', x: 100, y: 850, s: 220, at: 1.2}], obj: {x: 800, y: 1330, s: 0.9, level: 1.6, la: 0.5, ld: 1}, sfx: [[0, 'whoosh'], [1.0, 'tick'], [3.6, 'pop']]},
    {t: 35.9, layout: 'chips', kicker: 'THE CYCLE', chips: [{text: 'Sell 20% a month', icon: 'bars', at: 0.8}, {text: 'Restock to 50', icon: 'sewing', at: 3.6}, {text: 'Repeat', icon: 'gear', at: 6.3, hot: true}], obj: {x: 790, y: 1330, s: 0.9, level: 1.6}, sfx: [[0, 'whoosh'], [0.8, 'pop'], [6.3, 'pop']]},
    {t: 43.0, layout: 'headline', head: 'PROFITS START\nNEW *LINES*', headSize: 120, icons: [{k: 'bars', x: 90, y: 780, s: 230, at: 0.6}], obj: {x: 780, y: 1300, s: 1.0, level: 2.2, la: 0.6, ld: 1.2}, sfx: [[0, 'whoosh'], [0.6, 'pop']]},
    {t: 48.1, layout: 'chips', kicker: 'NEW LINES', chips: [{text: 'Cargo shorts', icon: 'sewing', at: 3.4}, {text: '100 units each', icon: 'bars', at: 4.8, hot: true}, {text: 'Sold online', icon: 'phone', at: 6.6}], obj: {x: 790, y: 1330, s: 0.95, level: 2.4}, sfx: [[0, 'whoosh'], [3.4, 'pop'], [4.8, 'pop']]},
    {t: 57.4, layout: 'split', kicker: 'GROWTH', split: [{num: {pre: '₦', to: 100, suf: 'K', at: 0.9}, label: 'a month on ads', icon: 'phone'}, {num: {to: 3, at: 7.2}, label: 'states with boutique stockists', icon: 'pin'}], obj: {x: 540, y: 1300, s: 0.85, level: 2.8, la: 1, ld: 1.4}, sfx: [[0, 'whoosh'], [0.8, 'tick'], [7.2, 'pop']]},
    {t: 66.1, layout: 'grid', head: 'ONE MACHINE\nBECOMES *FIVE*', headSize: 104, grid: {n: 5, icon: 'sewing', cols: 5, at: 1.4, step: 0.22}, icons: [{k: 'factory', x: 90, y: 880, s: 220, at: 3.0}, {k: 'pin', x: 770, y: 880, s: 220, at: 6.4}], obj: {x: 540, y: 1330, s: 1.0, level: 3.4, la: 4.4, ld: 1.2}, sfx: [[0, 'whoosh'], [1.4, 'pop'], [4.5, 'pop']]},
    {t: 74.4, layout: 'headline', head: 'CONSISTENT PRODUCTS.\n*DIVERSIFIED*\nDISTRIBUTION.', headSize: 92, avatar: {pose: 'think_up', side: 'left'}, obj: {x: 800, y: 1320, s: 0.95, level: 4, la: 0.3, ld: 1.2}, sfx: [[0, 'whoosh'], [0.2, 'swap']]},
    {t: 81.5, layout: 'headline', head: 'SEED MONEY\nGROWS WITH A\n*WRITTEN* PLAN', headSize: 116, icons: [{k: 'doc', x: 90, y: 860, s: 230, at: 2.6}], obj: {x: 780, y: 1300, s: 1.0, level: 4}, sfx: [[0, 'whoosh'], [3.8, 'stamp']]},
    brand(85.6, [{text: 'BUSINESS PLAN', icon: 'doc', at: 2.2}], {...BRAND_OBJ, level: 4}, 'THE PLAN BEHIND THE SEED'),
    action(90.2, 'To start yours', {...BRAND_OBJ, level: 4}),
  ],
};

export const SUN: EpisodeData = {
  id: 'Sun-LeakingBucket',
  vo: 'sun.wav',
  dur: 65.49,
  object: 'bucket',
  objSize: 420,
  tint: {color: '#D8D8D8', op: 0.8},
  firstLevel: 1,
  scenes: [
    {t: 0, layout: 'hook', kicker: 'STUDY · NIGERIAN STOCK EXCHANGE', num: {to: 20, at: 0.05}, headSize: 220, label: 'listed companies studied for one main cause of failure', sub: 'Poor cash management', subAt: 7.4, obj: {x: 540, y: 1310, s: 1.0, state: 'drain', level: 0.15, la: 0.3, ld: 9}, sfx: [[0, 'whoosh'], [1.0, 'stamp'], [7.4, 'pop']]},
    {t: 10.3, layout: 'headline', kicker: 'THE COMMON THREAD', head: '*LIQUIDITY*:\nCASH ON HAND\nTO PAY BILLS', headSize: 112, icons: [{k: 'coin', x: 90, y: 1000, s: 230, at: 4.8}], obj: {x: 790, y: 1300, s: 0.95, level: 0.7, la: 0.3, ld: 1.2}, sfx: [[0, 'whoosh'], [3.5, 'pop'], [4.8, 'pop']]},
    {t: 19.8, layout: 'headline', head: 'SOLD WELL.\nSTILL *FAILED.*', headSize: 130, sub: 'Bills fall due before customers pay', subAt: 4.0, icons: [{k: 'clock', x: 760, y: 900, s: 220, at: 4.2}], obj: {x: 300, y: 1320, s: 0.95, state: 'leak', level: 0.3, la: 0.5, ld: 6}, sfx: [[0, 'whoosh'], [2.8, 'swap'], [4.2, 'pop']]},
    {t: 27.4, layout: 'headline', head: 'SEE IT\n*COMING?*', headSize: 176, icons: [{k: 'magnifier', x: 700, y: 980, s: 250, at: 0.6}], obj: {x: 360, y: 1280, s: 1.05, level: 0.3}, sfx: [[0, 'whoosh'], [0.6, 'pop']]},
    {t: 31.0, layout: 'table', kicker: 'CASH FLOW PROJECTION', head: 'MONEY IN.\nMONEY *OUT*.', table: {gapAt: 6.2}, obj: {x: 820, y: 1380, s: 0.8, level: 0.3}, sfx: [[0, 'whoosh'], [0.6, 'tick'], [6.2, 'stamp']]},
    {t: 42.2, layout: 'chips', kicker: 'STUDIES OF SMALL NIGERIAN FIRMS', chips: [{text: 'Poor management of resources', icon: 'gear', at: 3.6}, {text: 'Weak access to finance', icon: 'bank', at: 5.8}], obj: {x: 540, y: 1300, s: 0.95, state: 'wobble', level: 0.25}, sfx: [[0, 'whoosh'], [3.6, 'pop'], [5.8, 'pop']]},
    {t: 50.4, layout: 'headline', head: 'FIND THE\n*LEAK* EARLY', headSize: 156, obj: {x: 540, y: 1250, s: 1.15, state: 'patch', level: 0.6, la: 1.4, ld: 1}, sfx: [[0, 'whoosh'], [1.2, 'stamp']]},
    brand(55.3, [{text: 'FINANCIAL PROJECTIONS', icon: 'bars', at: 2.3}, {text: 'BUSINESS PLANS', icon: 'doc', at: 4.1}], {...BRAND_OBJ, state: 'fixed', level: 0.6}, 'WHAT WE BUILD'),
    action(63.5, 'For your cash flow projection', {...BRAND_OBJ, state: 'fixed', level: 0.6}),
  ],
};

export const EPISODES = [MON, TUE, WED, THU, FRI, SAT, SUN];
