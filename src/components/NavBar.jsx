import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/NavBar.css";
import logo from "../assets/CalenDarling-logo4.png";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = localStorage.getItem("username");

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
            <div className="navbar-container">
                <Link to="/" className="home-link">
                    <img className="navbar-logo" src={logo} alt="calendarling-logo" />
                </Link>

                <div className="hamburger" onClick={toggleMenu}>
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                </div>

                <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link to="/week-planner" className="nav-link" onClick={toggleMenu}>
                                    Planner
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/chill" className="nav-link" onClick={toggleMenu}>
                                    Chill
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/logout" className="nav-link" onClick={toggleMenu}>
                                    Logout
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link to="/login-register" className="nav-link" onClick={toggleMenu}>
                                Login/Register
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
