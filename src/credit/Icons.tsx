import React from 'react';

type P = {size?: number; color?: string};

const Svg: React.FC<P & {children: React.ReactNode}> = ({size = 72, color = 'currentColor', children}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const IdIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="5" y="10" width="38" height="28" rx="4" />
    <circle cx="17" cy="21" r="4" />
    <path d="M10 33c1-4 4-6 7-6s6 2 7 6M29 20h8M29 27h8" />
  </Svg>
);
export const ChartIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M7 41V7M7 41h35" />
    <path d="M14 32l9-9 7 6 11-14" />
  </Svg>
);
export const PhoneIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="13" y="4" width="22" height="40" rx="5" />
    <path d="M21 37h6" />
  </Svg>
);
export const LockIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="9" y="21" width="30" height="21" rx="4" />
    <path d="M16 21v-6a8 8 0 0116 0v6M24 29v6" />
  </Svg>
);
export const CartIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 7h6l5 24h22l4-17H12" />
    <circle cx="19" cy="39" r="3" />
    <circle cx="34" cy="39" r="3" />
  </Svg>
);
export const StoreIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 18l4-10h28l4 10M6 18c0 4 4 5 6 5s6-1 6-5c0 4 4 5 6 5s6-1 6-5c0 4 4 5 6 5s6-1 6-5" />
    <path d="M9 24v17h30V24M20 41V31h8v10" />
  </Svg>
);
export const HomeIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 23L24 7l19 16M10 20v21h28V20M20 41V29h8v12" />
  </Svg>
);
export const XIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M10 10l28 28M38 10L10 38" />
  </Svg>
);
export const CheckIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8 25l11 11L40 12" />
  </Svg>
);
