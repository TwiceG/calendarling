import Calendar from 'react-calendar';
import WeekdaysColumn from '../components/Weekdays';

const WeeklyPlanner = () => {



    return (
        <div>
            <Calendar locale="en-GB" />
            <WeekdaysColumn />
        </div>

    )
}

export default WeeklyPlanner;