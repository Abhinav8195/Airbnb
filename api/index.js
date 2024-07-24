const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const imagedownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const Place = require('./models/Place');
const Booking = require('./models/Bookings');

// Load environment variables
dotenv.config();

// MongoDB connection setup
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;
  return cachedDb;
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

// Helper function to get user data from token
async function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, (err, userData) => {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
}

// Routes
app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }
  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, process.env.BCRYPT_SALT)
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
    }, process.env.JWT_SECRET, {}, (err, token) => {
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

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
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

app.post('/logout', (req, res) => {
  res.cookie('token', '', { maxAge: 1 }).json(true);
});

const photosMulter = multer({ dest: 'uploads/' });

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imagedownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });
    console.log('File downloaded:', newName);
    res.json(newName);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).send('Error downloading image');
  }
});

app.post('/upload', photosMulter.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  try {
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newName = 'photo' + Date.now() + '.' + ext;
      const newPath = __dirname + '/uploads/' + newName;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newName);
    }
    console.log('Uploaded files:', uploadedFiles);
    res.json(uploadedFiles);
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).send('Error uploading files');
  }
});

app.post('/places', async (req, res) => {
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

  try {
    const userData = await getUserDataFromToken(req);
    if (!userData) {
      return res.status(401).send('Unauthorized');
    }

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

app.get('/user-places', async (req, res) => {
  try {
    const { token } = req.cookies;
    const userData = await getUserDataFromToken(req);
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (error) {
    console.error('Error fetching user places:', error);
    res.status(500).send('Server error');
  }
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    res.json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).send('Server error');
  }
});

app.put('/places', async (req, res) => {
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

  try {
    const userData = await getUserDataFromToken(req);
    const placeDoc = await Place.findById(id);

    if (userData.id === placeDoc.owner.toString()) {
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
      });
      await placeDoc.save();
      res.json('ok');
    } else {
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).send('Server error');
  }
});

app.get('/places', async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).send('Server error');
  }
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
  try {
    const user = await getUserDataFromToken(req);
    const bookings = await Booking.find({ user: user.id }).populate('place');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).send('Server error');
  }
});

app.get('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id).populate('place');
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
