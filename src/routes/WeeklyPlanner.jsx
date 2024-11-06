import { useState } from 'react';
import Calendar from 'react-calendar';
import WeekdaysColumn from '../components/Weekdays';
import '../style/WeeklyPlanner.css';
import '../style/CustomCalendar.css';

const WeeklyPlanner = () => {
    const [weekDates, setWeekDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const getWeekForDate = (date) => {
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();

        // If it's Sunday (0), set the start of the week to the previous Monday
        // Otherwise, just set to the most recent Monday
        startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));


        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const handleDateClick = (date) => {
        const week = getWeekForDate(date);
        console.log('API URL:', import.meta.env.VITE_API_URL);
        setWeekDates(week);
        setSelectedDate(date); // Update the selectedDate when a date is clicked
    };

    return (
        <div className="weekly-planner">
            <div className="calendar-container">
                <Calendar
                    locale="en-GB" onClickDay={handleDateClick} />
            </div>

            <WeekdaysColumn weekDates={weekDates} selectedDate={selectedDate} /> {/* Pass selectedDate to WeekdaysColumn */}
        </div>
    );
};

export default WeeklyPlanner;
