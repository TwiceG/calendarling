import React, { useState, useContext } from 'react';
import axios from 'axios';
import Input from './Input';
import CryptoJS from "crypto-js";


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(false);
    }

    const storeUserName = (username) => {

        localStorage.setItem('username', username);
        console.log(localStorage.getItem('username'));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/login', {
                email: email,
                password: password,
            });
            console.log('Login successful', response.data.message);

            encryptAuthToken(response.data.token);

            storeUserName(response.data.user.name);
            clearLoginStatus();
            window.location.href = '/';
            // window.location.href = '/two-factor-verification';

        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Incorrect email or password');
        }
    };

    return (
        <div>
            <div className='form-container'>
                <form onSubmit={handleLogin}>
                    <h1 id='title'>Sign In</h1>
                    <h3>Feel free to login and start use the Calendar and more!!</h3>

                    {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

                    <Input type='email' placeholder='Email' item={email} setItem={setEmail} />
                    <Input type='password' placeholder='Password' item={password} setItem={setPassword} />

                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <span className="loader"></span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                {/* <Link to={'/password-recovery'} >Forgot your password?</Link> */}
            </div>
        </div>
    );
};

export default LoginForm;
