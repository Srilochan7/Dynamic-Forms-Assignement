import { FormProvider } from "../context/FormContext"
import { MultiStepForm } from "../components/MultiStepForm"

export default function Page() {
  return (
    <FormProvider>
      <MultiStepForm />
    </FormProvider>
  )
}
