import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { svSE } from '@mui/x-date-pickers/locales';
import { Workout } from '../models/Workout';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

type EditWorkoutProps = {
  editModalOpen: boolean;
  setEditModalClosed: () => void;
  selected: Workout;
};

export const EditWorkout = (props: EditWorkoutProps) => {
  const workoutRef = collection(db, 'workout');

  const { editModalOpen, setEditModalClosed, selected } = props;
  // const [editWorkoutType, setEditWorkoutType] = useState<string | undefined>();
  // const [editDuration, setEditDuration] = useState<number | undefined>();
  // const [editDate, setEditDate] = useState<Timestamp | undefined>();
  // const [currentWorkoutType, setCurrentWorkoutType] = useState<string>();
  const [valueDuration, setValueDuration] = useState<string>();
  const [valueDate, setValueDate] = useState<Timestamp>();
  const [valueWorkoutType, setValueWorkoutType] = useState<string>();

  // denna körs när man klickar in sig på en ny workout = ny selected
  useEffect(() => {
    setValueDate(selected.date);
    console.log(selected.date);
    setValueDuration(selected.durationMinutes);
    setValueWorkoutType(selected.workoutType);
  }, [selected]);

  const handleDeleteClick = async (selected: Workout) => {
    try {
      const workoutDoc = doc(db, 'workout', selected.id);
      await deleteDoc(workoutDoc);
    } catch (error) {
      console.error(error);
    }
    setEditModalClosed();
  };

  const handleEditClick = async (selected: Workout) => {
    try {
      const workoutDoc = doc(db, 'workout', selected.id);
      await updateDoc(workoutDoc, {
        workoutType: valueWorkoutType,
        durationMinutes: valueDuration,
        date: valueDate?.toDate(),
      });
    } catch (error) {
      console.error(error);
    }
    setEditModalClosed();
  };

  return (
    <Modal open={editModalOpen} onClose={setEditModalClosed}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          textAlign: 'center',
          padding: 1,
          borderRadius: '8px',
        }}
      >
        <Typography variant='h5' sx={{ padding: 1 }}>
          Editera träningspass
        </Typography>
        <TextField
          sx={{ padding: 1 }}
          label='Typ av träning'
          placeholder='Träning'
          onClick={() => setValueWorkoutType('')}
          onChange={(e) => setValueWorkoutType(e.target.value)}
          value={valueWorkoutType}
        />
        <TextField
          sx={{ padding: 1 }}
          label='Längd i minuter'
          placeholder='Tid'
          type='number'
          onClick={() => setValueDuration('')}
          onChange={(e) => setValueDuration(e.target.value)}
          value={valueDuration}
        />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={dayjs.locale()}
          localeText={svSE.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <MobileDatePicker
            sx={{ padding: 1 }}
            label='Datum'
            localeText={svSE.components.MuiLocalizationProvider.defaultProps.localeText}
            onChange={(newValue) => setValueDate(newValue)}
            // TODO: behöver kolla hur jag skriver ut det befintliga datumet
            // value={valueDate}
          />
        </LocalizationProvider>
        <Button onClick={() => handleEditClick(selected)} sx={{ display: 'flex', justifySelf: 'center', padding: 1 }} type='submit'>
          Spara
        </Button>
        <Button type='submit' onClick={() => handleDeleteClick(selected)}>
          Radera aktivitet
        </Button>
      </Box>
    </Modal>
  );
};
