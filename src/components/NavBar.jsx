
import { Link } from 'react-router-dom';
import '../style/NavBar.css';


const NavBar = () => {

    return (

        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
            </ul>

            {localStorage.getItem('username') ? (
                <div className='auth-list'>
                    <div className="user-actions">
                        <li className="nav-item">
                            <Link to="/logout" className="nav-link">Logout</Link>
                        </li>
                    </div>

                    <li className="nav-item">
                        <Link to="/week-planner" className="nav-link">Planner</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/chill" className="nav-link">Chill</Link>
                    </li>
                </div>

            ) : (
                <div className="user-actions">
                    <ul className="auth-list">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>


    );
};

export default NavBar;

