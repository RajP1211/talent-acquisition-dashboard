import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { educationSchema } from '../../schemas/stepSchemas';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateEducation } from '../../features/applicationSlice';
import { goToStep } from '../../features/applicationThunks';
import FormCard from '../common/FormCard';
import StepActions from '../common/StepActions';
import { useScrollToError } from '../../hooks/useScrollToError';

type EducationFormValues = {
  ssc: {
    school: string;
    board: string;
    cgpa: string;
    year: string;
  };
  hsc: {
    school: string;
    board: string;
    cgpa: string;
    year: string;
  };
  graduation: {
    school: string;
    board: string;
    cgpa: string;
    year: string;
  };
  postGraduation: {
    school: string;
    board: string;
    cgpa: string;
    year: string;
  };
};

const rows = [
  { id: 'ssc', label: 'SSC' },
  { id: 'hsc', label: 'HSC' },
  { id: 'graduation', label: 'Graduation' }
] as const;

export default function Step2Education() {
  const dispatch = useAppDispatch();
  const [showPostGraduation, setShowPostGraduation] = useState(false);

  const defaultValues = useAppSelector(
    (state) => state.application.education
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EducationFormValues>({
    defaultValues,
    resolver: yupResolver(educationSchema),
    mode: 'onSubmit'
  });

  useScrollToError(control);

  const onSubmit = async (values: EducationFormValues) => {
    if (!showPostGraduation) {
      values.postGraduation = {
        school: '',
        board: '',
        cgpa: '',
        year: ''
      };
    }

    dispatch(updateEducation(values));

    const result = await dispatch(goToStep(3));

    if (result.ok) {
      toast.success('Education details saved successfully');
    }
  };

  const onError = () => {
    toast.error('Please complete all required education fields.');
  };

  return (
    <FormCard>
      <Typography
        variant="h5"
        fontWeight={800}
        sx={{
          mb: 1,
          fontSize: {
            xs: '1.5rem',
            sm: '1.8rem',
            md: '2rem'
          }
        }}
      >
        Education History
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        Enter your academic background.
      </Typography>

      <FormControlLabel
        sx={{ mb: 2 }}
        control={
          <Checkbox
            checked={showPostGraduation}
            onChange={(e) =>
              setShowPostGraduation(e.target.checked)
            }
          />
        }
        label="I have completed Post Graduation"
      />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            overflowX: 'auto',
            boxShadow: 3,
            mb: 3,

            '& .MuiTable-root': {
              minWidth: 900
            }
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: 'action.hover'
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>
                  Qualification
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  School / Institute
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Board / University
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  CGPA / Percentage
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Passing Year
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {row.label}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter School"
                      {...register(`${row.id}.school` as const)}
                      error={Boolean(errors[row.id]?.school)}
                      helperText={
                        errors[row.id]?.school?.message
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter Board"
                      {...register(`${row.id}.board` as const)}
                      error={Boolean(errors[row.id]?.board)}
                      helperText={
                        errors[row.id]?.board?.message
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="CGPA / %"
                      {...register(`${row.id}.cgpa` as const)}
                      error={Boolean(errors[row.id]?.cgpa)}
                      helperText={
                        errors[row.id]?.cgpa?.message
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Year"
                      {...register(`${row.id}.year` as const)}
                      error={Boolean(errors[row.id]?.year)}
                      helperText={
                        errors[row.id]?.year?.message
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}

              {showPostGraduation && (
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={600}>
                      Post Graduation
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter Institute"
                      {...register('postGraduation.school')}
                      error={Boolean(
                        errors.postGraduation?.school
                      )}
                      helperText={
                        errors.postGraduation?.school?.message
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter University"
                      {...register('postGraduation.board')}
                      error={Boolean(
                        errors.postGraduation?.board
                      )}
                      helperText={
                        errors.postGraduation?.board?.message
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="CGPA / %"
                      {...register('postGraduation.cgpa')}
                      error={Boolean(
                        errors.postGraduation?.cgpa
                      )}
                      helperText={
                        errors.postGraduation?.cgpa?.message
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Year"
                      {...register('postGraduation.year')}
                      error={Boolean(
                        errors.postGraduation?.year
                      )}
                      helperText={
                        errors.postGraduation?.year?.message
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <StepActions
          onBack={() => dispatch(goToStep(1))}
          onNext={handleSubmit(onSubmit, onError)}
          saving={isSubmitting}
        />
      </Box>
    </FormCard>
  );
}