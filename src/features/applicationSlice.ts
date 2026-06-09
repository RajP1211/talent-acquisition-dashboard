import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EducationRow = {
  school: string;
  board: string;
  cgpa: string;
  year: string;
};

export type ExperienceRow = {
  id: string;
  company: string;
  title: string;
  duration: string;
};

export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export type ApplicationState = {
  currentStep: number;
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  education: {
    ssc: EducationRow;
    hsc: EducationRow;
    graduation: EducationRow;
    postGraduation: EducationRow;
  };
  experience: ExperienceRow[];
  skills: {
    technicalSkills: string[];
    certifications: string;
  };
  additional: {
    coverLetter: string;
    resumeName: string;
    resumeType: string;
    resumeSize: number;
    resumeData: string;
  };
  stepStatus: Record<number, StepStatus>;
};

const initialState: ApplicationState = {
  currentStep: 1,
  personal: {
    fullName: '',
    email: '',
    phone: '',
    address: ''
  },
  education: {
    ssc: { school: '', board: '', cgpa: '', year: '' },
    hsc: { school: '', board: '', cgpa: '', year: '' },
    graduation: { school: '', board: '', cgpa: '', year: '' },
    postGraduation: { school: '', board: '', cgpa: '', year: '' }
  },
  experience: [{ id: 'exp-1', company: '', title: '', duration: '' }],
  skills: {
    technicalSkills: [],
    certifications: ''
  },
  additional: {
    coverLetter: '',
    resumeName: '',
    resumeType: '',
    resumeSize: 0,
    resumeData: ''
  },
  stepStatus: {
    1: 'in-progress',
    2: 'pending',
    3: 'pending',
    4: 'pending',
    5: 'pending',
    6: 'pending'
  }
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    updatePersonal(state, action: PayloadAction<ApplicationState['personal']>) {
      state.personal = action.payload;
    },
    updateEducation(state, action: PayloadAction<ApplicationState['education']>) {
      state.education = action.payload;
    },
    updateExperience(state, action: PayloadAction<ExperienceRow[]>) {
      state.experience = action.payload;
    },
    updateSkills(state, action: PayloadAction<ApplicationState['skills']>) {
      state.skills = action.payload;
    },
    updateAdditional(state, action: PayloadAction<ApplicationState['additional']>) {
      state.additional = action.payload;
    },
    setStepStatus(state, action: PayloadAction<{ step: number; status: StepStatus }>) {
      state.stepStatus[action.payload.step] = action.payload.status;
    },
    resetApplication() {
      return initialState;
    }
  }
});

export const {
  setCurrentStep,
  updatePersonal,
  updateEducation,
  updateExperience,
  updateSkills,
  updateAdditional,
  setStepStatus,
  resetApplication
} = applicationSlice.actions;

export default applicationSlice.reducer;
