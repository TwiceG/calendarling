// (for GitHub Actions)
// import axios from 'axios';
// import emailjs from 'emailjs-com';
// import { config } from 'dotenv';
const axios = require('axios');
const emailjs = require('emailjs-com');
const { config } = require('dotenv');

config();
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;
const userId = process.env.EMAILJS_USER_ID;
const FLY_API = 'https://calendarling-backend.fly.dev/api';
const email = process.env.MY_EMAIL;

const sendEmail = (note, date) => {
    const templateParams = {
        note,
        date,
        user_email: email
    };

    emailjs.send(serviceId, templateId, templateParams, userId)
        .then(response => console.log('Email sent successfully', response))
        .catch(error => console.error('Error sending email:', error));
};

const fetchNoteForToday = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    try {
        const response = await axios.get(`${FLY_API}/get-note`, { params: { date: formattedDate } });
        return response.data;
    } catch (error) {
        console.error('Error fetching note for today:', error);
        return '';
    }
};

const checkNoteAndSendEmail = async () => {
    const note = await fetchNoteForToday();
    if (note && note.trim() !== '') {
        sendEmail(note, new Date().toDateString());
    }
};

checkNoteAndSendEmail();
