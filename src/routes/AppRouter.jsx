import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WeeklyPlanner from "./WeeklyPlanner";
import Chill from "./Chill";
import Regristration from "./Registration";


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week-planner" element={<WeeklyPlanner />} />
            <Route path="/chill" element={<Chill />} />
            {/* <Route path="/login" element={ } />
            <Route path="/logout" element={ } /> */}
            <Route path="/register" element={<Regristration />} />
        </Routes>
    );
}

export default AppRouter;