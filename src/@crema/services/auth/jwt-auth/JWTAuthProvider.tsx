import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthUserType } from '@crema/types/models/AuthUser';
import jwtAxios, { setAuthToken } from './index';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { setToken } from 'src/config/axios';

interface JWTAuthContextProps {
  user: AuthUserType | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

interface SignInProps {
  email: string;
  password: string;
}

interface JWTAuthActionsProps {
  signUpUser: (data: SignUpProps) => void;
  signInUser: (data: SignInProps) => void;
  logout: () => void;
}

const JWTAuthContext = createContext<JWTAuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});
const JWTAuthActionsContext = createContext<JWTAuthActionsProps>({
  signUpUser: () => {},
  signInUser: () => {},
  logout: () => {},
});

export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

interface JWTAuthAuthProviderProps {
  children: ReactNode;
}

const JWTAuthAuthProvider: React.FC<JWTAuthAuthProviderProps> = ({ children }) => {
  const [firebaseData, setJWTAuthData] = useState<JWTAuthContextProps>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const infoViewActionsContext = useInfoViewActionsContext();

  useEffect(() => {
    const getAuthUser = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      setAuthToken(token);
      setToken(token);
      setJWTAuthData({
        ...firebaseData,
        //to edit when it's finished from backend
        user: { ...firebaseData, displayName: 'Admin' },
        isLoading: false,
        isAuthenticated: true,
      });
    };

    getAuthUser();
  }, []);

  const signInUser = async ({ email, password }: { email: string; password: string }) => {
    infoViewActionsContext.fetchStart();
    try {
      const { data } = await jwtAxios.post('/api/users-module/Authentication/login', { email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      setToken(data.data.token);

      // const res = await jwtAxios.get('/auth');
      setJWTAuthData({
        //to edit when finish from backend
        user: { ...firebaseData, displayName: 'Admin' },
        isAuthenticated: true,
        isLoading: false,
      });
      infoViewActionsContext.fetchSuccess();
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      infoViewActionsContext.fetchError('Something went wrong');
    }
  };

  const signUpUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    infoViewActionsContext.fetchStart();

    try {
      const { data } = await jwtAxios.post('users', { name, email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      const res = await jwtAxios.get('/auth');
      setJWTAuthData({
        user: res.data,
        isAuthenticated: true,
        isLoading: false,
      });
      infoViewActionsContext.fetchSuccess();
    } catch (error) {
      setJWTAuthData({
        ...firebaseData,
        isAuthenticated: false,
        isLoading: false,
      });
      infoViewActionsContext.fetchError('Something went wrong');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setAuthToken();
    setToken();

    setJWTAuthData({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...firebaseData,
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          signUpUser,
          signInUser,
          logout,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};
export default JWTAuthAuthProvider;
