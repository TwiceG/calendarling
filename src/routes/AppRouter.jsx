import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WeeklyPlanner from "./WeeklyPlanner";
import Chill from "./Chill";
import Logout from "./Logout";
import Auth from "./Auth";


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week-planner" element={<WeeklyPlanner />} />
            <Route path="/chill" element={<Chill />} />
            <Route path="/login-register" element={<Auth />} />
            <Route path="/logout" element={<Logout />} />
        </Routes>
    );
}

export default AppRouter;