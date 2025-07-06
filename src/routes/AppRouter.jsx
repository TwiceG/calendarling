import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import WeeklyPlanner from "./WeeklyPlanner";
import Chill from "./Chill";
import Logout from "./Logout";
import Auth from "./Auth";
import ShopAndCook from "./ShopAndCook";
import PasswordRecovery from "./PasswordRecovery";
import PasswordReset from "./PasswordReset";
import Helpdesk from "./Helpdesk";



function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week-planner" element={<WeeklyPlanner />} />
            <Route path="/chill" element={<Chill />} />
            <Route path="/login-register" element={<Auth />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/shop-cook" element={<ShopAndCook />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/helpdesk" element={<Helpdesk />} />
        </Routes>
    );
}

export default AppRouter;