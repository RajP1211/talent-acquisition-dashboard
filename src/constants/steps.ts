export type StepKey = 'personal' | 'education' | 'experience' | 'skills' | 'additional' | 'review';

export type StepConfig = {
  key: StepKey;
  title: string;
  description: string;
};

export const stepConfig: StepConfig[] = [
  {
    key: 'personal',
    title: 'Personal Information',
    description: 'Create the applicant profile and contact details.'
  },
  {
    key: 'education',
    title: 'Education',
    description: 'Capture full academic history across all qualifications.'
  },
  {
    key: 'experience',
    title: 'Work Experience',
    description: 'Add career history with company, title and duration.'
  },
  {
    key: 'skills',
    title: 'Skills & Qualifications',
    description: 'List core technical skills and certifications.'
  },
  {
    key: 'additional',
    title: 'Additional Information',
    description: 'Upload resume, cover letter and supporting details.'
  },
  {
    key: 'review',
    title: 'Review & Submit',
    description: 'Verify all entries and finalize the application.'
  }
];
