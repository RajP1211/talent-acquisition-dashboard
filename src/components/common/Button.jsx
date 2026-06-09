import React from 'react';
import MuiButton from '@mui/material/Button';

export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  // Backwards-compatible variant mapping: 'primary'|'secondary' -> MUI variant/color
  let muiVariant = 'contained';
  let muiColor = 'primary';

  if (variant === 'secondary') {
    muiVariant = 'outlined';
    muiColor = 'primary';
  } else if (['text', 'link'].includes(variant)) {
    muiVariant = 'text';
    muiColor = 'primary';
  } else if (['contained', 'outlined'].includes(variant)) {
    muiVariant = variant;
  }

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
