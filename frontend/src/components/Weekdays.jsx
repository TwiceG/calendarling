import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Weekdays.css';

const Weekdays = () => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // State to hold notes for each weekday
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
            {weekdays.map((day) => (
                <div key={day} className="column">
                    <div className="day-name">{day}</div>
                    <textarea
                        className="day-input"
                        value={notes[day]}
                        onChange={(event) => handleNoteChange(day, event)}
                        placeholder={`Write a note for ${day}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default Weekdays;
