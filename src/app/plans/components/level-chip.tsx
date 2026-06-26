import { Chip } from '@mui/material';
import React from 'react';

function LevelChip({ title }: { title: string }) {
  const color =
    title === 'Beginner'
      ? 'success'
      : title === 'Intermediate'
        ? 'info'
        : 'error';
  return (
    <Chip title="test" label={title} color={color} sx={{ color: '#fff' }} />
  );
}

export default LevelChip;
