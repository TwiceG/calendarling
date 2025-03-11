import { useEffect, useState } from "react";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { motion } from "framer-motion";
import "../style/Logout.css";

const Logout = () => {
    const [isLoading, setIsLoading] = useState(true);

    const decryptToken = () => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = localStorage.getItem('authToken');
        const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    };

    const clearUserData = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
    };

    const logoutUser = async () => {
        const token = decryptToken();
        try {
            await axios.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            clearUserData();
        } catch (error) {
            console.error('Error logging out:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        logoutUser();
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="logout-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.h2
                className="logout-message"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                You've been logged out!
            </motion.h2>
            <motion.h3
                className="logout-submessage"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                Goodbye!
            </motion.h3>

            {isLoading && <div className="spinner"></div>}
        </motion.div>
    );
};

export default Logout;
