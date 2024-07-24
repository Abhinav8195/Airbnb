import React, { useEffect, useState, useContext } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numofguest, setNumofguest] = useState(1);
  const [name, setName] = useState('');
  const [mobile, setmobile] = useState('');
  const [redirect, setRediect] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function Bookthisplace() {
    if (!user) {
      toast.error('Please log in to book this place.');
      return;
    }

    try {
      const response = await axios.post('/booking', {
        checkIn,
        checkOut,
        numberOfDays,
        name,
        mobile,
        numofguest,
        place: place._id,
        price: numberOfDays * place.price
      });
      const bookingId = response.data._id;
      setRediect(`/account/bookings/${bookingId}`);
    } catch (error) {
        console.error('Error occurred while booking:', error);
        toast.error('An error occurred while booking. Please try again.');
      }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

    

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
                           <div className="text-2xl text-center">
                             Price:${place.price}/ per night
                           </div>

                           <div className="border rounded-2xl mt-4 ">
                                    <div className="flex">
                                    <div className='  px-4 py-3 '>
                                    <label >Check in:</label>
                                        <input type="date"  value={checkIn} onChange={ev=>setCheckIn(ev.target.value)}/>
                                    </div>

                                    <div className='  px-4 py-3  border-l'>
                                    <label >Check Out:</label>
                                        <input type="date" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} />
                                    </div>
                                    </div>

                                    <div className='  px-4 py-3  border-t'>
                                    <label >Number of guests:</label>
                                        <input type="number" value={numofguest} onChange={ev=>setNumofguest(ev.target.value)}  />
                                    </div>
                                    {numberOfDays >0 &&(
                                        <div className='  px-4 py-3  border-t'>
                                        <label > Your full Name :</label>
                                            <input type="text" value={name} onChange={ev=>setName(ev.target.value)}  />
                                        
                                            <label > Your Phone Number :</label>
                                            <input type="tel" value={mobile} onChange={ev=>setmobile(ev.target.value)}  />
                                        
                                        </div>
                                    )}
                           </div>

                           
                           <button onClick={Bookthisplace} className='primary mt-4'>
                                Book this Place
                                {numberOfDays>0 && (
                                    <span className='flex justify-center'>${numberOfDays* place.price} for{numberOfDays} Night</span>
                                )}
                            </button>
                        </div>
  )
}

export default BookingWidget