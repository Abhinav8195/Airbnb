import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate= useNavigate();

  async function registerUser(ev) {
    ev.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields.');
    }
    try {
      await axios.post('/register', {
        name: name,
        email: email,
        password: password
      });
      toast.success('Registration Successful. Now you can log in.');
      navigate('/login')
      setName('');
      setEmail('');
      setPassword('');
      
    } catch (error) {
      toast.error('Registration Failed. Please try again.');
    }
  }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
      <div className='mb-32'>
        <h1 className='text-4xl text-center mb-4'>Register</h1>
        <form action="" className='max-w-md mx-auto' onSubmit={registerUser}>
          <input type="text" placeholder='John Doe' value={name} onChange={ev => setName(ev.target.value)} />
          <input type="email" placeholder='your@email.com' value={email} onChange={ev => setEmail(ev.target.value)} />
          <input type="password" name="" placeholder='password' value={password} onChange={ev => setPassword(ev.target.value)} />
          <button className='primary'>Register</button>
          <div className='text-center py-2 text-gray-500'>
            Already a member? <Link className='underline text-black' to={'/login'}>Login now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
