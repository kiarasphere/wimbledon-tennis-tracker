interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-card error" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="retry-button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}
