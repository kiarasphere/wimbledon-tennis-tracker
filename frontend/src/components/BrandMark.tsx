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
      <rect width="40" height="40" rx="10" fill="#1a3d2e" />
      <circle cx="20" cy="20" r="11.5" stroke="#d4e8d4" strokeWidth="1.5" />
      <path
        d="M20 8.5c-4.2 3.2-6.5 7.2-6.5 11.5s2.3 8.3 6.5 11.5"
        stroke="#d4e8d4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 8.5c4.2 3.2 6.5 7.2 6.5 11.5s-2.3 8.3-6.5 11.5"
        stroke="#d4e8d4"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
