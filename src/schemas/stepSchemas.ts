import * as yup from 'yup';

export const personalSchema = yup.object({
  fullName: yup.string().trim().required('Full name is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9\s+-]{7,18}$/, 'Enter a valid phone number')
    .required('Phone is required'),
  address: yup.string().trim().required('Address is required')
});

export const educationRowSchema = yup.object({
  school: yup.string().trim().required('School / Institute is required'),
  board: yup.string().trim().required('Board / University is required'),
  cgpa: yup
    .string()
    .trim()
    .matches(/^(?:\d{1,2}(?:\.\d{1,2})?)$/, 'Enter a valid CGPA or percentage')
    .required('CGPA / Percentage is required'),
  year: yup
    .string()
    .trim()
    .matches(/^[0-9]{4}$/, 'Enter a valid year')
    .test('year-max', 'Passing year cannot be in the future', (value) => {
      if (!value) return false;
      return Number(value) <= new Date().getFullYear();
    })
    .required('Passing year is required')
});
export const postGraduation = yup.object({
  school: yup.string(),
  board: yup.string(),
  cgpa: yup.string(),
  year: yup.string()
}).notRequired()

export const educationSchema = yup.object({
  ssc: educationRowSchema,
  hsc: educationRowSchema,
  graduation: educationRowSchema,
  postGraduation: postGraduation
});

export const experienceSchema = yup
  .array()
  .of(
    yup.object({
      id: yup.string().required(),
      company: yup.string().trim().required('Company name is required'),
      title: yup.string().trim().required('Job title is required'),
      duration: yup.string().trim().required('Duration is required')
    })
  )
  .min(1, 'At least one experience row is required');

export const skillsSchema = yup.object({
  technicalSkills: yup.array().of(yup.string().trim().required()).min(1, 'Add at least one technical skill'),
  certifications: yup.string().trim()
});

export const additionalSchema = yup.object({
  coverLetter: yup.string().trim().min(50, 'Cover letter should be at least 50 characters').required('Cover letter is required'),
  resumeName: yup.string().trim().required('Resume upload is required'),
  resumeType: yup
    .string()
    .trim()
    .oneOf(
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      'Only PDF, DOC, DOCX files are accepted'
    )
    .required('Resume upload is required'),
  resumeSize: yup
    .number()
    .typeError('Resume upload is required')
    .max(5 * 1024 * 1024, 'File size must be under 5MB')
    .required('Resume upload is required'),
  resumeData: yup.string().trim().required('Resume upload is required')
});

export const formSchemas = {
  personal: personalSchema,
  education: educationSchema,
  experience: experienceSchema,
  skills: skillsSchema,
  additional: additionalSchema
};
