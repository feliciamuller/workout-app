import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { Box, Button, Typography } from '@mui/material';
import { DisplayExercises } from './displayExercises';
import { AddWorkout } from './addWorkout';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Grid from '@mui/material/Grid2';
import { Colors } from '../shared/colors';
import { Calendar } from './calendar';
import { setuid } from 'process';
import { theme } from '../shared/theme';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export const LoggedIn = () => {
  const [showWorkouts, setShowWorkouts] = useState<boolean>(false);
  const [showAddWorkouts, setShowAddWorkouts] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleWorkoutClick = () => {
    setShowWorkouts(true);
    setModalOpen(false);
  };

  const handleBackClick = () => {
    setShowWorkouts(false);
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleAddWorkoutClick = () => {
    setShowAddWorkouts(true);
    setModalOpen(true);
  };

  return (
    <Box>
      {showWorkouts ? (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={12} sx={{ gridAutoRows: '200px' }}>
            <Button
              onClick={handleBackClick}
              sx={{
                color: Colors.DARKBROWN,
                padding: 1,
                height: { xs: '40px', sm: '40px', md: '40px', lg: '40px' },
                width: { xs: '40px', sm: '80px', md: '80px', lg: '80px' },
                display: 'flex',
                position: 'absolute',
                right: '58px',
                zIndex: 100,
                '@media (max-width: 900px)': {
                  right: '8px',
                },
              }}
            >
              <KeyboardBackspaceIcon />
            </Button>
            <DisplayExercises />
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Grid
            container
            spacing={1}
            sx={{
              mb: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '50px',
            }}
          >
            <Grid size={6} sx={{ maxWidth: 400 }}>
              <Button
                onClick={handleWorkoutClick}
                sx={{
                  backgroundColor: Colors.LIGHTYELLOW,
                  color: Colors.BROWN,
                  height: '100px',
                  ':hover': { backgroundColor: Colors.BROWN, color: Colors.LIGHTYELLOW },
                }}
              >
                Visa träningsstatistik
              </Button>
            </Grid>
            <Grid size={6} sx={{ maxWidth: 400 }}>
              <Button
                onClick={handleAddWorkoutClick}
                sx={{
                  backgroundColor: Colors.BROWN,
                  color: Colors.LIGHTYELLOW,
                  height: '100px',
                  ':hover': { backgroundColor: Colors.LIGHTYELLOW, color: Colors.BROWN },
                }}
              >
                Ny träning
              </Button>
            </Grid>
          </Grid>
          <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid size={12}>
              <Calendar />
            </Grid>
          </Grid>
        </Box>
      )}
      {modalOpen && <AddWorkout modalOpen={modalOpen} setModalClosed={handleClose} />}
    </Box>
  );
};
