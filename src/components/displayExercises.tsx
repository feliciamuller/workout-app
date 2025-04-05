import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore'; //hämtar alla dokument från databasen
import { Workout } from '../models/Workout';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { EditWorkout } from './editWorkout';
import { Colors } from '../shared/colors';
import { BarChart } from '@mui/x-charts';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

export const DisplayExercises = () => {
  const [workoutList, setWorkoutList] = useState<Workout[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>(auth.currentUser?.uid);
  const [filteredWorkoutList, setFilteredWorkoutList] = useState<Workout[]>([]);
  const [filteredWorkout, setFilteredWorkout] = useState<string>('');
  // rules i databasen är att användare som skapat får ändra och läsa
  // SKULLE BEHÖVA KOLLA PÅ PRESTANDAN
  // är snapshot bäst eller vanligt promise

  useEffect(() => {
    // Nuvarande användaren
    const userId = auth.currentUser?.uid;
    // Om det inte finns någon userID
    if (!userId) {
      return;
    }
    // Referens till databasen och collection
    const workoutRef = collection(db, 'users', userId, 'workouts');

    // listening on changes in the database
    const unsubscribe = onSnapshot(workoutRef, (snapshot) => {
      try {
        const updatedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Workout[];
        setWorkoutList(updatedData);
      } catch (error) {
        console.error('error', error);
      }
    });
    return () => {
      // unregister listener to clean up
      unsubscribe();
    };
  }, [userId]);

  const handleClose = () => {
    setModalOpen(false);
    setEditModalOpen(false);
  };

  const handleEditClick = (item: Workout) => {
    setEditModalOpen(true);
    setSelectedWorkout(item);
  };

  const dataset = [
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 0).length,
      month: 'jan',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 1).length,
      month: 'feb',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 2).length,
      month: 'mar',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 3).length,
      month: 'apr',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 4).length,
      month: 'maj',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 5).length,
      month: 'jun',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 6).length,
      month: 'jul',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 7).length,
      month: 'aug',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 8).length,
      month: 'sep',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 9).length,
      month: 'okt',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 10).length,
      month: 'nov',
    },
    {
      totalWorkOutsPerMonth: workoutList?.filter((item) => item.date?.toDate().getMonth() === 11).length,
      month: 'dec',
    },
  ];

  // to filter workout
  const handleFilteredWorkout = (selected: string) => {
    console.log('selected', selected);
    if (selected) {
      if (selected === 'alla') {
        setFilteredWorkout('');
      } else {
        setFilteredWorkout(selected);
        const filtered = workoutList?.filter((item) => item.workoutType === selected);
        return setFilteredWorkoutList(filtered);
      }
    }
  };

  const workoutOptions = workoutList.filter((value, index, self) => self.findIndex((t) => t.workoutType === value.workoutType) === index);

  return (
    <Box>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Grid size={12} sx={{ minWidth: '400px', width: { lg: '60%', md: '100%', sm: '100%', xs: '100%' } }}>
          <BarChart
            sx={{ mb: 1 }}
            dataset={dataset}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'month',
              },
            ]}
            series={[{ dataKey: 'totalWorkOutsPerMonth' }]}
            height={290}
          />
        </Grid>
        <Grid size={12} sx={{ width: { lg: '60%', md: '100%', sm: '100%', xs: '100%' } }}>
          <TableContainer sx={{ backgroundColor: Colors.BEIGEWHITE, borderRadius: '10px' }}>
            <Table sx={{ color: 'grey' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      '@media (max-width: 400px)': {
                        paddingTop: '21px',
                      },
                    }}
                  >
                    Träning
                    <Select
                      sx={{
                        width: '80px',
                        height: '20px',
                        fontSize: '12px',
                        ml: '5px',
                        '@media (max-width: 400px)': {
                          ml: '0px',
                        },
                      }}
                      onChange={(event: SelectChangeEvent) => handleFilteredWorkout(event.target.value)}
                      value={filteredWorkout}
                    >
                      {workoutOptions?.map((item) => (
                        <MenuItem sx={{ fontSize: '12px' }} key={item.id} value={item.workoutType}>
                          {item.workoutType}
                        </MenuItem>
                      ))}
                      <MenuItem sx={{ fontSize: '12px' }} value={'Alla'}>
                        {'Alla'}
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{
                      '@media (max-width: 400px)': {
                        paddingTop: '0',
                      },
                    }}
                  >
                    Längd
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{
                      '@media (max-width: 400px)': {
                        paddingTop: '0', // Sätt ml till 0px på små skärmar
                      },
                    }}
                  >
                    Datum
                  </TableCell>
                  <TableCell align='left'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkout
                  ? filteredWorkoutList?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell align='left'>{item.workoutType.toLowerCase()}</TableCell>
                        <TableCell align='left'>{item.durationMinutes}</TableCell>
                        <TableCell align='left'>{item.date?.toDate().toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEditClick(item)} sx={{ color: Colors.BROWN }}>
                            <TuneOutlinedIcon />
                          </Button>
                        </TableCell>
                        {selectedWorkout === item && <EditWorkout editModalOpen={editModalOpen} setEditModalClosed={handleClose} selected={item} />}
                      </TableRow>
                    ))
                  : workoutList?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell align='left'>{item.workoutType}</TableCell>
                        <TableCell align='left'>{item.durationMinutes}</TableCell>
                        <TableCell align='left'>{item.date?.toDate().toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEditClick(item)} sx={{ color: Colors.BROWN }}>
                            <TuneOutlinedIcon />
                          </Button>
                        </TableCell>
                        {selectedWorkout === item && <EditWorkout editModalOpen={editModalOpen} setEditModalClosed={handleClose} selected={item} />}
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};
