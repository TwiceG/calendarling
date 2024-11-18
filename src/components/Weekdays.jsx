import { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Weekdays.css';
import Modal from './Modal';

const Weekdays = ({ weekDates, selectedDate }) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedColumn, setSelectedColumn] = useState(null); // Track selected column for deletion
    const [notes, setNotes] = useState(weekdays.reduce((acc, day) => ({ ...acc, [day]: '' }), {}));
    const [isEdited, setIsEdited] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ day: '', date: null });

    const fetchWeekNotes = async () => {
        const dateToSend = new Date(selectedDate);
        dateToSend.setDate(dateToSend.getDate() + 1);
        const formattedDate = dateToSend.toISOString().split('T')[0];
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/week-notes`, {
            params: { date: formattedDate }
        });
        return response.data;
    };

    useEffect(() => {
        const getNotes = async () => {
            const noteData = await fetchWeekNotes();
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
            axios.post(`${import.meta.env.VITE_API_URL}/add-note`, {
                note: currentNote ?? ' ',
                date: stringDate
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
        axios.delete(`${import.meta.env.VITE_API_URL}/delete-note`, {
            data: { date }
        });
    };

    const handleConfirmDelete = () => {
        handleDeleteNote(modalData.date);
        setIsModalOpen(false); // Close the modal
        setSelectedColumn(null); // Reset the selected column after deletion
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
