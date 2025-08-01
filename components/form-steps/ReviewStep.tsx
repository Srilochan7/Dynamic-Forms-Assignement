"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { PRODUCT_TYPES, BATTERY_TYPES, AVAILABLE_FEATURES } from "../../constants/form-data"
import type { StepProps } from "../../types/form"

export function ReviewStep({ formData, updateFormData }: StepProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    updateFormData("imageFile", file)
  }

  const removeImage = () => {
    updateFormData("imageFile", null)
  }

  const getProductTypeLabel = (value: string) => {
    return PRODUCT_TYPES.find((type) => type.value === value)?.label || value
  }

  const getBatteryTypeLabel = (value: string) => {
    return BATTERY_TYPES.find((type) => type.value === value)?.label || value
  }

  const getFeatureLabels = (values: string[]) => {
    return values.map((value) => AVAILABLE_FEATURES.find((feature) => feature.value === value)?.label || value)
  }

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
          <div>
            <strong>Name:</strong> {formData.productName}
          </div>
          <div>
            <strong>Type:</strong> {getProductTypeLabel(formData.productType)}
          </div>
          <div>
            <strong>Battery:</strong>{" "}
            {formData.batteryRequired ? `Yes (${getBatteryTypeLabel(formData.batteryType)})` : "No"}
          </div>
          <div>
            <strong>Features:</strong> {getFeatureLabels(formData.features).join(", ")}
          </div>
          <div>
            <strong>Image:</strong> {formData.imageFile ? "Uploaded" : "None"}
          </div>
        </div>
      </div>
    </div>
  )
}
