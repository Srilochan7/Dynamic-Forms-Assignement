"use client"

import { useState, useCallback } from "react"
import type { FormData, ValidationRule } from "../types/form"

const validationRules: Record<number, ValidationRule[]> = {
  1: [
    { field: "productName", required: true, minLength: 2, maxLength: 100 },
    { field: "productType", required: true },
  ],
  2: [
    {
      field: "batteryType",
      custom: (value, formData) => {
        if (formData.batteryRequired && !value) {
          return "Battery type is required when battery is needed"
        }
        return null
      },
    },
  ],
  3: [
    {
      field: "features",
      custom: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return "At least one feature must be selected"
        }
        return null
      },
    },
  ],
  4: [], // No validation for optional image upload
}

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = useCallback((field: keyof FormData, value: any, formData: FormData): string | null => {
    // Find all rules for this field across all steps
    const allRules = Object.values(validationRules).flat()
    const fieldRules = allRules.filter((rule) => rule.field === field)

    for (const rule of fieldRules) {
      if (rule.required && (!value || (typeof value === "string" && value.trim() === ""))) {
        return `${field} is required`
      }

      if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
        return `${field} must be at least ${rule.minLength} characters`
      }

      if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
        return `${field} must be no more than ${rule.maxLength} characters`
      }

      if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
        return `${field} format is invalid`
      }

      if (rule.custom) {
        const customError = rule.custom(value, formData)
        if (customError) return customError
      }
    }

    return null
  }, [])

  const validateStep = useCallback(
    (step: number, formData: FormData): boolean => {
      const stepRules = validationRules[step] || []
      const stepErrors: Record<string, string> = {}

      for (const rule of stepRules) {
        const value = formData[rule.field]
        const error = validateField(rule.field, value, formData)
        if (error) {
          stepErrors[rule.field] = error
        }
      }

      setErrors((prev) => ({
        ...prev,
        ...stepErrors,
      }))

      return Object.keys(stepErrors).length === 0
    },
    [validateField],
  )

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const clearFieldError = useCallback((field: keyof FormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    errors,
    validateField,
    validateStep,
    clearErrors,
    clearFieldError,
  }
}
