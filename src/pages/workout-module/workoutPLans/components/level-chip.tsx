import { Chip } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';

function LevelChip({ title }: { title: string }) {
  const { messages } = useIntl();
  const color = title === 'Beginner' ? 'success' : title === 'Intermediate' ? 'info' : 'error';
  return <Chip title='test' size='small' label={messages[title] as string} color={color} sx={{ color: '#fff' }} />;
}

export default LevelChip;
