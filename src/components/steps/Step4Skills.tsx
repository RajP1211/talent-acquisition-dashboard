import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { skillsSchema } from '../../schemas/stepSchemas';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateSkills } from '../../features/applicationSlice';
import { goToStep } from '../../features/applicationThunks';
import FormCard from '../common/FormCard';
import StepActions from '../common/StepActions';
import { useScrollToError } from '../../hooks/useScrollToError';

type SkillsFormValues = {
  technicalSkills: string[];
  certifications: string;
};

export default function Step4Skills() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(
    (state) => state.application.skills
  );

  const [skillInput, setSkillInput] = useState('');

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SkillsFormValues>({
    defaultValues,
    resolver: yupResolver(skillsSchema),
    mode: 'onTouched'
  });

  useScrollToError(control);

  useEffect(() => {
    register('technicalSkills');
  }, [register]);

  const skills = watch('technicalSkills') || [];

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) {
      toast.error('Please enter a skill');
      return;
    }

    if (skills.includes(value)) {
      toast.error('Skill already added');
      return;
    }

    setValue(
      'technicalSkills',
      [...skills, value],
      {
        shouldValidate: true,
        shouldDirty: true
      }
    );

    setSkillInput('');
    toast.success('Skill added successfully');
  };

  const removeSkill = (index: number) => {
    setValue(
      'technicalSkills',
      skills.filter((_, i) => i !== index),
      {
        shouldValidate: true,
        shouldDirty: true
      }
    );

    toast.success('Skill removed successfully');
  };

  const onSubmit = async (values: SkillsFormValues) => {
    dispatch(updateSkills(values));

    const result = await dispatch(goToStep(5));

    if (result.ok) {
      toast.success('Step saved successfully');
    }
  };

  const onError = () => {
    toast.error(
      'Please add at least one skill and resolve highlighted errors.'
    );
  };

  return (
    <FormCard>
      <Typography variant="h5" mb={1} fontWeight={800}>
        Skills & Qualifications
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        Add key skills and certifications your application
        should highlight.
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Enter a technical skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="React, React Native, TypeScript"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '100%' }}
              onClick={addSkill}
            >
              Add Skill
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              {skills.map((skill, index) => (
                <Chip
                  key={`${skill}-${index}`}
                  label={skill}
                  onDelete={() => removeSkill(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            {errors.technicalSkills?.message && (
              <Typography
                variant="body2"
                color="error"
                mt={1}
              >
                {errors.technicalSkills.message}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Certifications & Training"
              {...register('certifications')}
              error={Boolean(errors.certifications)}
              helperText={errors.certifications?.message}
            />
          </Grid>
        </Grid>

        <StepActions
          onBack={() => dispatch(goToStep(3))}
          onNext={handleSubmit(onSubmit, onError)}
          saving={isSubmitting}
        />
      </Box>
    </FormCard>
  );
}