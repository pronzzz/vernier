const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.7,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
} as const

export const HelpIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.2a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6" />
    <path d="M12 17.2h.01" />
  </svg>
)

export const StatsIcon = () => (
  <svg {...base}>
    <path d="M5 20V12M12 20V5M19 20v-5" />
  </svg>
)

export const ThemeIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const BackIcon = () => (
  <svg {...base}>
    <path d="M9 6h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18H9l-5.5-6z" />
    <path d="M12.5 9.5l5 5M17.5 9.5l-5 5" />
  </svg>
)

export const EnterIcon = () => (
  <svg {...base}>
    <path d="M19 6v5a3 3 0 0 1-3 3H5" />
    <path d="M9 10l-4 4 4 4" />
  </svg>
)

export const ShareIcon = () => (
  <svg {...base}>
    <path d="M12 15V4M8 8l4-4 4 4" />
    <path d="M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12" />
  </svg>
)

export const NextIcon = () => (
  <svg {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const Chevron = ({ dir }: { dir: -1 | 1 }) => (
  <svg class={`dir ${dir < 0 ? 'is-left' : 'is-right'}`} viewBox="0 0 10 10" aria-hidden="true">
    <path d={dir < 0 ? 'M6.5 1.5L3 5l3.5 3.5' : 'M3.5 1.5L7 5 3.5 8.5'} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)
