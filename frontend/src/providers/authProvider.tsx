// AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback
} from 'react';

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  signInWithPopup
} from 'firebase/auth';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

import { SvgIcon } from '@mui/material';

import logo from '../assets/logo192.png';

const MicrosoftIcon = () => {
  return (
    <SvgIcon viewBox="0 0 88 88">
      <path
        fill="#F25022"
        d="M87.2,37.7H45.6V0H0v37.7h41.6v50.6h45.6V37.7L87.2,37.7z M4.1,4.1h37.7v33.5H4.1V4.1z M45.6,4.1h37.7v33.5H45.6V4.1z M4.1,45.6h37.7v37.7H4.1V45.6z M45.6,83.3h37.7V45.6H45.6V83.3L45.6,83.3z"
      />
    </SvgIcon>
  );
};

interface AuthContextInterface {
  user: User | null;
  signInWithGoogle: () => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  const signInWithGoogle = useCallback(async () => {
    const googleProvider = new GoogleAuthProvider();

    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [auth, setUser]);

  const signInWithMicrosoft = useCallback(async () => {
    const microsoftProvider = new OAuthProvider('microsoft.com');

    await signInWithPopup(auth, microsoftProvider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [auth, setUser]);

  const providerValue = useMemo(
    () => ({ user, signInWithGoogle, signInWithMicrosoft }),
    [user, signInWithGoogle, signInWithMicrosoft]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={providerValue}>
      {user ? (
        children
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
          }}
        >
          <Grid
            container
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '400px',
              flexDirection: 'column',
              gap: '20px',
              p: '20px',
              backgroundColor: theme.palette.grey[900],
              border: `solid 1px ${theme.palette.grey[800]}`,
              borderRadius: '10px',
              boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Grid sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 2 }}>
              <img
                src={logo}
                alt="Savant"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20%'
                }}
              />
              <Grid>
                <Typography variant="h4">Savant </Typography>
              </Grid>
            </Grid>
            <Typography>Please sign in:</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={signInWithGoogle}
            >
              Sign In with Google
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<MicrosoftIcon />}
              onClick={signInWithMicrosoft}
            >
              Sign In with Microsoft
            </Button>
          </Grid>
        </Box>
      )}
    </AuthContext.Provider>
  );
};
