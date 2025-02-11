import { useCallback, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase'; // auth håller information om vem som är inloggad
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import Grid from '@mui/material/Grid2';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LoggedIn } from './loggedIn';
import { Colors } from '../shared/colors';

// TODO: kolla hur man får auth att hålla användaren inloggad vid rendering
// TODO: lägga in collection för löpning, km, snitthastighet och längd

export const Auth = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null | undefined>('');
  const [errorMessageLogin, setErrorMessageLogin] = useState<boolean>(false);
  const [errorMessageNewUser, setErrorMessageNewUser] = useState<boolean>(false);
  const [user, setUser] = useState();
  const [userId, setUserId] = useState<string | undefined>(auth.currentUser?.uid);

  useEffect(() => {
    // lyssnar om användaren loggat in/ut
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid); // sätter userID
      } else {
        setIsLoggedIn(false);
        setUserId(undefined);
      }
    });
    // Avregistrera lyssnaren när komponenten unmountas eller auth ändras
    return () => unsubscribe();
  }, []);

  const signInNewUser = async () => {
    // async/await för att vänta på promise från apiet
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setErrorMessageNewUser(false);
      //auth håller all information om current user, även vid rendering av sidan
    } catch (error) {
      setErrorMessageNewUser(true);
      console.error(error);
    }
  };
  // TODO BUGG: HAR MAN SKAPAT NY ANVÄNDARE OCH DEN FINNS REDAN SÅ KAN MAN INTE LOGGA IN MED NÅGON ANNAN ANVÄNDARE ÄN DEN MAN FÖRSÖKTE SKAPA ANVÄNDARE MED
  const signInUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setErrorMessageLogin(false);
      setErrorMessageNewUser(false);
    } catch (error) {
      console.error('Fel vid inloggning', error);
      setErrorMessageLogin(true);
    }
  };

  // FUNGERAR INTE, CORS BLOCKERAR POPUPFÖNSTER
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
      setErrorMessageLogin(false);
    } catch (error) {
      console.error(error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserId(undefined); // Se till att användar-id tas bort vid utloggning
    } catch (error) {
      console.error('Fel vid utloggning', error);
    }
  };

  return (
    <Box>
      {isLoggedIn ? (
        <Box sx={{ padding: 1 }}>
          <Grid container sx={{ mb: 1, display: 'flex', alignItems: 'center', marginLeft: { xs: '0px', sm: '80px', md: '80px', lg: '80px' } }}>
            <Grid sx={{ display: 'flex', justifyContent: 'center', padding: 1, alignItems: 'center', margin: 'auto' }}>
              <Typography
                variant='h2'
                sx={{
                  // position: 'fixed',
                  color: Colors.DARKGREEN,
                  textAlign: 'center',
                  fontSize: { xs: '1.3rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
                }}
              >
                Välkommen {auth?.currentUser?.displayName}
              </Typography>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant='contained'
                onClick={() => signOutUser()}
                sx={{
                  fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '12px' },
                  backgroundColor: Colors.GREEN,
                  color: Colors.WHITE,
                  padding: 1,
                  height: { xs: '40px', sm: '40px', md: '40px', lg: '40px' },
                  width: { xs: '40px', sm: '80px', md: '80px', lg: '80px' },
                }}
              >
                LOGGA UT
              </Button>
            </Grid>
          </Grid>
          <LoggedIn />
        </Box>
      ) : (
        <Grid container sx={{ gap: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2 }}>
            {!auth.currentUser && !isLoggedIn && (
              <Box>
                <TextField
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: '100%', maxWidth: 400, borderRadius: '5px', backgroundColor: Colors.WHITE, marginBottom: 1 }}
                />
                <TextField
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  sx={{ width: '100%', maxWidth: 400, borderRadius: '5px', backgroundColor: Colors.WHITE, marginBottom: 1 }}
                />
                <Button
                  variant='contained'
                  onClick={signInUser}
                  sx={{ width: '100%', maxWidth: 400, backgroundColor: Colors.DARKPINK, color: Colors.WHITE }}
                >
                  Logga in
                </Button>
              </Box>
            )}
            {errorMessageLogin && !auth.currentUser && (
              <Box>
                <Typography sx={{ color: Colors.DARKGREEN }}>Fel användarnamn eller lösenord</Typography>
              </Box>
            )}
          </Grid>
          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2 }}>
            {!auth.currentUser && (
              <Box>
                <TextField
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: '100%', maxWidth: 400, borderRadius: '5px', backgroundColor: Colors.WHITE, marginBottom: 1 }}
                />
                <TextField
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  sx={{ width: '100%', maxWidth: 400, borderRadius: '5px', backgroundColor: Colors.WHITE, marginBottom: 1 }}
                />
                <Button
                  variant='contained'
                  onClick={signInNewUser}
                  sx={{ width: '100%', maxWidth: 400, backgroundColor: Colors.DARKPINK, color: Colors.WHITE }}
                >
                  Skapa ny användare
                </Button>
              </Box>
            )}
            {errorMessageNewUser && !auth.currentUser && (
              <Box>
                <Typography sx={{ color: Colors.DARKGREEN }}>Användare finns redan</Typography>
              </Box>
            )}
          </Grid>
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', padding: 2, alignItems: 'center', gap: 2 }}>
            {!auth.currentUser && (
              <Button
                variant='contained'
                onClick={signInWithGoogle}
                sx={{ width: '100%', maxWidth: 400, backgroundColor: Colors.DARKPINK, color: Colors.WHITE }}
              >
                Logga in med google
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
