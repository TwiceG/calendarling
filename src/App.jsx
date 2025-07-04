import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import NavBar from './components/NavBar';
import './style/App.css';
import axios from 'axios';
import Chatbot from './components/Chatbot';


function App() {

  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <AppRouter />
        <Chatbot />
      </BrowserRouter>
    </div>
  );
}

export default App;
