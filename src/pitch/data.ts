// Caption cards for the seven videos. **x** marks the hero figure (purple, counts up if numeric).
// Icons: see Icons.tsx. All figures come from the approved storyboard (maneclaud-7-caption-videos.md).
export type IconName = 'doc' | 'bars' | 'coin' | 'phone' | 'xstamp' | 'check' | 'pin' | 'clock' | 'bulb' | 'magnifier' | 'handshake';
export type Card = {text: string; hold: number; icon: IconName; kicker?: string; chips?: string[]};
export type Story = {id: string; title: string; tag: string; cards: Card[]};

export const CLOSING: Card[] = [
  {text: 'Every one of them had to pitch.', hold: 3.0, icon: 'bulb'},
  {text: '**Manetrust** Solutions', hold: 3.0, icon: 'doc', kicker: 'YOUR PITCH, READY'},
  {text: 'We prepare and maintain your pitch bundle.', hold: 3.5, icon: 'doc', kicker: 'MANETRUST SOLUTIONS'},
  {
    text: 'Your pitch bundle',
    hold: 4.5,
    icon: 'check',
    kicker: 'MANETRUST SOLUTIONS',
    chips: ['Business plan', 'Executive pitch', 'Pitch deck', '1-minute pitch video'],
  },
  {text: '**DM us.**', hold: 3.0, icon: 'phone', kicker: 'MANETRUST SOLUTIONS'},
];

export const STORIES: Story[] = [
  {
    id: 'Pitch1Chowdeck',
    title: 'Chowdeck',
    tag: 'NIGERIA',
    cards: [
      {text: 'Chowdeck. Lagos.', hold: 2.5, icon: 'pin'},
      {text: '**200+** investors met', hold: 3.0, icon: 'handshake'},
      {text: '**6** months of rejection', hold: 3.0, icon: 'clock'},
      {text: '“Nigeria is hard.”', hold: 3.0, icon: 'xstamp'},
      {text: '“Logistics is tough.”', hold: 3.0, icon: 'xstamp'},
      {text: '**1** investor said yes', hold: 3.0, icon: 'check'},
      {text: '**$9M** Series A, 2025', hold: 3.5, icon: 'coin'},
    ],
  },
  {
    id: 'Pitch2Flutterwave',
    title: 'Flutterwave',
    tag: 'NIGERIA',
    cards: [
      {text: 'Flutterwave. Co-founder: Iyin Aboyeji.', hold: 3.5, icon: 'pin'},
      {text: '**600+** investors pitched', hold: 3.0, icon: 'handshake'},
      {text: 'Many said: no room for another.', hold: 3.5, icon: 'xstamp'},
      {text: 'They kept pitching.', hold: 3.0, icon: 'doc'},
      {text: 'Now a major African payments company.', hold: 3.5, icon: 'bars'},
    ],
  },
  {
    id: 'Pitch3Andela',
    title: 'Andela',
    tag: 'NIGERIA · NETWORK',
    cards: [
      {text: "Iyin Aboyeji's first company, Fora, shut down.", hold: 4.0, icon: 'xstamp'},
      {text: 'A dry spell chasing investors.', hold: 3.0, icon: 'clock'},
      {text: 'Next: Andela, with Jeremy Johnson.', hold: 3.5, icon: 'bulb'},
      {text: 'Not planning to raise yet.', hold: 3.0, icon: 'magnifier'},
      {text: 'They met the Chan Zuckerberg team at an event.', hold: 4.0, icon: 'handshake'},
      {text: '2016: **$24M** raised.', hold: 3.5, icon: 'coin'},
    ],
  },
  {
    id: 'Pitch4Minicor',
    title: 'Minicor',
    tag: 'NIGERIA',
    cards: [
      {text: 'Saheed Akinbile. Nigerian-born engineer.', hold: 3.5, icon: 'bulb'},
      {text: 'Applied to Y Combinator **7** times.', hold: 3.5, icon: 'doc'},
      {text: '**3** interviews.', hold: 2.5, icon: 'magnifier'},
      {text: '**1** acceptance: Spring 2026.', hold: 3.5, icon: 'check'},
      {text: 'Then Minicor raised **$3.8M**.', hold: 3.5, icon: 'coin'},
    ],
  },
  {
    id: 'Pitch5Canva',
    title: 'Canva',
    tag: 'NETWORK',
    cards: [
      {text: 'Melanie Perkins. Canva.', hold: 2.5, icon: 'bulb'},
      {text: '**100+** investors said no.', hold: 3.0, icon: 'xstamp'},
      {text: 'She took up kitesurfing.', hold: 3.0, icon: 'pin'},
      {text: 'To meet investor Bill Tai.', hold: 3.0, icon: 'handshake'},
      {text: 'His condition: a strong tech team.', hold: 3.5, icon: 'magnifier'},
      {text: 'He introduced Lars Rasmussen.', hold: 3.0, icon: 'phone'},
      {text: 'The Google Maps co-founder approved the team.', hold: 4.0, icon: 'check'},
    ],
  },
  {
    id: 'Pitch6Airbnb',
    title: 'Airbnb',
    tag: 'NETWORK',
    cards: [
      {text: 'Airbnb, 2008.', hold: 2.5, icon: 'pin'},
      {text: 'Seeking **$150,000**.', hold: 3.0, icon: 'coin'},
      {text: 'A friend introduced them to **7** investors.', hold: 3.5, icon: 'handshake'},
      {text: '**5** said no.', hold: 2.5, icon: 'xstamp'},
      {text: '**2** never replied.', hold: 2.5, icon: 'phone'},
      {text: 'Brian Chesky later shared the emails.', hold: 3.5, icon: 'doc'},
    ],
  },
  {
    id: 'Pitch7Amazon',
    title: 'Amazon',
    tag: 'NETWORK',
    cards: [
      {text: 'Amazon, 1994.', hold: 2.5, icon: 'pin'},
      {text: 'About **60** people pitched.', hold: 3.0, icon: 'handshake'},
      {text: 'Asking roughly **$50,000** each.', hold: 3.5, icon: 'coin'},
      {text: '**22** said yes.', hold: 2.5, icon: 'check'},
      {text: 'Including his parents, brother and sister.', hold: 3.5, icon: 'bulb'},
      {text: '**$981,000** raised.', hold: 3.5, icon: 'bars'},
    ],
  },
];

export const allCards = (s: Story) => [...s.cards, ...CLOSING];
export const storySeconds = (s: Story) => allCards(s).reduce((a, c) => a + c.hold, 0) + 0.6;
