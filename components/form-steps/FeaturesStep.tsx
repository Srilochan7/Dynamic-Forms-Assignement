"use client"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"
import { AVAILABLE_FEATURES } from "../../constants/form-data"
import type { StepProps } from "../../types/form"
import { FormField } from "../ui/FormField"

export function FeaturesStep({ formData, updateFormData, errors }: StepProps) {
  const toggleFeature = (feature: string) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter((f) => f !== feature)
      : [...formData.features, feature]
    updateFormData("features", newFeatures)
  }

  return (
    <div className="space-y-6">
      <FormField error={errors.features}>
        <div className="space-y-2">
          <Label>Product Features *</Label>
          <p className="text-sm text-muted-foreground">Select all features that apply to your product</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {AVAILABLE_FEATURES.map((feature) => (
            <Badge
              key={feature.value}
              variant={formData.features.includes(feature.value) ? "default" : "outline"}
              className="cursor-pointer justify-center p-3 text-center transition-all hover:scale-105"
              onClick={() => toggleFeature(feature.value)}
            >
              {formData.features.includes(feature.value) && <Check className="w-3 h-3 mr-1" />}
              <span className="mr-1">{feature.icon}</span>
              {feature.label}
            </Badge>
          ))}
        </div>

        {formData.features.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Features:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((featureValue) => {
                const feature = AVAILABLE_FEATURES.find((f) => f.value === featureValue)
                return (
                  <Badge key={featureValue} variant="secondary">
                    <span className="mr-1">{feature?.icon}</span>
                    {feature?.label}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleFeature(featureValue)} />
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </FormField>
    </div>
  )
}
