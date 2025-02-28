import React, { useState } from 'react';
import axios from 'axios';
import Input from './Input';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/register', {
        name: name,
        email: email,
        password: password,
      });
      console.log('Registration successful', response.data.message);
      window.location.href = 'Login';
    } catch (error) {
      console.error('Registration error:', error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      *
      <Input type='text' placeholder='Name' minLength={6} title='Enter your name here' item={name} setItem={setName} />
      *
      <Input type='email' placeholder='Email' title='Enter your email here' item={email} setItem={setEmail} />
      *
      <Input
        type='password' placeholder='Password'
        minLength={6}
        title="Password must be at least 6 characters long and contain at least one uppercase letter and one number"
        pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$"
        item={password} setItem={setPassword} />


      <button type="submit">Register</button>
    </form>

  );
};

export default RegisterForm;
