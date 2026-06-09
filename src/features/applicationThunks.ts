import { AppDispatch, RootState } from '../app/store';
import { setCurrentStep, setStepStatus } from './applicationSlice';
import { formSchemas } from '../schemas/stepSchemas';
import { hasFormData, validateStep, StepStatus } from '../utils/stepUtils';

const getStepData = (state: RootState, step: number) => {
  const { application } = state;
  switch (step) {
    case 1:
      return application.personal;
    case 2:
      return application.education;
    case 3:
      return application.experience;
    case 4:
      return application.skills;
    case 5:
      return application.additional;
    default:
      return {};
  }
};

const getStepSchema = (step: number) => {
  switch (step) {
    case 1:
      return formSchemas.personal;
    case 2:
      return formSchemas.education;
    case 3:
      return formSchemas.experience;
    case 4:
      return formSchemas.skills;
    case 5:
      return formSchemas.additional;
    default:
      return null;
  }
};

const updateStepStatus = (dispatch: AppDispatch, step: number, valid: boolean, hasData: boolean) => {
  const status: StepStatus = valid ? 'completed' : hasData ? 'error' : 'pending';
  dispatch(setStepStatus({ step, status }));
};

export const goToStep = (targetStep: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const currentStep = state.application.currentStep;

  if (targetStep <= currentStep) {
    dispatch(setCurrentStep(targetStep));
    dispatch(setStepStatus({ step: targetStep, status: 'in-progress' }));
    return { ok: true };
  }

  let firstInvalidStep: number | null = null;

  for (let step = 1; step < targetStep; step += 1) {
    const schema = getStepSchema(step);
    if (!schema) continue;

    const data = getStepData(state, step);
    const result = await validateStep(schema, data);
    const hasData = hasFormData(data);
    updateStepStatus(dispatch, step, result.valid, hasData);

    if (!result.valid && firstInvalidStep === null) {
      firstInvalidStep = step;
    }
  }

  if (firstInvalidStep !== null) {
    dispatch(setCurrentStep(firstInvalidStep));
    return { ok: false, step: firstInvalidStep };
  }

  dispatch(setCurrentStep(targetStep));
  dispatch(setStepStatus({ step: targetStep, status: 'in-progress' }));
  return { ok: true };
};

export const submitApplication = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  let firstInvalidStep: number | null = null;

  for (let step = 1; step <= 5; step += 1) {
    const schema = getStepSchema(step);
    if (!schema) continue;

    const data = getStepData(state, step);
    const result = await validateStep(schema, data);
    const hasData = hasFormData(data);
    updateStepStatus(dispatch, step, result.valid, hasData);

    if (!result.valid && firstInvalidStep === null) {
      firstInvalidStep = step;
    }
  }

  if (firstInvalidStep !== null) {
    dispatch(setCurrentStep(firstInvalidStep));
    return { ok: false, step: firstInvalidStep };
  }

  return { ok: true };
};
