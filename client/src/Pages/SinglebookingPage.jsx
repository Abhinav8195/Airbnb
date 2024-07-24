import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Addresslink from '../Addresslink';
import Placegallery from '../Placegallery';
import BookingDates from '../BookingDates';

const SinglebookingPage = () => {
    const {id} = useParams() ;
    const [booking,setBooking]=useState(null)
    useEffect(()=>{
          if(id){
            axios.get('/singlebookings').then(response=>{
             const foundbooking =  response.data.find(({_id})=> _id ===id)
             if(foundbooking){
              setBooking(foundbooking)
             }
            })
          }
    },[id])

    if(!booking){
      return '';
    }
  return (
    <div className='my-8'>
       <h1 className="text-3xl mb-2">
        {booking.place.title}
       </h1>
       <Addresslink className='my-2 click'>
        {booking.place.address}
       </Addresslink>
       <div className="bg-gray-200 p-6 my-6 rounded-2xl items-center flex justify-between" >
        <div>
          <h2 className="text-2xl mb-4">
        Your booking information:
       </h2>
       <BookingDates booking ={booking}/>
        </div>
        <div className='bg-primary p-6 text-white rounded-2xl'>
          <div>Total Price:</div>
          <div className='text-3xl'>${booking.price}</div>
        </div>
         
       </div>
       <Placegallery place={booking.place}/>
      </div>
  )
}

export default SinglebookingPage;