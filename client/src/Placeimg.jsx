import React from 'react';

const Placeimg = ({ place, index = 0, className = 'object-cover' }) => {
    // Check if place or photos is undefined
    if (!place || !place.photos || !place.photos.length) {
        return null; // Return null if no photos are available
    }

    // Ensure index is within bounds
    if (index < 0 || index >= place.photos.length) {
        index = 0; 
    }

    // Render the image
    return <img className={className} src={`http://localhost:4000/uploads/${place.photos[index]}`} alt={`Photo ${index}`} />;
};

export default Placeimg;
