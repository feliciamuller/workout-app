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

export const LoggedIn = () => {
  const [showWorkouts, setShowWorkouts] = useState<boolean>(false);
  const [showAddWorkouts, setShowAddWorkouts] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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
  // denna sida kommer bli som menysida med olika dashboards och alterantiv
  return (
    <Box>
      {showWorkouts ? (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={12} sx={{ gridAutoRows: '200px' }}>
            <DisplayExercises />
            <Button onClick={handleBackClick} sx={{ color: Colors.GREEN }}>
              Gå tillbaka
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={1} sx={{ mb: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid size={6} sx={{ maxWidth: 400 }}>
              <Button
                onClick={handleWorkoutClick}
                sx={{
                  backgroundColor: Colors.DARKPINK,
                  color: Colors.LIGHTPINK,
                  height: '100px',
                  ':hover': { backgroundColor: Colors.GREEN, color: Colors.WHITE },
                }}
              >
                Visa träningsstatistik
              </Button>
            </Grid>
            <Grid size={6} sx={{ maxWidth: 400 }}>
              <Button
                onClick={handleAddWorkoutClick}
                sx={{
                  backgroundColor: Colors.LIGHTPINK,
                  color: Colors.DARKPINK,
                  height: '100px',
                  ':hover': { backgroundColor: Colors.GREEN, color: Colors.LIGHTPINK },
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
