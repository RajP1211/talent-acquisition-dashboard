import { Box, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { personalSchema } from '../../schemas/stepSchemas';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updatePersonal } from '../../features/applicationSlice';
import { goToStep } from '../../features/applicationThunks';
import FormCard from '../common/FormCard';
import StepActions from '../common/StepActions';
import { useScrollToError } from '../../hooks/useScrollToError';

type PersonalFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export default function Step1Personal() {
  const dispatch = useAppDispatch();

  const defaultValues = useAppSelector(
    (state) => state.application.personal
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PersonalFormValues>({
    defaultValues,
    resolver: yupResolver(personalSchema),
    mode: 'onTouched'
  });

  useScrollToError(control);

  const onSubmit = async (
    values: PersonalFormValues
  ) => {
    dispatch(updatePersonal(values));

    const result = await dispatch(goToStep(2));

    if (result.ok) {
      toast.success('Step saved successfully');
    }
  };

  const onError = () => {
    toast.error(
      'Please complete all required fields.'
    );
  };

  return (
    <FormCard>
      <Typography
        variant="h5"
        mb={1}
        fontWeight={800}
        sx={{
          fontSize: {
            xs: '1.5rem',
            sm: '1.8rem',
            md: '2rem'
          }
        }}
      >
        Personal Information
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
        sx={{
          fontSize: {
            xs: '0.875rem',
            md: '1rem'
          }
        }}
      >
        Add your full contact details so the hiring
        team can reach you.
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Grid
          container
          spacing={{
            xs: 2,
            md: 3
          }}
        >
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter your full name"
              {...register('fullName')}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="Enter your phone number"
              {...register('phone')}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Current Address"
              placeholder="Enter your current address"
              {...register('address')}
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <StepActions
            onNext={handleSubmit(
              onSubmit,
              onError
            )}
            saving={isSubmitting}
          />
        </Box>
      </Box>
    </FormCard>
  );
}