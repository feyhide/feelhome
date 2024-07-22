import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import ListingPage from './pages/ListingPage';
import Search from './pages/Search';
import Calender from './pages/Calender';
import SignInRequest from './pages/SignInRequest';
import { useDispatch } from 'react-redux';
import { setaddress } from './redux/user/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const locationsuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Error fetching location:', data.error);
        } else {
          const city = data.address.city ? data.address.city.split(" ")[0] : 'Unknown';
          dispatch(setaddress({ city, country: data.address.country }));
        }
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  };

  const locationfailed = (error) => {
    setError(error);
    console.error('Geolocation error:', error);
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(locationsuccess, locationfailed);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signinrequest' element={<SignInRequest />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signout' element={<SignOut />} />
        <Route path='/search' element={<Search />} />
        <Route path='/calender' element={<Calender />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile/:profileID' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingID' element={<UpdateListing />} />
          <Route path='/listing/:listingID' element={<ListingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
