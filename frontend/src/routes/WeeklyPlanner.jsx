import React, { useState } from 'react';
import Calendar from 'react-calendar';
import WeekdaysColumn from '../components/Weekdays';

const WeeklyPlanner = () => {
    const [weekDates, setWeekDates] = useState([]);

    const getWeekForDate = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday as the first day of the week

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
        setWeekDates(week);
    };

    return (
        <div>
            <Calendar locale="en-GB" onClickDay={handleDateClick} />
            <WeekdaysColumn weekDates={weekDates} />
        </div>
    );
};

export default WeeklyPlanner;
