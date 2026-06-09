import { Paper, PaperProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid rgba(255,255,255,0.78)',
  boxShadow: theme.shadows[5],
  backdropFilter: 'blur(18px)',
  minHeight: 360,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

type FormCardProps = {
  children: ReactNode;
  sx?: PaperProps['sx'];
};

export default function FormCard({ children, sx }: FormCardProps) {
  return <GlassPaper sx={sx}>{children}</GlassPaper>;
}
