const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const imagedownloader = require('image-downloader')
const secret = bcrypt.genSaltSync(10);
const jwtsecret = 'asdfghjkl';
const multer = require('multer')
const fs = require('fs')
const Place = require('./models/Place');
const Booking = require('./models/Bookings')

app.use(express.json());
app.use(cookieparser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
dotenv.config();
mongoose.connect(process.env.MONGO_URL);


function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtsecret, {}, (err, userData) => {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
}
app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }
  // Add more specific validations for email and password format
  try {
    const user = await User.create({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, secret)
    });
    res.json({ user });
  } catch (error) {
    res.status(422).json({ error: 'Registration failed. Please try again.' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json('No user found');
    }
    const passOk = bcrypt.compareSync(password, user.password);
    if (!passOk) {
      return res.status(401).json('Incorrect email or password');
    }
    jwt.sign({
      email: user.email,
      id: user._id,
    }, jwtsecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json(user);
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json('An error occurred');
  }
});


app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  try {
      if (!token) {
          throw new Error('Authentication token not found');
      }

      jwt.verify(token, jwtsecret, {}, async (err, userData) => {
          if (err) {
              throw new Error('Invalid or expired token');
          }
          const user = await User.findById(userData.id);
          if (!user) {
              throw new Error('User not found');
          }
          res.json({ name: user.name, email: user.email, _id: user._id });
      });
  } catch (error) {
      console.error('Error in /profile route:', error);
      res.status(401).json({ error: 'Authentication failed' });
  }
});

app.post('/logout', async (req, res) => {
    res.cookie('token', '', { maxAge: 1 }).json(true);
  });

  const photosmulter = multer({ dest: 'uploads' });

  app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    try {
      await imagedownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
      });
      console.log('File downloaded:', newName); // Log the file name
      res.json(newName);
    } catch (error) {
      console.error('Error downloading image:', error);
      res.status(500).send('Error downloading image');
    }
  });
  
  
  app.post('/upload', photosmulter.array('photos', 100), async (req, res) => {
    const uploadedFiles = [];
    try {
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newName = 'photo' + Date.now() + '.' + ext; // Generate a unique filename
            const newPath = __dirname + '/uploads/' + newName; // Construct the new path
            fs.renameSync(path, newPath); // Move the file to the uploads folder with the new name
            uploadedFiles.push(newName);
      }
      console.log('Uploaded files:', uploadedFiles); // Log the uploaded files
      res.json(uploadedFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).send('Error uploading files');
    }
  });
  
  
  app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
      title,
      address,
      addedPhotos, 
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    } = req.body;
  
    console.log('Request body:', req.body); 
  
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
      if (err) {
        console.error('JWT verification error:', err);
        res.status(401).send('Unauthorized');
        return;
      }
  
      try {
        const placeDoc = await Place.create({
          owner: userData.id,
          title,
          address,
          photos: addedPhotos, 
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price
        });
        res.json(placeDoc);
      } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).send('Server error');
      }
    });
  });
  
  
  

  app.get('/user-places',async(req,res)=>{
    const { token } = req.cookies;
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        const {id} =userData;
        res.json(await Place.find({owner:id}))
    })
  });
  app.get('/places/:id',async(req,res)=>{
    const {id} =req.params;
    res.json(await Place.findById(id))
  })
  app.put('/places',async(req,res)=>{
    const { token } = req.cookies;
    const {
        id,
        title,
        address,
        addedPhotos, 
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
      } = req.body;
      
      jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        if(err) throw err;
        const placeDoc = await Place.findById(id)
        if(userData.id === placeDoc.owner.toString()){
            placeDoc.set({
               
          title,
          address,
          photos: addedPhotos, 
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price
            })
          await   placeDoc.save()
            res.json('ok')
        }
      })
  });

app.get('/places',async(req,res)=>{
  res.json (await Place.find({}))
});

app.post('/booking', async (req, res) => {
  try {
    const userData = await getUserDataFromToken(req);
    if (!userData) {
      throw new Error('User is not logged in');
    }

    const { place, checkIn, checkOut, price, numofguest, name, mobile } = req.body;
    const booking = await Booking.create({
      place,
      checkIn,
      checkOut,
      price,
      numofguest,
      name,
      mobile,
      user: userData.id
    });
    
    res.json(booking);
  } catch (error) {
    console.error('Error occurred while creating booking:', error);
    res.status(400).json({ error: error.message });
  }
});




app.get('/singlebookings', async (req, res) => {
  const user = await getUserDataFromToken(req);
  res.json(await Booking.find({ user: user.id }).populate('place'));
});

app.listen(4000);
