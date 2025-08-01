import type React from "react"

export interface FormData {
  productName: string
  productType: string
  batteryRequired: boolean
  batteryType: string
  features: string[]
  imageFile: File | null
}

export interface StepConfig {
  id: number
  title: string
  description: string
  component: React.ComponentType<StepProps>
  validation: (data: FormData) => boolean
}

export interface StepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  errors: Record<string, string>
}

export interface ValidationRule {
  field: keyof FormData
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any, formData: FormData) => string | null
}

export interface FormContextType {
  formData: FormData
  currentStep: number
  totalSteps: number
  errors: Record<string, string>
  isLoading: boolean
  updateFormData: (field: keyof FormData, value: any) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  validateStep: (step: number) => boolean
  submitForm: () => Promise<void>
  resetForm: () => void
}
