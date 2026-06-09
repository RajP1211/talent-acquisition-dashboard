import React from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateExperience } from '../../features/applicationSlice';
import { goToStep } from '../../features/applicationThunks';
import FormCard from '../common/FormCard';
import StepActions from '../common/StepActions';
import { useScrollToError } from '../../hooks/useScrollToError';

const experienceSchema = yup.object({
  experience: yup.array().of(
    yup
      .object({
        id: yup.string().required(),
        company: yup.string().default(''),
        title: yup.string().default(''),
        duration: yup.string().default('')
      })
      .test(
        'complete-row',
        'Please fill Company, Job Title and Duration',
        (value) => {
          if (!value) return true;

          const company = value.company?.trim();
          const title = value.title?.trim();
          const duration = value.duration?.trim();

          if (!company && !title && !duration) {
            return true;
          }

          return Boolean(company && title && duration);
        }
      )
  )
});

type ExperienceFormValues = {
  experience: Array<{
    id: string;
    company: string;
    title: string;
    duration: string;
  }>;
};

export default function Step3Experience() {
  const dispatch = useAppDispatch();

  const defaultValues = useAppSelector((state) => ({
    experience: state.application.experience || []
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ExperienceFormValues>({
    defaultValues,
    resolver: yupResolver(experienceSchema),
    mode: 'onTouched'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  useScrollToError(control);

  const handleAddRow = () => {
    append({
      id: `exp-${Date.now()}`,
      company: '',
      title: '',
      duration: ''
    });

    toast.success('Experience row added');
  };

  const handleRemoveRow = (index: number) => {
    remove(index);
    toast.success('Experience row removed');
  };

  const onSubmit = async (values: ExperienceFormValues) => {
    const cleanedExperience = values.experience.filter((item) => {
      return (
        item.company?.trim() ||
        item.title?.trim() ||
        item.duration?.trim()
      );
    });

    dispatch(updateExperience(cleanedExperience));

    const result = await dispatch(goToStep(4));

    if (result.ok) {
      toast.success('Step saved successfully');
    }
  };

  const onError = () => {
    toast.error(
      'If you add an experience row, please complete all fields.'
    );
  };

  return (
    <FormCard>
      <Typography
        fontWeight={800}
        sx={{
          mb: 1,
          fontSize: {
            xs: '1.5rem',
            sm: '1.75rem',
            md: '2rem'
          }
        }}
      >
        Work Experience
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        Work experience is optional. Add entries only if applicable.
      </Typography>

      {fields.length === 0 && (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            textAlign: 'center',
            mb: 2
          }}
        >
          <Typography color="text.secondary">
            No work experience added yet. Freshers can skip this section.
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              boxShadow: {
                xs: 1,
                md: 2
              }
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Company"
                  {...register(`experience.${index}.company`)}
                  error={Boolean(errors.experience?.[index])}
                  helperText={
                    errors.experience?.[index]?.message || ''
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Job Title"
                  {...register(`experience.${index}.title`)}
                />
              </Grid>

              <Grid item xs={12} sm={8} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Duration"
                  placeholder="Jan 2023 - Dec 2024"
                  {...register(`experience.${index}.duration`)}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={1}
                sx={{
                  display: 'flex',
                  justifyContent: {
                    xs: 'flex-end',
                    md: 'center'
                  },
                  alignItems: 'center'
                }}
              >
                <IconButton
                  color="error"
                  onClick={() => handleRemoveRow(index)}
                  aria-label="Remove experience row"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>

      <Box
        mt={3}
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row'
          },
          gap: 2,
          alignItems: {
            xs: 'stretch',
            sm: 'center'
          }
        }}
      >
        <Button
          startIcon={<AddCircleOutlineIcon />}
          variant="outlined"
          onClick={handleAddRow}
          sx={{
            width: {
              xs: '100%',
              sm: 'auto'
            }
          }}
        >
          Add Experience
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Optional for freshers.
        </Typography>
      </Box>

      <Box
        mt={3}
        sx={{
          '& button': {
            minHeight: 44
          }
        }}
      >
        <StepActions
          onBack={() => dispatch(goToStep(2))}
          onNext={handleSubmit(onSubmit, onError)}
          saving={isSubmitting}
        />
      </Box>
    </FormCard>
  );
}