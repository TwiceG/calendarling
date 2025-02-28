import React, { useState } from 'react';
import '../style/AuthForm.css';
import LoginForm from './Loginform';
import RegisterForm from './RegistrationForm';

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const togglePanel = () => {
        setIsSignUp(!isSignUp);
    };


    return (
        <div className="auth-form-container">
            <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
                {/* Sign-up Form */}
                <div className={`form-container sign-up-container ${isSignUp ? '' : 'hidden'}`}>
                    <RegisterForm />
                </div>

                {/* Sign-in Form */}
                <div className={`form-container sign-in-container ${!isSignUp ? '' : 'hidden'}`}>
                    <LoginForm />
                </div>

                {/* Overlay (Toggle effect) */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={togglePanel}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className="ghost" onClick={togglePanel}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
