import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import NavBar from './components/NavBar';
import './style/App.css';
import axios from 'axios';
// import useDailyEmailCheck from './hooks/useDailyEmailCheck';

function App() {

  // axios.defaults.baseURL = 'http://localhost:8000/api';
  axios.defaults.baseURL = 'https://calendarling-backend.fly.dev/api';
  axios.defaults.withCredentials = true; // Required for cookies to be sent

  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
