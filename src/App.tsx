import { Auth } from './components/auth';
import './App.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './shared/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        <Auth />
      </div>
    </ThemeProvider>
  );
}

export default App;
