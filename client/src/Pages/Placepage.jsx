import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BookingWidget from '../BookingWidget';
import Placegallery from '../Placegallery';
import Addresslink from '../Addresslink';

const Placepage = () => {
    const [place, setPlace] = useState(null);
    
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) {
        return null;
    }
    

    return (
        <div className='mt-4 py-8 bg-gray-100 -mx-8 px-8 pt-8'>
            <h1 className='text-3xl'>{place.title}</h1>
            <Addresslink>{place.address}</Addresslink>
              <Placegallery place={place}/>
            {/* description and price element */}

            <div className=' mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
                    <div>
                        <div className='my-4'>
                            <h2 className="font-semibold text-2xl">Description</h2>
                            {place.description}
                        </div>


                        <b>Check-in:</b> {place.checkIn} <br />
                        <b>Check-out:</b> {place.checkOut} <br />
                        <b>Max Number of guests:</b> {place.maxGuests}                       
                    </div>
                    <div>
                        <BookingWidget place={place}/>
                    </div>
            </div>
                        <div className="bg-white -mx-8 px-8 py-8 border-t">
                                <div className="">
                            <h2 className="font-semibold text-2xl">Extra Info:</h2>
                            </div>
                            <div className=" mb-4 mt-2 text-sm text-gray-700 leading-5">
                                {place.extraInfo}
                            </div>
                        </div>
                       
        </div>
    );
}

export default Placepage;
