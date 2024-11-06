import { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Weekdays.css';

const Weekdays = ({ weekDates, selectedDate }) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [notes, setNotes] = useState(weekdays.reduce((acc, day) => ({ ...acc, [day]: '' }), {}));
    const [isEdited, setIsEdited] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || 'https://calendarling-dia.vercel.app/api';


    const fetchWeekNotes = async () => {
        const dateToSend = new Date(selectedDate);

        // Add 1 day to the date for the backend to get correct selectedDate due to new Date conversation
        dateToSend.setDate(dateToSend.getDate() + 1);

        const formattedDate = dateToSend.toISOString().split('T')[0];

        const response = await axios.get(`${API_URL}/week-notes`, {  // `${import.meta.env.VITE_API_URL}/your-endpoint`}
            params: { date: formattedDate }
        });
        return response.data;
    };



    useEffect(() => {
        const getNotes = async () => {
            const noteData = await fetchWeekNotes();

            // Update the notes state based on received data
            const updatedNotes = weekdays.reduce((acc, day, index) => {
                acc[day] = noteData[index] || '';
                return acc;
            }, {});

            setNotes(updatedNotes);
        };

        getNotes();
    }, [selectedDate]);

    const handleNoteChange = (day, event) => {
        setNotes({
            ...notes,
            [day]: event.target.value
        });
        setIsEdited({ ...isEdited, [day]: true });
    };

    const handleSubmit = (day, date) => {
        const currentNote = notes[day];
        const stringDate = date.toDateString();

        const addNote = () => {
            axios.post(`${API_URL}/add-note`, { //`${import.meta.env.VITE_API_URL}/your-endpoint`}
                note: currentNote ?? ' ',
                date: stringDate
            });
            setIsEdited({ ...isEdited, [day]: false });
        }
        addNote();
    }

    return (
        <div className="columns-container">
            {weekdays.map((day, index) => {
                const date = weekDates[index];
                const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();
                const isHighlighted = highlightedIndex === index;
                return (
                    <div key={day} className={`column ${isSelected || isHighlighted ? 'highlight' : ''}`}>
                        <div className="day-name">{day}</div>
                        <div className="date">{date ? date.getDate() : ''}</div>
                        <textarea
                            className="day-input"
                            value={notes[day]}
                            onChange={(event) => handleNoteChange(day, event)}
                            onFocus={() => setHighlightedIndex(index)}
                            onBlur={() => setHighlightedIndex(null)}
                            placeholder={`Write a note for ${day}`}
                        />
                        {isEdited[day] && ( // Only show the button if the note is edited
                            <button className='note-save-btn' onClick={() => handleSubmit(day, date)} type='submit'>Save Note</button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Weekdays;
