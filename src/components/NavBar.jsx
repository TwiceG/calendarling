
import { Link } from 'react-router-dom';
import '../style/NavBar.css';

const NavBar = () => {

    return (

        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/week-planner" className="nav-link">Planner</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;

