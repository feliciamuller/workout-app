import { Timestamp } from 'firebase/firestore';

export interface Workout {
  id: string;
  workoutType: string;
  date: Timestamp;
  durationMinutes: string;
}
