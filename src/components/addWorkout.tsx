import { collection, Timestamp, addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db } from '../config/firebase';
import { Workout } from '../models/Workout';
import Grid from '@mui/material/Grid2';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { svSE } from '@mui/x-date-pickers/locales';
import { Colors } from '../shared/colors';

type AddWorkoutProps = {
  modalOpen: boolean;
  setModalClosed: () => void;
};

export const AddWorkout = (props: AddWorkoutProps) => {
  const [workoutList, setWorkoutList] = useState<Workout[]>();
  const [newWorkout, setNewWorkout] = useState<string>();
  const [newDuration, setNewDuration] = useState<string>();
  const [newDate, setNewDate] = useState<Timestamp | undefined>();
  const { modalOpen, setModalClosed } = props;

  const submitWorkout = async (userId: string | undefined) => {
    if (userId === undefined) {
      userId = 'tom';
    }
    const workoutRef = collection(db, 'users', userId, 'workouts'); //kopplar till användarens uid
    try {
      await addDoc(workoutRef, { workoutType: newWorkout, durationMinutes: newDuration, date: newDate?.toDate() });
    } catch (error) {
      console.error(error);
    }
    setModalClosed();
  };

  return (
    <Modal open={modalOpen} onClose={setModalClosed}>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          textAlign: 'center',
          padding: 1,
          borderRadius: '8px',
        }}
      >
        <Typography variant='h5' sx={{ padding: 1, backgroundColor: 'white' }}>
          Lägg till ny träning
        </Typography>
        <TextField sx={{ padding: 1 }} label='Typ av träning' placeholder='Träning' onChange={(e) => setNewWorkout(e.target.value)} />
        <TextField sx={{ padding: 1 }} label='Längd i minuter' placeholder='Tid' type='number' onChange={(e) => setNewDuration(e.target.value)} />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={dayjs.locale()}
          localeText={svSE.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <MobileDatePicker
            sx={{ padding: 1 }}
            onChange={(newValue) => {
              setNewDate(newValue);
            }}
            label='Datum'
            localeText={svSE.components.MuiLocalizationProvider.defaultProps.localeText}
          />
        </LocalizationProvider>
        <Button
          sx={{ display: 'flex', justifySelf: 'center', padding: 1, color: Colors.DARKPINK }}
          type='submit'
          onClick={() => submitWorkout(auth.currentUser?.uid)}
        >
          Spara
        </Button>
      </Box>
    </Modal>
  );
};
