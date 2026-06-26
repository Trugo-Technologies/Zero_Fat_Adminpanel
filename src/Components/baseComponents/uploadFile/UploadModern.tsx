import React from 'react';
import Box from '@mui/material/Box';
import { TiFolderOpen } from 'react-icons/ti';
import IntlMessages from 'src/@crema/helpers/IntlMessages';
import { useThemeContext } from 'src/@crema/context/AppContextProvider/ThemeContextProvider';

interface UploadModernProps {
  uploadText: string;
  dropzone: any;
}

const UploadModern: React.FC<UploadModernProps> = ({
  uploadText,
  dropzone,
}) => {
  const { theme } = useThemeContext();
  return (
    <Box
      sx={{
        position: 'relative',
        '& ul': {
          listStyle: 'none',
          padding: 0,
        },
      }}
    >
      <Box
        {...dropzone.getRootProps({ className: 'dropzone' })}
        sx={{
          cursor: 'pointer',
          border: (theme) => `dashed 2px ${theme.palette.divider}`,
          borderRadius: 2.5,
          // p: 5,
          textAlign: 'center',
          // mb: 4,
          color: 'text.secondary',
          backgroundColor: 'background.default',
          width: '100px',
          height: '100px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          // padding: "6px",
        }}
      >
        <input {...dropzone.getInputProps()} />
        <TiFolderOpen
          style={{
            fontSize: 40,
            marginBottom: 4,
            color: theme.palette.primary.main,
          }}
        />
        <p style={{ fontSize: '12px' }}>
          <IntlMessages id={uploadText} />
        </p>
      </Box>
    </Box>
  );
};

export default UploadModern;
