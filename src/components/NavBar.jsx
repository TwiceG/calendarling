
import { Link } from 'react-router-dom';
import '../style/NavBar.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const NavBar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get('/me', { withCredentials: true })
            .then(response => {
                if (response.data && response.data.id) {  // Check if user exists
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    return (

        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
            </ul>

            {isAuthenticated ? (
                <div className="user-actions">
                    <ul className="auth-list">
                        <li className="nav-item">
                            <Link to="/logout" className="nav-link">Logout</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/week-planner" className="nav-link">Planner</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/chill" className="nav-link">Chill</Link>
                        </li>
                    </ul>
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

