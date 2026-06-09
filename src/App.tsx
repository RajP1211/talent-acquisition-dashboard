import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from './app/hooks';

import Step1Personal from './components/steps/Step1Personal';
import Step2Education from './components/steps/Step2Education';
import Step3Experience from './components/steps/Step3Experience';
import Step4Skills from './components/steps/Step4Skills';
import Step5Additional from './components/steps/Step5Additional';
import Step6Review from './components/steps/Step6Review';

import { stepConfig } from './constants/steps';
import { goToStep } from './features/applicationThunks';

const stepComponents = [
  <Step1Personal key="personal" />,
  <Step2Education key="education" />,
  <Step3Experience key="experience" />,
  <Step4Skills key="skills" />,
  <Step5Additional key="additional" />,
  <Step6Review key="review" />
];

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useAppDispatch();

  const currentStep = useAppSelector(
    (state) => state.application.currentStep
  );

  const stepStatus = useAppSelector(
    (state) => state.application.stepStatus
  );

  const completedCount = useMemo(
    () =>
      Object.values(stepStatus).filter(
        (status) => status === 'completed'
      ).length,
    [stepStatus]
  );

  const progress = Math.round(
    (completedCount / (stepConfig.length - 1)) * 100
  );

  const activeStep = currentStep - 1;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 6 },
        background:
          'linear-gradient(180deg, #eef3fb 0%, #f8fbff 100%)'
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 }
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            fontWeight={800}
            gutterBottom
          >
            Talent Acquisition Dashboard
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              fontSize: {
                xs: '0.95rem',
                md: '1rem'
              }
            }}
          >
            Build a complete applicant profile with secure persistence, step validation and enterprise-grade UX.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          
          {/* LEFT PANEL */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                position: {
                  xs: 'static',
                  md: 'sticky'
                },
                top: 24,
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                boxShadow: 6,
                background:
                  'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* PROGRESS HEADER */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                  >
                    Application Progress
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Step {currentStep} of {stepConfig.length}
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  color="text.secondary"
                >
                  {progress}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 3
                }}
              />

              {/* MOBILE UI */}
              {isMobile ? (
                <Grid container spacing={1}>
                  {stepConfig.map((step, index) => {
                    const status =
                      stepStatus[index + 1] || 'pending';

                    const isActive =
                      currentStep === index + 1;

                    return (
                      <Grid item xs={4} key={step.key}>
                        <Box
                          onClick={() =>
                            dispatch(goToStep(index + 1))
                          }
                          sx={{
                            cursor: 'pointer',
                            p: 1.5,
                            borderRadius: 2,
                            textAlign: 'center',
                            bgcolor:
                              status === 'completed'
                                ? 'success.main'
                                : isActive
                                ? 'primary.main'
                                : 'grey.200',
                            color:
                              status === 'completed' ||
                              isActive
                                ? '#fff'
                                : 'text.primary'
                          }}
                        >
                          <Typography fontWeight={700}>
                            {index + 1}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {step.title}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                /* DESKTOP STEPPEr */
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  nonLinear
                >
                  {stepConfig.map((step, index) => {
                    const status =
                      stepStatus[index + 1] || 'pending';

                    return (
                      <Step
                        key={step.key}
                        completed={status === 'completed'}
                      >
                        <StepLabel
                          error={status === 'error'}
                          onClick={() =>
                            dispatch(goToStep(index + 1))
                          }
                          sx={{ cursor: 'pointer' }}
                        >
                          {step.title}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              )}
            </Paper>
          </Grid>

          {/* RIGHT PANEL */}
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ width: '100%' }}>
              {stepComponents[activeStep]}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;