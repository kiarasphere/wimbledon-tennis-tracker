type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brand-mark-fill" x1="6" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f9a55" />
          <stop offset="1" stopColor="#0d4a2c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#brand-mark-fill)" />
      <circle cx="20" cy="20" r="11.5" stroke="#b8f0cc" strokeWidth="1.5" opacity="0.9" />
      <path
        d="M20 8.5c-4.2 3.2-6.5 7.2-6.5 11.5s2.3 8.3 6.5 11.5"
        stroke="#e8fff0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 8.5c4.2 3.2 6.5 7.2 6.5 11.5s-2.3 8.3-6.5 11.5"
        stroke="#e8fff0"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}
