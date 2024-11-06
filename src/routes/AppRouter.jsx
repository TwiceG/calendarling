import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WeeklyPlanner from "./WeeklyPlanner";


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week-planner" element={<WeeklyPlanner />} />
        </Routes>
    );
}

export default AppRouter;