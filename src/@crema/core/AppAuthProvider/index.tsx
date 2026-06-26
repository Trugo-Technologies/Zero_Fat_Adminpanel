import React, { ReactNode } from 'react';
import JWTAuthAuthProvider from 'src/@crema/services/auth/jwt-auth/JWTAuthProvider';

type Props = {
  children: ReactNode;
};

const AppAuthProvider = ({ children }: Props) => {
  return <JWTAuthAuthProvider>{children}</JWTAuthAuthProvider>;
};

export default AppAuthProvider;
