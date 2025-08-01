"use client"

import type React from "react"
import { createContext, useContext } from "react"
import type { FormContextType } from "../types/form"
import { useMultiStepForm } from "../hooks/useMultiStepForm"

const FormContext = createContext<FormContextType | null>(null)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const formMethods = useMultiStepForm()

  return <FormContext.Provider value={formMethods}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}
