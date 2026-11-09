export function CloudLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 34"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.4 34C5.6 34 0 28.6 0 22c0-6 4.5-11 10.3-11.8C12.5 4.4 17.5 0 23.6 0c7.4 0 13.6 5.5 14.8 12.6C43.8 12.2 49.5 16.9 49.5 23c0 6.1-4.9 11-11 11H12.4Z" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-end gap-1.5 text-navy">
      <span
        className={
          compact
            ? 'text-2xl leading-none font-light tracking-[-0.05em] sm:text-3xl'
            : 'wordmark'
        }
      >
        iWater
      </span>
      <CloudLogo
        className={
          compact
            ? 'mb-0.5 h-4 w-auto sm:h-5'
            : 'mb-1 h-6 w-auto sm:mb-2 sm:h-9'
        }
      />
    </span>
  )
}
