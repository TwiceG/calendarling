
import React, { useState } from 'react';
import axios from 'axios';
import '../style/Weekdays.css';

const Weekdays = ({ weekDates, selectedDate }) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [highlightedIndex, setHighlightedIndex] = useState(null); // State to track highlighted column
    const [notes, setNotes] = useState(
        weekdays.reduce((acc, day) => ({ ...acc, [day]: '' }), {})
    );


    // // Fetch notes from backend
    // useEffect(() => {
    //     const fetchNotes = async () => {
    //         try {
    //             const response = await axios.get('http://127.0.0.1:8000/api/notes'); 
    //             // format { Monday: "note1", Tuesday: "note2", ... }
    //             setNotes(response.data);
    //         } catch (error) {
    //             console.error("Error fetching notes:", error);
    //         }
    //     };

    //     fetchNotes();
    // }, []);




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
                const isHighlighted = highlightedIndex === index; // Check if the column should be highlighted

                return (
                    <div key={day} className={`column ${isSelected || isHighlighted ? 'highlight' : ''}`}>
                        <div className="day-name">{day}</div>
                        <div className="date">{date ? date.getDate() : ''}</div>
                        <textarea
                            className="day-input"
                            value={notes[day]}
                            onChange={(event) => handleNoteChange(day, event)}
                            onFocus={() => setHighlightedIndex(index)} // Highlight on focus
                            onBlur={() => setHighlightedIndex(null)} // Remove highlight on blur
                            placeholder={`Write a note for ${day}`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Weekdays;
