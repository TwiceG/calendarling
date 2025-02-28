import { Link } from 'react-router-dom';
import '../style/NavBar.css';

const NavBar = () => {

    const isLoggedIn = localStorage.getItem('username');

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link" id='home'>Home</Link>
                </li>
            </ul>

            <div className="auth-list">
                {isLoggedIn ? (
                    <>
                        <li className="nav-item">
                            <Link to="/week-planner" className="nav-link">Planner</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/chill" className="nav-link">Chill</Link>
                        </li>
                        <div className="user-actions">
                            <li className="nav-item">
                                <Link to="/logout" className="nav-link">Logout</Link>
                            </li>
                        </div>
                    </>
                ) : (
                    <li className="nav-item">
                        <Link to="/login-register" className="nav-link">Login/Register</Link>
                    </li>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
