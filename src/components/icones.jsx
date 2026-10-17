function Svg({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconeSino() {
  return (
    <Svg>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </Svg>
  )
}

export function IconeMicrofone() {
  return (
    <Svg>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v4" />
    </Svg>
  )
}

export function IconeRelogio() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  )
}

export function IconePrancheta() {
  return (
    <Svg>
      <path d="M9 3h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M8 5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h4" />
      <path d="M16 5h1a1 1 0 0 1 1 1v3" />
      <circle cx="16.5" cy="16.5" r="4.5" />
      <path d="M16.5 14.2v2.4l1.6 1" />
    </Svg>
  )
}

export function IconeHospital() {
  return (
    <Svg>
      <path d="M4 21V9l8-6 8 6v12" />
      <path d="M2 21h20" />
      <path d="M12 10v6" />
      <path d="M9 13h6" />
    </Svg>
  )
}