interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 text-white text-center">
      <h3 className="text-xl font-bold mb-2">Error</h3>
      <p>{message}</p>
      <p className="mt-2 text-sm">Please try searching for a different location.</p>
    </div>
  )
}

