"use client"

import { useState, useCallback, useMemo } from "react"
import type { FormData } from "../types/form"
import { useFormValidation } from "./useFormValidation"
import { FORM_STEPS } from "../constants/form-data"

const initialFormData: FormData = {
  productName: "",
  productType: "",
  batteryRequired: false,
  batteryType: "",
  features: [],
  imageFile: null,
}

export function useMultiStepForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { errors, validateStep, clearFieldError } = useFormValidation()

  const totalSteps = Object.keys(FORM_STEPS).length

  // Memoize step validation to prevent unnecessary re-calculations
  const isStepValid = useMemo(() => {
    return (step: number): boolean => {
      switch (step) {
        case 1:
          return formData.productName.trim() !== "" && formData.productType !== ""
        case 2:
          return !formData.batteryRequired || formData.batteryType !== ""
        case 3:
          return formData.features.length > 0
        case 4:
          return true // Image is optional
        default:
          return false
      }
    }
  }, [formData])

  const updateFormData = useCallback(
    (field: keyof FormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
      clearFieldError(field)
    },
    [clearFieldError],
  )

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      // Only run validation with side effects when actually moving to next step
      if (validateStep(currentStep, formData)) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }, [currentStep, totalSteps, isStepValid, validateStep, formData])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        // Check if we can navigate to this step without running validation with side effects
        let canNavigate = true
        for (let i = 1; i < step; i++) {
          if (!isStepValid(i)) {
            canNavigate = false
            break
          }
        }
        if (canNavigate) {
          setCurrentStep(step)
        }
      }
    },
    [totalSteps, isStepValid],
  )

const submitForm = useCallback(async () => {
    let isValid = true;
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i, formData)) {
        isValid = false;
      }
    }
  
    if (!isValid) {
      setCurrentStep(1);
      return;
    }
  
    setIsLoading(true);
    try {
      // ✅ Map formData to match API payload
      const payload = {
        name: formData.productName,                  // 🟢 API expects name
        type: formData.productType,                  // 🟢 API expects type
        batteryNeeded: formData.batteryRequired,     // 🟢 API expects batteryNeeded
        batteryType: formData.batteryRequired ? formData.batteryType : null,
        features: formData.features || [],           // 🟢 API expects features
        imageUrl: formData.imageFile || "",          // 🟢 API expects imageUrl
      };
  
      console.log("📤 Final payload to send:", payload);
  
      // First, submit to products API
      const nextResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await nextResponse.json();
      console.log("✅ API response:", result);
  
      if (nextResponse.ok) {
        alert("Product created successfully!");
        
        // Generate and download PDF
        try {
          const pdfResponse = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (pdfResponse.ok) {
            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'submission-report.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          } else {
            console.error('PDF generation failed');
          }
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
        }
      } else {
        alert("❌ Error: ${result.message || 'Failed to create product'}");
      }
    } catch (error: any) {
      console.error("💥 Submission error:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, totalSteps, validateStep]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setCurrentStep(1)
    setIsLoading(false)
  }, [])

  return {
    formData,
    currentStep,
    totalSteps,
    errors,
    isLoading,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    validateStep: isStepValid, // Return the memoized validation function
    submitForm,
    resetForm,
  }
}
