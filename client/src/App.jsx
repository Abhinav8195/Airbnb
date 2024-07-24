import './App.css'
import IndexPage from './Pages/IndexPage'
import Loginpage from './Pages/Loginpage'
import Layout from './Layout'
import RegisterPage from './Pages/Registerpage'
import axios from 'axios'
import {Routes,Route} from 'react-router-dom'
import { UserContextProvider } from './UserContext'
import Accountpage from './Pages/ProfilePage'
import Placespage from './Pages/Placespage'
import PlacesFormPage from './Pages/PlacesFormPage'
import Placepage from './Pages/Placepage'
import BookingsPage from './Pages/BookingsPage'
import SinglebookingPage from './Pages/SinglebookingPage';

axios.defaults.baseURL='http://localhost:4000'
axios.defaults.withCredentials=true               
function App() {
  
  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage/>} />
          <Route path='/login' element={<Loginpage/>} />
          <Route path='/register' element={<RegisterPage/> } />
          <Route path='/account' element={<Accountpage />}/>
          <Route path='/account/places' element={<Placespage />} />
          <Route path='/account/places/new' element={<PlacesFormPage />} />
          <Route path='/account/places/:id' element={<PlacesFormPage />} /> 
          <Route path='/place/:id' element={<Placepage />} /> 
          <Route path='/account/bookings' element={<BookingsPage />} /> 
          <Route path='/account/bookings/:id' element={<SinglebookingPage />} /> 
          

      </Route>
    </Routes>
    </UserContextProvider>

    
  )
}

export default App
