// Icons accompany text labels; assistive technology reads the labels once.
const paths = {
  mask: <><path d="M3 5c3 0 5 2 9 2s6-2 9-2v7c0 5-5 8-9 9-4-1-9-4-9-9Z"/><path d="m6 11 4 1m4 0 4-1m-9 5c2 1 4 1 6 0"/></>,
  users: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-17a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  hide: <><path d="m3 3 18 18M9 5a12 12 0 0 1 3 0c6 0 10 7 10 7a20 20 0 0 1-3 4M6 6a20 20 0 0 0-4 6s4 7 10 7a12 12 0 0 0 5-1"/><path d="M10 10a3 3 0 0 0 4 4"/></>,
  chat: <path d="M21 11a9 9 0 0 1-9 9 11 11 0 0 1-4-1l-5 2 1-5a9 9 0 1 1 17-5Z"/>,
  vote: <><path d="m9 3 9 5-5 9-9-5Zm-3 12H3v6h18v-6h-4"/><path d="m9 9 1 2 4-2"/></>,
  trophy: <><path d="M7 3h10v6a5 5 0 0 1-10 0Zm0 2H3v2a4 4 0 0 0 4 4m10-6h4v2a4 4 0 0 1-4 4m-5 3v7m-5 0h10"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  circle: <circle cx="12" cy="12" r="8"/>,
  sparkles: <><path d="m10 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2Zm9 12 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/></>,
  tag: <><path d="M3 3h8l10 10-8 8L3 11Z"/><circle cx="7" cy="7" r="1"/></>,
  levels: <path d="M5 20v-6m7 6V9m7 11V4"/>,
  timer: <><circle cx="12" cy="14" r="8"/><path d="M12 10v4l3 2M9 2h6m-3 0v4m6 1 2-2"/></>,
  book: <><path d="M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2Z"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5m-4-4a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3"/></>,
  settings: <><path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  play: <path d="m8 4 12 8-12 8Z"/>,
  pause: <path d="M8 5v14M16 5v14"/>,
}

export default function Icon({ name, className = '' }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>
}
