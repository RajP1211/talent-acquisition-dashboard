import { Box, Button, CircularProgress } from '@mui/material';
import React from 'react';

type StepActionsProps = {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  saving?: boolean;
};

export default function StepActions({
  onBack,
  onNext,
  backLabel = 'Previous',
  nextLabel = 'Next',
  nextDisabled,
  saving
}: StepActionsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'center', sm: 'flex-end' },
        mt: 4,
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {onBack && (
          <Button variant="outlined" onClick={onBack} disabled={saving} sx={{ minWidth: 140 }}>
            {backLabel}
          </Button>
        )}
        <Button variant="contained" onClick={onNext} disabled={nextDisabled || saving} sx={{ minWidth: 140 }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : nextLabel}
        </Button>
      </Box>
    </Box>
  );
}
