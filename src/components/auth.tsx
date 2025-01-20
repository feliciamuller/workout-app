import { useCallback, useState } from 'react';
import { auth, googleProvider } from '../config/firebase'; // auth håller information om vem som är inloggad
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { create } from 'domain';
import { sign } from 'crypto';
import Grid from '@mui/material/Grid2';
import { Box, Button, TextField } from '@mui/material';
import { LoggedIn } from './loggedIn';

// TODO: kolla hur man får auth att hålla användaren inloggad vid rendering
// TODO: lägga in collection för löpning, km, snitthastighet och längd

export const Auth = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null | undefined>('');

  const signInNewUser = async () => {
    // async/await för att vänta på promise från apiet
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  // FUNGERAR INTE, CORS BLOCKERAR POPUPFÖNSTER
  // const signInWithGoogle = async () => {
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     console.log('auth', auth);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {}
  };

  console.log('currentUser', auth.currentUser);
  console.log('isLoggedIn', isLoggedIn);
  return (
    <Grid container sx={{ gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2 }}>
        {!auth.currentUser && (
          <Box>
            <TextField placeholder='Email' onChange={(e) => setEmail(e.target.value)} sx={{ width: '100%', maxWidth: 400 }} />
            <TextField placeholder='Password' onChange={(e) => setPassword(e.target.value)} type='password' sx={{ width: '100%', maxWidth: 400 }} />
            <Button variant='contained' onClick={signInNewUser} sx={{ width: '100%', maxWidth: 400, backgroundColor: 'lavender', color: 'grey' }}>
              Logga in
            </Button>
          </Box>
        )}
      </Grid>
      <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2 }}>
        {!auth.currentUser && (
          <Box>
            <TextField placeholder='Email' onChange={(e) => setEmail(e.target.value)} sx={{ width: '100%', maxWidth: 400 }} />
            <TextField placeholder='Password' onChange={(e) => setPassword(e.target.value)} type='password' sx={{ width: '100%', maxWidth: 400 }} />
            <Button variant='contained' onClick={signInNewUser} sx={{ width: '100%', maxWidth: 400, backgroundColor: 'lavender', color: 'grey' }}>
              Skapa ny användare
            </Button>
          </Box>
        )}
      </Grid>
      {/* <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', padding: 2, alignItems: 'center', gap: 2 }}>
        {!auth.currentUser && (
          <Button variant='contained' onClick={signInWithGoogle} sx={{ width: '100%', maxWidth: 400, backgroundColor: 'lavender', color: 'grey' }}>
            Logga in med google
          </Button>
        )}
      </Grid> */}
      {auth.currentUser && (
        <Box>
          <LoggedIn />
          <Button variant='contained' onClick={signOutUser} sx={{ width: '100%', maxWidth: 400, backgroundColor: 'lavender', color: 'grey' }}>
            Logga ut
          </Button>
        </Box>
      )}
    </Grid>
  );
};
