import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import NavBar from './components/NavBar';
import './style/App.css';
// import useDailyEmailCheck from './hooks/useDailyEmailCheck';

function App() {
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
