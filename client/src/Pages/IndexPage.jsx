import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './IndexPage.css'; // Import your CSS file for styling

const IndexPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/places').then(Response => {
      setPlaces(Response.data);
    });
  }, []);

  return (
    <div className='mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-col-4'>
      {places.length > 0 &&
        places.map(place => (
          <Link to={'/place/' + place._id} key={place._id}>
            <div className="place-card">
              {place.photos?.[0] && (
                <img className='rounded-2xl object-cover aspect-square' src={'http://localhost:4000/uploads/' + place.photos?.[0]} alt={place.title} />
              )}
              <div className='place-info'>
                <h2 className='font-bold'>{place.address}</h2>
                <h3 className='text-sm text-gray-500'>{place.title}</h3>
                <div className='mt-1'>
                  <span className='font-bold'> ${place.price}</span> per night
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default IndexPage;
