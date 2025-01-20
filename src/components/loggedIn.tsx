import React from 'react';
import { auth } from '../config/firebase';
import { Box, Typography } from '@mui/material';
import { DisplayExercises } from './displayExercises';

export const LoggedIn = () => {
  return (
    <Box>
      <Typography variant='h4' sx={{ padding: 2 }}>
        Välkommen {auth?.currentUser?.displayName}
        <DisplayExercises />
      </Typography>
    </Box>
  );
};
