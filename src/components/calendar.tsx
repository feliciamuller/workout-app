import { Badge, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { Workout } from '../models/Workout';
import { auth, db } from '../config/firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid2';

export const Calendar = () => {
  const [workoutList, setWorkoutList] = useState<Workout[]>([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const workoutRef = collection(db, 'users', userId, 'workouts');
    const unsubscribe = onSnapshot(workoutRef, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const workoutDate = docData.date ? docData.date.toDate() : null;
        return { ...docData, id: doc.id, date: workoutDate };
      }) as Workout[];

      setWorkoutList(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser]);

  // checking if the day has a workout
  const renderWorkoutDay = (props: PickersDayProps<Dayjs>) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isWorkoutDay = workoutList.some((workout) => {
      const workoutDate = workout.date instanceof Timestamp ? workout.date.toDate() : workout.date;
      return workoutDate ? dayjs(workoutDate).isSame(day, 'day') : false;
    });

    return (
      <Badge
        key={day.toString()}
        overlap='circular'
        badgeContent={isWorkoutDay ? '💪🏼' : undefined}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '1.3rem',
          },
        }}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          sx={{
            marginTop: '13px',
          }}
        />
      </Badge>
    );
  };

  return (
    <Grid container>
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            className='workout-calendar'
            sx={{ width: { lg: '60%', md: '100%', sm: '100%', xs: '100%' }, backgroundColor: 'transparent', borderRadius: '5px' }}
            orientation='portrait'
            openTo='day'
            slots={{
              day: renderWorkoutDay,
            }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};
