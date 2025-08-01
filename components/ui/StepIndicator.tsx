"use client"
import { Check } from "lucide-react"
import { useMemo } from "react"
import { useFormContext } from "../../context/FormContext"

const stepLabels = ["Basic Info", "Power", "Features", "Review"]

export function StepIndicator() {
  const { currentStep, totalSteps, goToStep, formData } = useFormContext()

  // Memoize step validation to prevent re-renders during render
  const stepValidation = useMemo(() => {
    const validation: Record<number, boolean> = {}

    // Step 1: Basic Info
    validation[1] = formData.productName.trim() !== "" && formData.productType !== ""

    // Step 2: Power Requirements
    validation[2] = !formData.batteryRequired || formData.batteryType !== ""

    // Step 3: Features
    validation[3] = formData.features.length > 0

    // Step 4: Review (always valid)
    validation[4] = true

    return validation
  }, [formData])

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const canNavigate = stepNumber < currentStep || stepValidation[stepNumber]

          return (
            <button
              key={stepNumber}
              onClick={() => canNavigate && goToStep(stepNumber)}
              disabled={!canNavigate}
              className={`
                flex flex-col items-center space-y-1 transition-colors
                ${canNavigate ? "cursor-pointer hover:text-primary" : "cursor-not-allowed"}
                ${isActive ? "text-primary font-medium" : ""}
                ${isCompleted ? "text-green-600" : ""}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : ""}
                  ${isCompleted ? "bg-green-500 text-white" : ""}
                  ${!isActive && !isCompleted ? "bg-muted text-muted-foreground" : ""}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              <span className="text-center leading-tight">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
