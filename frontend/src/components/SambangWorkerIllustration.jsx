function SambangWorkerIllustration({ className = 'sambang-illustration', width = 420, height = 240 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 280"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Soft shadow for worker and houses */}
        <filter id="ill-shadow" x="-8%" y="-8%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#102b57" floodOpacity="0.08" />
        </filter>
        {/* Gradients */}
        <linearGradient id="cloud-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e3eeff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="roof-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="roof-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="roof-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="shirt-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="skin-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
      </defs>

      {/* Background Soft Hills & Clouds */}
      <ellipse cx="380" cy="225" rx="140" ry="42" fill="#e0ecfc" />
      <ellipse cx="230" cy="235" rx="180" ry="32" fill="#eaf2fd" />
      <ellipse cx="100" cy="238" rx="90" ry="24" fill="#dbeafe" />

      {/* Clouds in background */}
      <g opacity="0.75">
        <path d="M70 70 a18 18 0 0 1 32 -6 a14 14 0 0 1 20 4 a12 12 0 0 1 12 12 l-64 0 a10 10 0 0 1 0 -10 Z" fill="url(#cloud-grad)" />
        <path d="M360 48 a22 22 0 0 1 40 -8 a18 18 0 0 1 24 5 a15 15 0 0 1 14 15 l-78 0 a12 12 0 0 1 0 -12 Z" fill="url(#cloud-grad)" />
      </g>

      {/* Houses & Trees Village (Right Section) */}
      <g filter="url(#ill-shadow)">
        {/* Tree behind house 1 */}
        <circle cx="330" cy="190" r="18" fill="#a7f3d0" />
        <circle cx="342" cy="182" r="14" fill="#6ee7b7" />
        <rect x="334" y="195" width="4" height="20" fill="#a3a3a3" rx="2" />

        {/* Tree between houses */}
        <circle cx="388" cy="175" r="22" fill="#34d399" />
        <circle cx="400" cy="168" r="16" fill="#10b981" />
        <rect x="392" y="185" width="5" height="24" fill="#a3a3a3" rx="2" />

        {/* House 1 (Left - Yellow cottage) */}
        <rect x="325" y="192" width="48" height="36" rx="4" fill="#fef3c7" />
        {/* Roof */}
        <polygon points="320,193 349,165 378,193" fill="url(#roof-yellow)" />
        {/* Door & Window */}
        <rect x="343" y="206" width="12" height="22" rx="2" fill="#b45309" />
        <rect x="331" y="200" width="8" height="8" rx="1.5" fill="#bae6fd" />
        <rect x="360" y="200" width="8" height="8" rx="1.5" fill="#bae6fd" />

        {/* House 2 (Center - Blue modern townhouse) */}
        <rect x="375" y="178" width="54" height="52" rx="4" fill="#ffffff" />
        {/* Roof */}
        <polygon points="370,178 402,148 434,178" fill="url(#roof-blue)" />
        {/* Windows */}
        <rect x="384" y="186" width="10" height="10" rx="2" fill="#93c5fd" />
        <rect x="408" y="186" width="10" height="10" rx="2" fill="#93c5fd" />
        <rect x="384" y="204" width="10" height="10" rx="2" fill="#93c5fd" />
        {/* Door */}
        <rect x="406" y="204" width="14" height="26" rx="2" fill="#1e3a8a" />

        {/* House 3 (Right - Turquoise bungalow) */}
        <rect x="430" y="196" width="44" height="34" rx="4" fill="#f0fdf4" />
        <polygon points="426,196 452,172 478,196" fill="url(#roof-teal)" />
        <rect x="440" y="208" width="10" height="22" rx="2" fill="#047857" />
        <rect x="456" y="204" width="8" height="8" rx="1.5" fill="#bae6fd" />

        {/* Foliage bushes in front */}
        <circle cx="320" cy="226" r="10" fill="#34d399" />
        <circle cx="368" cy="226" r="8" fill="#10b981" />
        <circle cx="430" cy="227" r="9" fill="#059669" />
        <circle cx="474" cy="227" r="11" fill="#34d399" />
      </g>

      {/* Dashed Route Path connecting worker to village */}
      <path
        d="M 160 178 Q 215 130 270 172 T 385 152"
        stroke="#3b82f6"
        strokeWidth="2.8"
        strokeDasharray="6 6"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Mid Route Location Pin */}
      <g transform="translate(262, 142)">
        <ellipse cx="8" cy="24" rx="8" ry="3" fill="#1e40af" opacity="0.18" />
        <path
          d="M8 0C3.58 0 0 3.58 0 8C0 14 8 22 8 22S16 14 16 8C16 3.58 12.42 0 8 0Z"
          fill="#2563eb"
        />
        <circle cx="8" cy="8" r="3.2" fill="#ffffff" />
      </g>

      {/* Destination Location Pin at Village */}
      <g transform="translate(378, 122)">
        <ellipse cx="10" cy="29" rx="10" ry="3.5" fill="#1e40af" opacity="0.22" />
        <path
          d="M10 0C4.48 0 0 4.48 0 10C0 17.5 10 27 10 27S20 17.5 20 10C20 4.48 15.52 0 10 0Z"
          fill="#1d4ed8"
        />
        <circle cx="10" cy="10" r="4" fill="#ffffff" />
        <path d="M8 10L9.5 11.5L12.5 8.5" stroke="#f5c542" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Worker Figure (Left Section) */}
      <g filter="url(#ill-shadow)">
        {/* Worker shadow */}
        <ellipse cx="118" cy="236" rx="38" ry="8" fill="#1e3a8a" opacity="0.16" />

        {/* Legs & Shoes */}
        <path d="M102 188 L100 230 L110 230 L112 188 Z" fill="#1e293b" />
        <path d="M118 188 L122 228 L134 228 L128 188 Z" fill="#1e293b" />
        {/* Shoes */}
        <rect x="94" y="228" width="18" height="7" rx="3.5" fill="#0f172a" />
        <rect x="120" y="226" width="18" height="7" rx="3.5" fill="#0f172a" />

        {/* Backpack */}
        <path d="M76 138 C74 130 82 120 90 120 L96 120 L96 172 L84 170 C78 170 76 160 76 150 Z" fill="#334155" />
        <path d="M72 136 C70 144 70 156 74 164" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

        {/* Body / Shirt */}
        <path d="M92 122 C96 116 112 114 126 120 L134 140 L130 188 L96 188 L92 144 Z" fill="url(#shirt-grad)" />

        {/* Left Arm holding phone */}
        <path d="M122 128 L138 148 L134 164 L122 160" stroke="url(#shirt-grad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="134" cy="164" r="5" fill="url(#skin-grad)" />

        {/* Right Arm */}
        <path d="M100 128 L114 154 L126 162" stroke="url(#shirt-grad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="126" cy="162" r="5" fill="url(#skin-grad)" />

        {/* Smartphone */}
        <rect x="126" y="150" width="14" height="22" rx="3" fill="#0f172a" transform="rotate(15 126 150)" />
        <rect x="128" y="152" width="10" height="17" rx="2" fill="#67e8f9" transform="rotate(15 126 150)" />
        <circle cx="132" cy="160" r="1.5" fill="#ffffff" transform="rotate(15 126 150)" />

        {/* Neck */}
        <rect x="110" y="108" width="10" height="12" fill="url(#skin-grad)" rx="2" />

        {/* Head */}
        <circle cx="116" cy="100" r="14" fill="url(#skin-grad)" />

        {/* Face features - Profile facing right */}
        <path d="M124 98 C128 100 128 103 124 105" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="123" cy="97" r="1.5" fill="#0f172a" />
        <path d="M121 106 Q124 108 126 106" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />

        {/* Cap (Visor facing right) */}
        <path d="M102 96 C102 85 112 84 122 87 L134 92 L120 98 Z" fill="#1e40af" />
        <path d="M116 88 L138 92 C141 93 140 95 136 96 L122 96 Z" fill="#1d4ed8" />
        {/* Hair */}
        <path d="M102 94 C100 100 103 108 108 108" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export default SambangWorkerIllustration
