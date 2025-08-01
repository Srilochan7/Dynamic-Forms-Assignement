"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BATTERY_TYPES } from "../../constants/form-data"
import type { StepProps } from "../../types/form"
import { FormField } from "../ui/FormField"

export function PowerRequirementsStep({ formData, updateFormData, errors }: StepProps) {
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
        <FormField error={errors.batteryType}>
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <Label htmlFor="batteryType">Battery Type *</Label>
            <Select value={formData.batteryType} onValueChange={(value) => updateFormData("batteryType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select battery type" />
              </SelectTrigger>
              <SelectContent>
                {BATTERY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FormField>
      )}
    </div>
  )
}
