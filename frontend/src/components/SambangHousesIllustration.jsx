function SambangHousesIllustration({ className = 'sambang-houses-illustration', width = 360, height = 220 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 250"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="houses-shadow" x="-8%" y="-8%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#102b57" floodOpacity="0.08" />
        </filter>
        <linearGradient id="cloud-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e1edfd" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="pin-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Ground hill */}
      <ellipse cx="210" cy="228" rx="190" ry="32" fill="#eaf2fd" />
      <ellipse cx="140" cy="232" rx="120" ry="22" fill="#dbeafe" />

      {/* Floating clouds */}
      <path d="M50 70 a18 18 0 0 1 32 -6 a14 14 0 0 1 20 4 a12 12 0 0 1 12 12 l-64 0 a10 10 0 0 1 0 -10 Z" fill="url(#cloud-soft)" />
      <path d="M300 50 a20 20 0 0 1 38 -7 a16 16 0 0 1 22 5 a13 13 0 0 1 13 13 l-73 0 a11 11 0 0 1 0 -11 Z" fill="url(#cloud-soft)" />

      {/* Village Group */}
      <g filter="url(#houses-shadow)">
        {/* Tree behind house 1 */}
        <circle cx="85" cy="180" r="18" fill="#a7f3d0" />
        <circle cx="98" cy="172" r="14" fill="#6ee7b7" />
        <rect x="90" y="185" width="4" height="25" fill="#a3a3a3" rx="2" />

        {/* Tree Center */}
        <circle cx="160" cy="160" r="22" fill="#34d399" />
        <circle cx="174" cy="152" r="17" fill="#10b981" />
        <rect x="165" y="172" width="5" height="28" fill="#a3a3a3" rx="2" />

        {/* Tree Right */}
        <circle cx="318" cy="168" r="20" fill="#6ee7b7" />
        <rect x="316" y="180" width="4" height="26" fill="#a3a3a3" rx="2" />

        {/* House 1: Yellow cozy cottage */}
        <rect x="80" y="176" width="54" height="42" rx="4" fill="#fef3c7" />
        <polygon points="74,177 107,146 140,177" fill="#f59e0b" />
        <rect x="100" y="192" width="14" height="26" rx="2" fill="#b45309" />
        <rect x="86" y="185" width="9" height="9" rx="1.5" fill="#bae6fd" />

        {/* House 2: White/Blue modern two-story home */}
        <rect x="146" y="156" width="68" height="64" rx="4" fill="#ffffff" />
        <polygon points="140,156 180,120 220,156" fill="#2563eb" />
        <rect x="156" y="166" width="12" height="12" rx="2" fill="#93c5fd" />
        <rect x="184" y="166" width="12" height="12" rx="2" fill="#93c5fd" />
        <rect x="156" y="188" width="12" height="12" rx="2" fill="#93c5fd" />
        <rect x="182" y="188" width="16" height="32" rx="2" fill="#1e3a8a" />

        {/* House 3: Mint/Teal bungalow */}
        <rect x="224" y="172" width="56" height="46" rx="4" fill="#f0fdf4" />
        <polygon points="218,172 252,142 286,172" fill="#0284c7" />
        <rect x="238" y="188" width="13" height="30" rx="2" fill="#047857" />
        <rect x="258" y="182" width="10" height="10" rx="1.5" fill="#bae6fd" />

        {/* House 4: Orange house far right */}
        <rect x="290" y="182" width="46" height="36" rx="4" fill="#fff7ed" />
        <polygon points="286,182 313,158 340,182" fill="#ea580c" />
        <rect x="302" y="194" width="11" height="24" rx="2" fill="#9a3412" />
        <rect x="319" y="190" width="8" height="8" rx="1.5" fill="#bae6fd" />

        {/* Bush greenery in foreground */}
        <circle cx="75" cy="220" r="10" fill="#34d399" />
        <circle cx="138" cy="221" r="8" fill="#10b981" />
        <circle cx="218" cy="221" r="9" fill="#059669" />
        <circle cx="282" cy="221" r="10" fill="#34d399" />
        <circle cx="342" cy="220" r="12" fill="#10b981" />
      </g>

      {/* Floating Big Location Pin (Destination) */}
      <g transform="translate(196, 68)">
        {/* Soft Pin Glow / Pulse */}
        <circle cx="14" cy="14" r="22" fill="#93c5fd" opacity="0.35" />
        <ellipse cx="14" cy="46" rx="12" ry="4" fill="#1e40af" opacity="0.22" />
        <path
          d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 42 14 42S28 24.5 28 14C28 6.27 21.73 0 14 0Z"
          fill="url(#pin-grad)"
        />
        <circle cx="14" cy="14" r="6" fill="#ffffff" />
        <path d="M11 14L13 16L18 11" stroke="#f5c542" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export default SambangHousesIllustration
