import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WeeklyPlanner from "./WeeklyPlanner";
import Chill from "./Chill";
import Regristration from "./Registration";
import Login from "./Login";
import Logout from "./Logout";


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week-planner" element={<WeeklyPlanner />} />
            <Route path="/chill" element={<Chill />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Regristration />} />
        </Routes>
    );
}

export default AppRouter;