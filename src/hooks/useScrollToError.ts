import { useEffect } from 'react';
import { Control, useFormState } from 'react-hook-form';

export function useScrollToError(control: Control<any>) {
  const { errors } = useFormState({ control });

  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0];
    if (!firstErrorField) return;
    const element = document.querySelector(`[name=\"${firstErrorField}\"]`);
    if (element && 'scrollIntoView' in element) {
      (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errors]);
}
