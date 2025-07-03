import axios from "axios";
import '../style/PasswordReset.css';
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Input from "../components/Input";

const PasswordReset = () => {
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNewPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/change-password', {
                email,
                password,
                password_confirmation: confirmPassword,
                token
            });

            console.log('Your password has been changed successfully', response.data.user);
            window.location.href = '/login-register';
        } catch (error) {
            console.error('Password change error:', error.response?.data?.message || 'Something went wrong');
            setError(error.response?.data?.message || 'Something went wrong');
        }
    }

    return (

        <div className='password-container'>
            <form onSubmit={handleNewPassword}>
                <Input
                    type="password"
                    placeholder="Password"
                    minLength={6}
                    title="Password must be at least 6 characters long and contain at least one uppercase letter and one number"
                    pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$"
                    item={password}
                    setItem={setPassword}
                />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    minLength={6}
                    title="Re-enter your password"
                    item={confirmPassword}
                    setItem={setConfirmPassword}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? (
                        <span className="loader"></span>
                    ) : (
                        'Change Password'
                    )}
                </button>
            </form>
        </div>

    );
};



export default PasswordReset;