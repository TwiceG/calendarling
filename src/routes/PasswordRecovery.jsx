import { useState } from "react";
import Input from "../components/Input";
import '../style/PasswordRecovery.css'
import axios from "axios";

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const sendEmail = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('/password-reset', {
                email: email,
            });
            setMessage(response.data.message || 'Reset link sent! Please check your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not send email. Please try again.');
        }
    }

    return (
        <div className="reset-password-container">
            <form onSubmit={sendEmail}>
                <h3>Please enter your email: </h3>
                <Input type='email' placeholder='Email' item={email} setItem={setEmail} />
                <button type="submit">Submit</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    )

}

export default PasswordRecovery;