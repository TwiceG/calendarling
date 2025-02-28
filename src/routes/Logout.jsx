import { useEffect } from "react";
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Logout = () => {

    // Decrypt the token from localStorage
    const decryptToken = () => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = localStorage.getItem('authToken');
        const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
    };

    // Clear user data from localStorage
    const clearUserData = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
    };


    const logoutUser = async () => {
        const token = decryptToken();
        try {
            // Send logout request to backend
            await axios.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            clearUserData();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        logoutUser();
        // Delay the redirect to '/home' after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 3000); // 3 seconds delay

        // Clean up the timeout when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <h2>You've been logged out!</h2>
            <h3>Good Bye!</h3>
        </div>
    );
};

export default Logout;
