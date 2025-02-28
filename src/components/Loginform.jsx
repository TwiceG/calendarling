import React, { useState, useContext } from 'react';
import axios from 'axios';
import Input from './Input';
import CryptoJS from "crypto-js";


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);

    // Function to encrypt the token
    const encryptAuthToken = (token) => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();

        localStorage.setItem('authToken', encryptedToken);
    };

    const clearLoginStatus = () => {
        setEmail('');
        setPassword('');
        setLoginError(null);
    }

    const storeUserName = (username) => {

        localStorage.setItem('username', username);
        console.log(localStorage.getItem('username'));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('api/login', {
                email: email,
                password: password,
            });
            console.log('Login successful', response.data.message);

            encryptAuthToken(response.data.token);

            storeUserName(response.data.user.name);
            clearLoginStatus();
            // window.location.href = '/two-factor-verification';

        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Incorrect email or password');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <h2>Feel free to login and start use the Calendar and more!!</h2>

                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

                <Input type='email' placeholder='Email' item={email} setItem={setEmail} />
                <Input type='password' placeholder='Password' item={password} setItem={setPassword} />

                <button type='submit'>Login</button>
            </form>
            {/* <Link to={'/password-recovery'} >Forgot your password?</Link> */}
        </div>
    );
};

export default LoginForm;
