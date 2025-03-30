"use client"

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  )
}

