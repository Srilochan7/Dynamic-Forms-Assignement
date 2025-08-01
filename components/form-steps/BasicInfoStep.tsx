"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PRODUCT_TYPES } from "../../constants/form-data"
import type { StepProps } from "../../types/form"
import { FormField } from "../ui/FormField"

export function BasicInfoStep({ formData, updateFormData, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <FormField error={errors.productName}>
        <Label htmlFor="productName">Product Name *</Label>
        <Input
          id="productName"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={(e) => updateFormData("productName", e.target.value)}
          className="w-full"
        />
      </FormField>

      <FormField error={errors.productType}>
        <Label htmlFor="productType">Product Type *</Label>
        <Select value={formData.productType} onValueChange={(value) => updateFormData("productType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  )
}
