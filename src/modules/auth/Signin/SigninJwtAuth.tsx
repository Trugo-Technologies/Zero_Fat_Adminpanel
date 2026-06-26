import Button from '@mui/material/Button';
import { Checkbox, IconButton } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import AppInfoView from '@crema/components/AppInfoView';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useIntl } from 'react-intl';
import AppTextField from '@crema/components/AppFormComponents/AppTextField';
import { useJWTAuthActions } from '@crema/services/auth/jwt-auth/JWTAuthProvider';
import { Fonts } from '@crema/constants/AppEnums';
import AuthWrapper from '../AuthWrapper';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const SigninJwtAuth = () => {
  const navigate = useNavigate();
  const { signInUser } = useJWTAuthActions();
  const { messages } = useIntl();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validationSchema = yup.object({
    email: yup.string().email(String(messages['validation.emailFormat'])).required(String(messages['validation.emailRequired'])),
    password: yup.string().required(String(messages['validation.passwordRequired'])),
  });

  return (
    <AuthWrapper>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 5 }}>
          <Formik
            validateOnChange={true}
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              signInUser({
                email: data.email,
                password: data.password,
              });
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                <Box sx={{ mb: { xs: 5, xl: 8 } }}>
                  <AppTextField
                    placeholder={messages['common.email'] as string}
                    name='email'
                    label={<IntlMessages id='common.email' />}
                    variant='outlined'
                    fullWidth
                    
                    size='small'
                    sx={{
                    
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                        
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: { xs: 3, xl: 4 } }}>
                  <AppTextField
                    type={showPassword ? 'text' : 'password'}
                    size='small'
                    placeholder={messages['common.password'] as string}
                    label={<IntlMessages id='common.password' />}
                    name='password'
                    variant='outlined'
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleTogglePassword} edge='end' aria-label={showPassword ? 'Hide password' : 'Show password'}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    mb: { xs: 3, xl: 4 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox color='primary' sx={{ ml: -3 }} id='rememberMe' />
                    <Box
                      aria-labelledby='rememberMe'
                      component='span'
                      sx={{
                        color: 'grey.700',
                      }}
                    >
                      <IntlMessages id='common.rememberMe' />
                    </Box>
                  </Box>
                </Box>

                <div>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isSubmitting}
                    sx={{
                      minWidth: 160,
                      fontWeight: Fonts.REGULAR,
                      fontSize: 16,
                      textTransform: 'capitalize',
                      padding: '4px 16px 8px',
                    }}
                  >
                    <IntlMessages id='common.login' />
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>

        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default SigninJwtAuth;
