"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { useFormContext } from "../context/FormContext"
import { BasicInfoStep } from "./form-steps/BasicInfoStep"
import { PowerRequirementsStep } from "./form-steps/PowerRequirementsStep"
import { FeaturesStep } from "./form-steps/FeaturesStep"
import { ReviewStep } from "./form-steps/ReviewStep"
import { StepIndicator } from "./ui/StepIndicator"

const stepComponents = {
  1: BasicInfoStep,
  2: PowerRequirementsStep,
  3: FeaturesStep,
  4: ReviewStep,
}

const stepTitles = {
  1: "Basic Information",
  2: "Power Requirements",
  3: "Product Features",
  4: "Image & Review",
}

export function MultiStepForm() {
  const {
    formData,
    currentStep,
    totalSteps,
    errors,
    isLoading,
    updateFormData,
    nextStep,
    prevStep,
    validateStep,
    submitForm,
  } = useFormContext()

  const CurrentStepComponent = stepComponents[currentStep as keyof typeof stepComponents]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Create New Product</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          <StepIndicator />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4">{stepTitles[currentStep as keyof typeof stepTitles]}</h2>
            <CurrentStepComponent formData={formData} updateFormData={updateFormData} errors={errors} />
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!validateStep(currentStep) || isLoading}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={submitForm} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isLoading ? "Creating..." : "Create Product"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
