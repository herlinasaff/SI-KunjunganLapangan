function SambangLogo({ className = 'sambang-logo' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 42S5 30.2 5 17.8C5 10.7 13.5 5.5 20 12l4 4 4-4c6.5-6.5 15-1.3 15 5.8C43 30.2 24 42 24 42Z"
        fill="white"
      />
      <path
        d="m15.5 24 5.5 5.5 12-13"
        stroke="#F5C542"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SambangLogo