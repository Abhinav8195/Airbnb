import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Perks from '../Perks';
import axios from 'axios';
import AccountNav from '../AccountNav';
import PhotosUploader from "../PhotosUploader.jsx";

const PlacesFormPage = () => {
    const {id}=useParams();
    const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  // const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price,setPrice]=useState(100)
  const [redirect,setRedirect] = useState(false)

useEffect(()=>{
    if(!id){
        return
    }
    axios.get('/places/'+id).then(response=>{
        const {data}=response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description)
        setPerks(data.perks)
        setExtraInfo(data.extraInfo)
        setCheckIn(data.checkIn)
        setCheckOut(data.checkOut)
        setMaxGuests(data.maxGuests)
        setPrice(data.price)
    })
},[id])


  function inputHeader(text) {
    return <h2 className='text-2xl mt-4'>{text}</h2>;
  }

  function inputDescription(text) {
    return <p className='text-gray-500 text-sm'>{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  
  // async function addPhotoByLink(ev) {
  //   ev.preventDefault();
  //   const { data: filename } = await axios.post('/upload-by-link', {
  //     link: photoLink,
  //   });
  //   setAddedPhotos((prev) => [...prev, filename]);
  //   setPhotoLink('');
  // }

  // function uploadPhoto(ev) {
  //   const files = ev.target.files;
  //   const data = new FormData();
  //   for (let i = 0; i < files.length; i++) {
  //     data.append('photos', files[i]);
  //   }

  //   axios
  //     .post('/upload', data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then((response) => {
  //       const { data: filenames } = response;
  //       setAddedPhotos((prev) => [...prev, ...filenames]);
  //     });
  // }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
        title,
        address,
        addedPhotos, // Ensure this is correctly sent
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
      };
      if (addedPhotos.length > 0) {
        placeData.addedPhotos = addedPhotos;
    }
    if(id){
        
         
            await axios.put('/places', {id,...placeData});
            setRedirect(true);
           
    }else{
        await axios.post('/places', placeData);
        setRedirect(true);
    }
    
    
  }
  
  if(redirect){
    return <Navigate to={'/account/places'} />
  }
  
  return (
    <div>
        <AccountNav/>
            <form onSubmit={savePlace}>
              {preInput('Title','Title for your place,should be short and catchy in advertisement')}
             <input type="text" value={title} onChange={ex=>setTitle(ex.target.value)} placeholder='title, for example:My lovely apartment' />

             {preInput('Address','Address to this Place')}
             <input type="text" value={address} onChange={ex=>setAddress(ex.target.value)} placeholder='address' />
             
             {preInput('Photos', 'more = better')}
             <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {/* <div className='flex gap-2'>
              <input value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} type="text" placeholder={'Add using a link ...jpg'} />
              <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl'>Add &nbsp; photo</button>
            </div>


            <div className='mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
              {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                <div className='h-32 flex' key={link}>
                  <img className='rounded-2xl' src={'http://localhost:4000/uploads/' + link} alt="Uploaded" />
                </div>
              ))}
            
            
            <label className='flex  cursor-pointer items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600'>
                <input type="file" className='hidden' onChange={uploadPhoto} multiple  />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload
              </label>
            </div> */}
             
            {preInput('Description','description of the place')}
              <textarea value={description} onChange={ex=>setDescription(ex.target.value)} />

              {preInput('Perks','select all the perks of the place')}
              

             <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
              <Perks selected={perks} onChange={setPerks}/>
             </div>

             {preInput('Extra info','house rules, etc')}
             <textarea value={extraInfo} onChange={ex=>setExtraInfo(ex.target.value)} />

             {preInput('Chech in&out times','add check in and out times, remember to have some time window for cleaning the room for guests ')}
      
             <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
              <div >
                <h3 className='mt-2 -mb-1'>Check in time</h3>
                <input value={checkIn} onChange={ex=>setCheckIn(ex.target.value)} type="time" placeholder='14:00' />
              </div>
              <div>
              <h3 className='mt-2 -mb-1' >Check out time</h3>
                <input value={checkOut} onChange={ex=>setCheckOut(ex.target.value)} type="time" placeholder='11' />
              </div>
              <div>
              <h3 className='mt-2 -mb-1'>Max number of guests</h3>
                <input value={maxGuests} onChange={ex=>setMaxGuests(ex.target.value)} type="number" placeholder='1' />
              </div>
              <div>
              <h3 className='mt-2 -mb-1'>Price per night </h3>
                <input value={price} onChange={ex=>setPrice(ex.target.value)} type="number"  />
              </div>
              
              
             </div>
             

             
              <button className='primary my-4'>save</button>
             
             </form>
          </div>
  )
}

export default PlacesFormPage