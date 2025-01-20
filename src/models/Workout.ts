import { Timestamp } from 'firebase/firestore';

export interface Workout {
  id: string;
  workoutType: string;
  date: Timestamp | undefined; // denna ska inte vara undefined då man måste lägga in ett datum
  durationMinutes: string;
}
