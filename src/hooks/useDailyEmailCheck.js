
import { useEffect } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';


const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;
const userId = process.env.EMAILJS_USER_ID;
const FLY_API = 'https://calendarling-backend.fly.dev/api';

// Function to send email using EmailJS
const sendEmail = (note, date) => {
    const templateParams = {
        note: note,
        date: date,
        user_email: process.env.MY_EMAIL
    };


    // import.meta.env.VITE_EMAILJS_SERVICE_ID,
    // import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    // templateParams,
    // import.meta.env.VITE_EMAILJS_USER_ID
    emailjs.send(
        serviceId,
        templateId,
        templateParams,
        userId ,

    )
    .then((response) => {
        console.log('Email sent successfully', response);
    })
    .catch((error) => {
        console.error('Error sending email:', error);
    });
};

// Function to fetch note for today from your backend
const fetchNoteForToday = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

    try {
        // const response = await axios.get(`${import.meta.env.VITE_API_URL}/week-notes`, {
        const response = await axios.get(`${FLY_API}/get-note`, {
        params: { date: formattedDate },
        });

        return response.data; 
    } catch (error) {
        console.error('Error fetching note for today:', error);
        return ''; // Return an empty string if there was an error fetching the note
    }
};

// Function to check for a note and send an email if applicable
const checkNoteAndSendEmail = async () => {
    const note = await fetchNoteForToday();
    if (note && note.trim() !== '') {  // If there's a note (non-empty)
        sendEmail(note, new Date().toDateString());
    }
};

// Custom hook to check daily for notes and send email if applicable
const useDailyEmailCheck = () => {
    useEffect(() => {
        // Check immediately when the app loads
        checkNoteAndSendEmail();

        // Set an interval to check every 24 hours (86400000 ms)
        const intervalId = setInterval(checkNoteAndSendEmail, 86400000);

        // Clear the interval when the component is unmounted to avoid memory leaks
        return () => clearInterval(intervalId);
    }, []);
};

export default useDailyEmailCheck;
