import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { goToStep, submitApplication } from '../../features/applicationThunks';
import { resetApplication } from '../../features/applicationSlice';
import FormCard from '../common/FormCard';

export default function Step6Review() {
  const dispatch = useAppDispatch();
  const application = useAppSelector((state) => state.application);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const completed = [1, 2, 3, 4, 5].every((step) => application.stepStatus[step] === 'completed');

  const onSubmit = async () => {
    setSubmitting(true);
    const result = await dispatch(submitApplication());
    setSubmitting(false);

    if (result.ok) {
      toast.success('Application submitted successfully!');
      setConfirmationOpen(true);
      return;
    }

    toast.error('Please complete required fields before submitting.');
    if (result.step) {
      dispatch(goToStep(result.step));
    }
  };

  const closeConfirmation = () => {
    dispatch(resetApplication());
    dispatch(goToStep(1));
    setConfirmationOpen(false);
  };

  return (
    <FormCard>
      <Typography variant="h5" mb={1} fontWeight={800}>
        Review & Submit
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Review each section below and submit once all details are complete.
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper' }} elevation={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              Personal Details
            </Typography>
            <Button size="small" onClick={() => dispatch(goToStep(1))}>
              Edit
            </Button>
          </Stack>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>Name</Typography>
              <Typography>{application.personal.fullName || 'Not provided'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>Email</Typography>
              <Typography>{application.personal.email || 'Not provided'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>Phone</Typography>
              <Typography>{application.personal.phone || 'Not provided'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>Address</Typography>
              <Typography>{application.personal.address || 'Not provided'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper' }} elevation={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              Education Summary
            </Typography>
            <Button size="small" onClick={() => dispatch(goToStep(2))}>
              Edit
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {(['ssc', 'hsc', 'graduation', 'postGraduation'] as const).map((key) => {
              const record = application.education[key];
              const label = key === 'ssc' ? 'SSC' : key === 'hsc' ? 'HSC' : key === 'graduation' ? 'Graduation' : 'Post Graduation';
              return (
                <Grid item xs={12} md={6} key={key}>
                  <Typography variant="body2" fontWeight={600}>{label}</Typography>
                  <Typography>{record.school || '—'} • {record.board || '—'} • {record.cgpa || '—'} • {record.year || '—'}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper' }} elevation={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              Work Experience
            </Typography>
            <Button size="small" onClick={() => dispatch(goToStep(3))}>
              Edit
            </Button>
          </Stack>
          <Stack spacing={2}>
            {application.experience.map((item) => (
              <Box key={item.id}>
                <Typography variant="body2" fontWeight={600}>{item.company || 'Untitled employer'}</Typography>
                <Typography>{item.title || 'No title'} • {item.duration || 'No duration provided'}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper' }} elevation={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              Skills & Certifications
            </Typography>
            <Button size="small" onClick={() => dispatch(goToStep(4))}>
              Edit
            </Button>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {application.skills.technicalSkills.length > 0 ? (
              application.skills.technicalSkills.map((skill) => (
                <Chip key={skill} label={skill} color="primary" variant="outlined" />
              ))
            ) : (
              <Typography color="text.secondary">No skills added yet.</Typography>
            )}
          </Box>
          <Typography variant="body2">{application.skills.certifications || 'No certifications added yet.'}</Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper' }} elevation={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={700}>
              Additional Information
            </Typography>
            <Button size="small" onClick={() => dispatch(goToStep(5))}>
              Edit
            </Button>
          </Stack>
          <Typography variant="body2" mb={1} fontWeight={600}>
            Resume
          </Typography>
          <Typography>{application.additional.resumeName || 'No resume uploaded'}</Typography>
          <Typography variant="body2" mt={2} fontWeight={600}>
            Cover Letter
          </Typography>
          <Typography color="text.secondary">
            {application.additional.coverLetter || 'No cover letter provided.'}
          </Typography>
        </Paper>
      </Stack>

      <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Button variant="outlined" onClick={() => dispatch(goToStep(5))} disabled={submitting}>
          Back
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={!completed || submitting}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </Box>

      <Dialog open={confirmationOpen} onClose={closeConfirmation} aria-labelledby="thank-you-dialog-title">
        <DialogTitle id="thank-you-dialog-title">Application Successfully Submitted</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you for submitting your application. Your details have been recorded and the recruitment team will review your profile shortly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmation} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FormCard>
  );
}
