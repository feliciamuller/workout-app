import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, addDoc, Timestamp, onSnapshot } from 'firebase/firestore'; //hämtar alla dokument från databasen
import { Workout } from '../models/Workout';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, DatePickerToolbar, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { svSE } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import { AddWorkout } from './addWorkout';
import { EditWorkout } from './editWorkout';

export const DisplayExercises = () => {
  const [workoutList, setWorkoutList] = useState<Workout[]>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  const workoutRef = collection(db, 'workout');
  // SKULLE BEHÖVA KOLLA PÅ PRESTANDAN
  // är snapshot bäst eller vanligt promise

  // useEffect(() => {
  //   const getExerciseList = async () => {
  //     // läsa in datan
  //     try {
  //       const data = await getDocs(workoutRef);
  //       console.log('doc data', typeof data.docs.map((data) => data.data));
  //       // filtrerar ut datan från databasen och id
  //       const filteredData = data.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       })) as Workout[]; // för att kunna typsäkra
  //       setWorkoutList(filteredData);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getExerciseList();
  // }, []);

  useEffect(() => {
    //realtidsuppdatering vilket gör att när datan ändras uppdateras det automatiskt
    const unsubscribe = onSnapshot(workoutRef, (snapshot) => {
      try {
        const updatedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Workout[]; // Typa datan som Workout[]
        setWorkoutList(updatedData);
      } catch (error) {
        console.error(error);
      }
    });
    return () => unsubscribe();
  }, []);
  const handleClick = () => {
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setEditModalOpen(false);
  };

  const handleEditClick = (item: Workout) => {
    setEditModalOpen(true);
    setSelectedWorkout(item);
  };
  {
    /*MÅNADSSTATISTIK borde läggas in */
  }
  return (
    <Grid container sx={{ flexDirection: 'column', border: '1px solid grey' }}>
      <TableContainer sx={{ backgroundColor: 'white' }}>
        <Table sx={{ color: 'grey' }}>
          <TableHead>
            <TableRow>
              <TableCell>Träning</TableCell>
              <TableCell align='left'>Längd</TableCell>
              <TableCell align='left'>Datum</TableCell>
              <TableCell align='left'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workoutList?.map((item) => (
              <TableRow key={item.id}>
                <TableCell align='left'>{item.workoutType}</TableCell>
                <TableCell align='left'>{item.durationMinutes}</TableCell>
                <TableCell align='left'>{item.date?.toDate().toLocaleDateString()}</TableCell>
                <Button onClick={() => handleEditClick(item)}>Editera</Button>
                {selectedWorkout === item && <EditWorkout editModalOpen={editModalOpen} setEditModalClosed={handleClose} selected={item} />}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleClick}>Ny träning</Button>
      <AddWorkout modalOpen={modalOpen} setModalClosed={handleClose} />
    </Grid>
  );
};
