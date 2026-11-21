import type {IconKey} from './icons';

export type Venture = {name: string; kind: string; icon: IconKey};
export type Line = {text: string; from: number; to: number}; // seconds inside the scene
export type Stage = {
  name: string;
  short: string;
  icon: IconKey;
  seconds: number;
  ventures: Venture[];
  delays: number[]; // when each venture card lands (s), matched to the caption lines
  lines: Line[];
};

// 13 ventures. NOTE: the brief lists "palm kernel nut trading" (CPO) and "palm kernel trading" (PKO);
// they are treated as ONE venture, placed under CPO, to reach the stated 13.
export const STAGES: Stage[] = [
  {
    name: 'Inputs', short: 'INPUTS', icon: 'nursery', seconds: 9,
    ventures: [
      {name: 'Nursery', kind: 'SEEDLINGS', icon: 'nursery'},
      {name: 'Input supply', kind: 'SUPPLY', icon: 'inputs'},
      {name: 'Machine fabrication', kind: 'MANUFACTURING', icon: 'machine'},
    ],
    delays: [2.8, 4.3, 5.9],
    lines: [
      {text: 'It starts with inputs.', from: 0.4, to: 2.5},
      {text: 'Run a nursery, supply inputs,', from: 2.8, to: 5.6},
      {text: 'or fabricate the machines.', from: 5.9, to: 8.4},
    ],
  },
  {
    name: 'Cultivation', short: 'CULTIVATION', icon: 'harvest', seconds: 8,
    ventures: [
      {name: 'Estate management', kind: 'SERVICE', icon: 'estate'},
      {name: 'Harvesting services', kind: 'SERVICE', icon: 'harvest'},
    ],
    delays: [2.8, 5.4],
    lines: [
      {text: 'Then comes cultivation.', from: 0.4, to: 2.5},
      {text: 'Manage estates for owners,', from: 2.8, to: 5.2},
      {text: 'or offer harvesting services.', from: 5.4, to: 7.6},
    ],
  },
  {
    name: 'FFB processing', short: 'FFB', icon: 'thresh', seconds: 8,
    ventures: [
      {name: 'Threshing service', kind: 'SERVICE', icon: 'thresh'},
      {name: 'FFB aggregation', kind: 'AGGREGATION', icon: 'ffb'},
    ],
    delays: [2.8, 5.4],
    lines: [
      {text: 'Fresh fruit bunches need processing.', from: 0.4, to: 2.6},
      {text: 'Offer threshing as a service,', from: 2.8, to: 5.2},
      {text: 'or aggregate FFB for mills.', from: 5.4, to: 7.6},
    ],
  },
  {
    name: 'CPO production', short: 'CPO', icon: 'cpo', seconds: 9,
    ventures: [
      {name: 'Milling service', kind: 'SERVICE', icon: 'mill'},
      {name: 'CPO trading', kind: 'TRADING', icon: 'cpo'},
      {name: 'Palm kernel nut trading', kind: 'TRADING', icon: 'nut'},
    ],
    delays: [2.8, 4.3, 5.9],
    lines: [
      {text: 'At the mill, crude palm oil is made.', from: 0.4, to: 2.6},
      {text: 'Mill for others, trade CPO,', from: 2.8, to: 5.6},
      {text: 'or trade palm kernel nuts.', from: 5.9, to: 8.4},
    ],
  },
  {
    name: 'PKO production', short: 'PKO', icon: 'nut', seconds: 9,
    ventures: [
      {name: 'Cracking & separating', kind: 'SERVICE', icon: 'crack'},
      {name: 'PKS biomass trading', kind: 'TRADING', icon: 'biomass'},
      {name: 'PKC trading', kind: 'TRADING', icon: 'cake'},
    ],
    delays: [2.8, 4.3, 5.9],
    lines: [
      {text: 'Then the kernel opens up more.', from: 0.4, to: 2.6},
      {text: 'Crack it, trade PKS biomass,', from: 2.8, to: 5.6},
      {text: 'or trade palm kernel cake.', from: 5.9, to: 8.4},
    ],
  },
];

export const HOOK_SECONDS = 6;
export const OUTRO_SECONDS = 7;
export const HOOK_LINES: Line[] = [
  {text: 'Oil palm is not one business.', from: 0.4, to: 2.7},
  {text: 'It is a chain of thirteen ventures.', from: 2.9, to: 5.6},
];
export const OUTRO_LINES: Line[] = [
  {text: 'Thirteen ventures. One value chain.', from: 0.5, to: 3.3},
  {text: 'Which will you start?', from: 3.7, to: 6.2},
];
export const TOTAL_SECONDS = HOOK_SECONDS + STAGES.reduce((a, s) => a + s.seconds, 0) + OUTRO_SECONDS;
