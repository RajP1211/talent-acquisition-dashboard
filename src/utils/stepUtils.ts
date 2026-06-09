import { AnySchema } from 'yup';

export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export function getStepStatusFromValidation(errors: Record<string, any>, hasData: boolean): StepStatus {
  if (Object.keys(errors).length > 0) return 'error';
  if (!hasData) return 'pending';
  return 'completed';
}

export function hasFormData(values: Record<string, any>): boolean {
  return Object.values(values).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return String(value || '').trim().length > 0;
  });
}

export async function validateStep(schema: AnySchema, data: unknown) {
  try {
    await schema.validate(data, { abortEarly: false });
    return { valid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, any> = {};
    if (error.inner?.length) {
      error.inner.forEach((err: any) => {
        if (err.path) errors[err.path] = err.message;
      });
    }
    return { valid: false, errors };
  }
}
