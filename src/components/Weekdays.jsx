import { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Weekdays.css';
import Modal from './Modal';
import CryptoJS from "crypto-js";

const Weekdays = ({ weekDates, selectedDate }) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [notes, setNotes] = useState(weekdays.reduce((acc, day) => ({ ...acc, [day]: '' }), {}));

    const [selectedColumn, setSelectedColumn] = useState(null); // Track selected column for deletion
    const [isEdited, setIsEdited] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ day: '', date: null });



    const decryptToken = () => {

        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = localStorage.getItem('authToken');
        const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    };

    const fetchWeekNotes = async () => {
        const dateToSend = new Date(selectedDate);
        dateToSend.setDate(dateToSend.getDate() + 1);
        const formattedDate = dateToSend.toISOString().split('T')[0];
        const token = decryptToken();
        const response = await axios.get('/week-notes', {
            headers: {
                'Authorization': `Bearer ${token}` // Send the decrypted token
            },
            params: { date: formattedDate }
        });
        return response.data;
    };


    const getNotes = async () => {
        const noteData = await fetchWeekNotes();
        console.log(noteData);
        const updatedNotes = weekdays.reduce((acc, day, index) => {
            acc[day] = noteData[index] || '';
            return acc;
        }, {});
        setNotes(updatedNotes);
    };

    useEffect(() => {
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
        const token = decryptToken();

        const addNote = () => {
            axios.post('/add-note',
                {
                    note: currentNote ?? ' ',  // Default to empty string if note isn't change
                    date: stringDate
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Send the decrypted token
                    }
                })
                .then(response => {
                    console.log('Note added successfully:', response.data);
                    setIsEdited({ ...isEdited, [day]: false });
                })
                .catch(error => {
                    console.error('Error adding note:', error);
                });

            setIsEdited({ ...isEdited, [day]: false });
        };
        addNote();
    };


    const confirmPopUp = (day, date) => {
        const stringDate = date.toDateString();
        setModalData({ day, date: stringDate });
        setIsModalOpen(true); // Open modal
    };

    const handleDeleteNote = (date) => {
        const token = decryptToken();
        axios.delete('/delete-note', {
            headers: {
                'Authorization': `Bearer ${token}` // Send the decrypted token
            },
            data: { date }
        });
    };

    const handleConfirmDelete = () => {
        handleDeleteNote(modalData.date);

        // Close the modal and reset the selected column
        setIsModalOpen(false);
        setSelectedColumn(null);

        //Create a copy of the current notes state
        const updatedNotes = { ...notes };

        //Clear note
        updatedNotes[modalData.day] = '';
        setNotes(updatedNotes);
    };



    return (
        <div className="columns-container">
            {weekdays.map((day, index) => {
                const date = weekDates[index];
                const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();
                const isHighlighted = selectedColumn === index; // Check if the column is selected

                return (
                    <div
                        key={day}
                        className={`column ${isSelected || isHighlighted ? "highlight" : ""}`}
                        onClick={() => setSelectedColumn(isHighlighted ? null : index)} // Toggle selection
                    >
                        <div className="day-name">{day}</div>
                        <div className="date">{date ? date.getDate() : ""}</div>
                        <textarea
                            className="day-input"
                            value={notes[day]}
                            onChange={(event) => handleNoteChange(day, event)}
                            placeholder={`Write a note for ${day}`}
                        />

                        {isEdited[day] && (
                            <button className="note-save-btn" onClick={() => handleSubmit(day, date)} type="submit">
                                Save Note
                            </button>
                        )}

                        {isHighlighted && (
                            <button className="note-delete-btn" onClick={() => confirmPopUp(day, date)}>
                                Delete
                            </button>
                        )}
                    </div>
                );
            })}
            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete '${notes[modalData.day]}' for ${modalData.date}?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Weekdays;
