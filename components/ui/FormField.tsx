import type React from "react"

interface FormFieldProps {
  children: React.ReactNode
  error?: string
}

export function FormField({ children, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {children}
      {error && <p className="text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">{error}</p>}
    </div>
  )
}
