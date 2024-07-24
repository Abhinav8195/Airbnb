import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../UserContext'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import Placespage from './Placespage'
import AccountNav from '../AccountNav'


const Accountpage = () => {
    const { ready, user, setUser } = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let { subpage } = useParams();
    if (subpage === undefined) {
      subpage = 'profile';
    }
  
    async function logout() {
      await axios.post('/logout');
      setRedirect('/');
      setUser(null);
     
    }

  async function logout(){
   await  axios.post('/logout');
   setUser(null)
    setRedirect('/')
  }

    if(!ready){
        return <h1>Loading...</h1>
    }

    if(ready && !user && !redirect){
        return <Navigate to={'/login'}/>
    }

  if(redirect){
    return <Navigate to={redirect}/>
  }
  
  return (
    <div>
       
      <AccountNav/>
        {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className='primary max-w-sm mt-2'>Log Out</button>
        </div>
        ) }
        {subpage==='places' &&(
          <Placespage/>
        )}
     </div>
  )
}

export default Accountpage