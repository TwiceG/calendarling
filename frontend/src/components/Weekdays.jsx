import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Weekdays.css';

const Weekdays = ({ weekDates, selectedDate }) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [notes, setNotes] = useState(weekdays.reduce((acc, day) => ({ ...acc, [day]: '' }), {}));

    const fetchWeekNotes = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(`http://127.0.0.1:8000/api/week-notes`, {
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
    };

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
                    </div>
                );
            })}
        </div>
    );
};

export default Weekdays;
