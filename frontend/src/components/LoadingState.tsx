export function LoadingState({ message = 'Loading standings...' }: { message?: string }) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  )
}
