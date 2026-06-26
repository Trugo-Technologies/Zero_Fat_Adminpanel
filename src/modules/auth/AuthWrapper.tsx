import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import AppLogo from '@crema/components/AppLayout/components/AppLogo';

type AuthWrapperProps = {
  children: any;
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          maxWidth: 900,
          minHeight: { xs: 320, sm: 450 },
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '50%', lg: '40%' },
            padding: { xs: 5, lg: 10 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: { xs: 6, xl: 8 } }}>
              <Box
                sx={{
                  mb: 5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AppLogo />
              </Box>
            </Box>
            {children}
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: '100%', sm: '50%', lg: '60%' },
            position: 'relative',
            padding: { xs: 0, lg: '0' },
            display: { xs: 'none', sm: 'flex' },
            alignItems: { sm: 'center' },
            justifyContent: { sm: 'center' },
            flexDirection: { sm: 'column' },
            backgroundColor: '#a5d060a6',
            color: (theme) => theme.palette.common.white,
            fontSize: 14,
          }}
        >
          <Box
            sx={{
              maxWidth: '100%',
            }}
          >
            <img src='/assets/images/login.png' width='100%' />
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default AuthWrapper;
