import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { additionalSchema } from '../../schemas/stepSchemas';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateAdditional } from '../../features/applicationSlice';
import { goToStep } from '../../features/applicationThunks';
import FormCard from '../common/FormCard';
import StepActions from '../common/StepActions';
import { useScrollToError } from '../../hooks/useScrollToError';

type AdditionalFormValues = {
  coverLetter: string;
  resumeName: string;
  resumeType: string;
  resumeSize: number;
  resumeData: string;
};

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Step5Additional() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector((state) => state.application.additional);

  const {
    control,
    register,
    setValue,
    setError,
    clearErrors,
    trigger,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AdditionalFormValues>({
    defaultValues,
    resolver: yupResolver(additionalSchema),
    mode: 'onTouched'
  });

  useScrollToError(control);

  const resumeName = watch('resumeName');
  const resumeType = watch('resumeType');
  const resumeSize = watch('resumeSize');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.info('No file selected');
      return;
    }

    const acceptedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!acceptedTypes.includes(file.type)) {
      setValue('resumeName', '', { shouldValidate: true });
      setValue('resumeType', '', { shouldValidate: true });
      setValue('resumeSize', 0, { shouldValidate: true });
      setValue('resumeData', '', { shouldValidate: true });
      setError('resumeName', {
        type: 'manual',
        message: 'Invalid file type. Please upload PDF, DOC, or DOCX.'
      });
      toast.error('Invalid file type. Only PDF, DOC, and DOCX are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValue('resumeName', '', { shouldValidate: true });
      setValue('resumeType', '', { shouldValidate: true });
      setValue('resumeSize', 0, { shouldValidate: true });
      setValue('resumeData', '', { shouldValidate: true });
      setError('resumeName', {
        type: 'manual',
        message: 'File exceeds size limit. Maximum 5MB allowed.'
      });
      toast.error('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }

    try {
      const data = await toBase64(file);
      setValue('resumeName', file.name, { shouldValidate: true });
      setValue('resumeType', file.type, { shouldValidate: true });
      setValue('resumeSize', file.size, { shouldValidate: true });
      setValue('resumeData', data, { shouldValidate: true });
      clearErrors(['resumeName', 'resumeType', 'resumeSize', 'resumeData']);
      await trigger(['resumeName', 'resumeType', 'resumeSize', 'resumeData']);
      toast.success(`Resume uploaded successfully! (${(file.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      toast.error('Failed to read file. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    setValue('resumeName', '', { shouldValidate: true });
    setValue('resumeType', '', { shouldValidate: true });
    setValue('resumeSize', 0, { shouldValidate: true });
    setValue('resumeData', '', { shouldValidate: true });
    clearErrors(['resumeName', 'resumeType', 'resumeSize', 'resumeData']);
    toast.info('Resume removed. Please upload a new file if needed.');
  };

  const onSubmit = async (values: AdditionalFormValues) => {
    // Double-check resume is uploaded before submitting
    if (!values.resumeName || !values.resumeData) {
      toast.error('Resume is required. Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (!values.coverLetter?.trim()) {
      toast.error('Cover letter is required. Please provide at least 50 characters.');
      return;
    }

    dispatch(updateAdditional(values));
    const result = await dispatch(goToStep(6));
    if (result.ok) {
      toast.success('Step saved successfully!');
    } else {
      toast.error('Failed to save step. Please try again.');
    }
  };

  const onError = () => {
    // Check for specific resume errors
    if (!resumeName) {
      toast.error('Resume upload is required. Please select a PDF, DOC, or DOCX file.');
    } else if (uploadErrorMessage) {
      toast.error(`Error: ${uploadErrorMessage}`);
    } else {
      toast.error('Please resolve all errors before moving on.');
    }
  };

  const uploadErrorMessage =
    errors.resumeName?.message ||
    errors.resumeType?.message ||
    errors.resumeSize?.message ||
    errors.resumeData?.message;

  const hasUploadError = Boolean(uploadErrorMessage);

  return (
    <FormCard>
      <Typography variant="h5" mb={1} fontWeight={800}>
        Additional Information
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Upload your resume and provide a strong cover letter to support your application.
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              component="label"
              sx={{
                display: 'block',
                p: 3,
                borderRadius: 3,
                border: '1px dashed',
                borderColor: hasUploadError ? 'error.main' : 'divider',
                backgroundColor: hasUploadError ? 'rgba(254, 226, 226, 0.4)' : 'background.paper',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background-color 0.2s ease'
              }}
            >
              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <Typography variant="subtitle1" fontWeight={700}>
                Upload Resume / CV
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Supported formats: PDF, DOC, DOCX. Maximum file size: 5MB.
              </Typography>
              {resumeName ? (
                <Typography variant="body2" color="text.primary" mt={2}>
                  Selected file: {resumeName}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Click to browse files.
                </Typography>
              )}
            </Box>
            {uploadErrorMessage ? (
              <Typography color="error" variant="body2" mt={1}>
                {uploadErrorMessage}
              </Typography>
            ) : null}
          </Grid>
          {resumeName ? (
            <Grid item xs={12}>
              <Box sx={{ px: 3, py: 2, borderRadius: 3, backgroundColor: 'grey.50' }}>
                <Typography variant="subtitle2" mb={1}>
                  Resume Preview
                </Typography>
                <Typography variant="body2">Name: {resumeName}</Typography>
                <Typography variant="body2">Type: {resumeType || 'N/A'}</Typography>
                <Typography variant="body2">Size: {(resumeSize / 1024).toFixed(1)} KB</Typography>
                <Button size="small" color="error" onClick={handleRemoveFile} sx={{ mt: 1 }}>
                  Remove file
                </Button>
              </Box>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Cover Letter"
              {...register('coverLetter')}
              error={Boolean(errors.coverLetter)}
              helperText={errors.coverLetter?.message}
            />
          </Grid>
        </Grid>
        <StepActions onBack={() => dispatch(goToStep(4))} onNext={handleSubmit(onSubmit, onError)} saving={isSubmitting} />
      </Box>
    </FormCard>
  );
}
