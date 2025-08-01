import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

// Types
interface FormData {
  productName: string
  productType: string
  batteryRequired: boolean
  batteryType: string
  features: string[]
  imageFile: File | null
}

// Constants
const PRODUCT_TYPES = [
  "Electronics",
  "Home & Garden", 
  "Sports & Outdoors",
  "Automotive",
  "Health & Beauty", 
  "Toys & Games",
]

const BATTERY_TYPES = ["AA", "AAA", "9V", "CR2032", "Lithium Ion", "Rechargeable"]

const AVAILABLE_FEATURES = [
  "Waterproof",
  "Wireless", 
  "Bluetooth",
  "USB-C",
  "LED Display",
  "Touch Screen",
  "Voice Control",
  "App Compatible",
  "Energy Efficient",
  "Portable",
]

const initialFormData: FormData = {
  productName: "",
  productType: "",
  batteryRequired: false,
  batteryType: "",
  features: [],
  imageFile: null,
}

// Custom Hook for Multi-Step Form
function useMultiStepForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totalSteps = 4

  // Validation logic
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

  const updateFormData = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSubmitError(null) // Clear any previous errors
  }, [])

  const toggleFeature = useCallback((feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, totalSteps, isStepValid])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // Main submission logic - this is where the API call happens
  const submitForm = useCallback(async () => {
    if (!isStepValid(currentStep)) return

    setIsLoading(true)
    setSubmitError(null)

    const payload = {
      name: formData.productName,
      type: formData.productType,
      batteryNeeded: formData.batteryRequired,
      batteryType: formData.batteryRequired ? formData.batteryType : null,
      features: formData.features,
      imageUrl: "", // Handle image upload separately if needed
    }

    try {
      console.log("🚀 Submitting payload:", payload)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log("📡 Response status:", response.status)
      
      const responseText = await response.text()
      console.log("📄 Response text:", responseText)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`)
      }

      // Success
      console.log("✅ Product created successfully!")
      alert("✅ Product created successfully!")
      
      // Reset form on success
      setFormData(initialFormData)
      setCurrentStep(1)

    } catch (error) {
      console.error("💥 Submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setSubmitError(errorMessage)
      alert(`❌ Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [formData, isStepValid, currentStep])

  return {
    formData,
    currentStep,
    totalSteps,
    isLoading,
    submitError,
    updateFormData,
    toggleFeature,
    nextStep,
    prevStep,
    isStepValid,
    submitForm,
  }
}

// Main Component
export default function MultiStepForm() {
  const {
    formData,
    currentStep,
    totalSteps,
    isLoading,
    submitError,
    updateFormData,
    toggleFeature,
    nextStep,
    prevStep,
    isStepValid,
    submitForm,
  } = useMultiStepForm()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    updateFormData("imageFile", file)
  }

  const removeImage = () => {
    updateFormData("imageFile", null)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={formData.productName}
                onChange={(e) => updateFormData("productName", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select value={formData.productType} onValueChange={(value) => updateFormData("productType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="batteryRequired">Battery Required?</Label>
              <Switch
                id="batteryRequired"
                checked={formData.batteryRequired}
                onCheckedChange={(checked) => {
                  updateFormData("batteryRequired", checked)
                  if (!checked) {
                    updateFormData("batteryType", "")
                  }
                }}
              />
            </div>

            {formData.batteryRequired && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="batteryType">Battery Type *</Label>
                <Select value={formData.batteryType} onValueChange={(value) => updateFormData("batteryType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select battery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BATTERY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Product Features *</Label>
              <p className="text-sm text-muted-foreground">Select all features that apply to your product</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_FEATURES.map((feature) => (
                <Badge
                  key={feature}
                  variant={formData.features.includes(feature) ? "default" : "outline"}
                  className="cursor-pointer justify-center p-3 text-center transition-all hover:scale-105"
                  onClick={() => toggleFeature(feature)}
                >
                  {formData.features.includes(feature) && <Check className="w-3 h-3 mr-1" />}
                  {feature}
                </Badge>
              ))}
            </div>
            {formData.features.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Features ({formData.features.length}):</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleFeature(feature)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Product Image (Optional)</Label>
              <p className="text-sm text-muted-foreground">Upload an image of your product</p>
            </div>

            {!formData.imageFile ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="imageUpload" className="cursor-pointer">
                  <span className="text-sm font-medium">Click to upload</span>
                  <span className="text-sm text-muted-foreground block">PNG, JPG up to 10MB</span>
                </Label>
                <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            ) : (
              <div className="relative border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formData.imageFile.name}</span>
                  <Button variant="ghost" size="sm" onClick={removeImage}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">Review Your Product</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {formData.productName}</div>
                <div><strong>Type:</strong> {formData.productType}</div>
                <div><strong>Battery:</strong> {formData.batteryRequired ? `Yes (${formData.batteryType})` : "No"}</div>
                <div><strong>Features:</strong> {formData.features.join(", ")}</div>
                <div><strong>Image:</strong> {formData.imageFile ? "Uploaded" : "None"}</div>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{submitError}</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Information"
      case 2: return "Power Requirements"
      case 3: return "Product Features"
      case 4: return "Image & Review"
      default: return ""
    }
  }

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
          <div className="space-y-2">
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Basic Info</span>
              <span>Power</span>
              <span>Features</span>
              <span>Review</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4">{getStepTitle()}</h2>
            {renderStepContent()}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep} 
                disabled={!isStepValid(currentStep) || isLoading} 
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={submitForm} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Product
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}