interface ScanErrorProps {
  message: string
  onRetry: () => void
}

export function ScanError({ message, onRetry }: ScanErrorProps) {
  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-3">
      <p className="text-sm text-red-200">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm font-medium text-white underline"
      >
        Try Again
      </button>
    </div>
  )
}
