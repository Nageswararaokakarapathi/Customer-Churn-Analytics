const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const box = "0 0 24 24";
type P = { className?: string };

export const IcUsers = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const IcCheck = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);
export const IcExit = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
);
export const IcShield = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
export const IcTrend = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="m23 6-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </svg>
);
export const IcMoney = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
export const IcClock = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
export const IcGauge = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M12 22a10 10 0 1 0-10-10" />
    <path d="m12 12 4-2" />
  </svg>
);
export const IcAlert = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
export const IcStar = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
export const IcGrid = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
export const IcLayers = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
export const IcDoc = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
export const IcCode = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
export const IcReset = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);
export const IcSpark = ({ className }: P) => (
  <svg className={className} viewBox={box} {...s}>
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />
  </svg>
);
