import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  const { setUser } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      setUser(response.data);
      toast.success('Login successful');
      setRedirect(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('No user found with this email.');
      } else if (error.response && error.response.status === 401) {
        toast.error('Incorrect email or password.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='mt-4 grow flex items-center justify-around mx-auto'>
      <ToastContainer />
      <div className='mb-32'>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form action='' className='max-w-md mx-auto' onSubmit={login}>
          <input type='email' placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className='primary'>Login</button>
          <div className='text-center py-2 text-gray-500'>
            Don't have an account yet? <Link className='underline text-black' to={'/register'}>Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
