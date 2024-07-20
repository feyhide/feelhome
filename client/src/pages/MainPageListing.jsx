import React, { useEffect, useState } from 'react'
import ListingBox from '../components/ListingBox'
import { Link } from 'react-router-dom'

const MainPageListing = () => {
  const [hotelpreview,sethotelpreview] = useState({})
  const [salepreview,setsalepreview] = useState({})
  const [locationpreview,setlocationpreview] = useState({})
  const [rentpreview,setrentpreview] = useState({})
  const [location,setlocation] = useState([])
  const [error,seterror] = useState(null)
  const [useraddress, setuseraddress] = useState({}); 
  
  useEffect(()=>{
    const fetchHotelListing = async () => {
      try {
            const res = await fetch(`/api/v1/listing/get?type=hotel&limit=4`)
            const data = await res.json()
            if(data.success === false){
                console.log(data.message)
                return 
            }
            sethotelpreview(data)
            console.log("hotel listing",data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchHotelListing()
    const fetchRentListing = async () => {
      try {
            const res = await fetch(`/api/v1/listing/get?type=rent&limit=4`)
            const data = await res.json()
            if(data.success === false){
                console.log(data.message)
                return 
            }
            setrentpreview(data)
            console.log("rent listing",data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchRentListing()
    const fetchSaleListing = async () => {
      try {
            const res = await fetch(`/api/v1/listing/get?type=sale&limit=4`)
            const data = await res.json()
            if(data.success === false){
                console.log(data.message)
                return 
            }
            setsalepreview(data)
            console.log("sale listing",data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchSaleListing()
    getUserLocation()
  },[])

  useEffect(()=>{
    const fetchLocationListing = async () => {
      console.log("hello")
      try {
            const res = await fetch(`/api/v1/listing/get?searchTerm=${useraddress.city}&limit=4&sort=created_at&order=desc`)
            const data = await res.json()
            if(data.success === false){
                console.log(data.message)
                return 
            }
            setlocationpreview(data)
            console.log("location listing",data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchLocationListing()
  },[useraddress])
  const locationsuccess = (position) => {
    setlocation(position);
    //console.log(position);

    const { latitude, longitude } = position.coords;
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Error fetching location:', data.error);
        } else {
          data.address.city = data.address.city.split(" ")[0]
          setuseraddress({ city:data.address.city,country:data.address.country});
          console.log(useraddress)
        }
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  };
  
  const locationfailed = (position) => {
    seterror(position)
    console.log(error)
  }

  const getUserLocation = async () =>{
    const position = navigator.geolocation.getCurrentPosition(locationsuccess,locationfailed)
  }


  return (
    <div className='w-full font-sub font-bold gap-10 tracking-[-1px] h-full flex flex-col'>
        {useraddress.city && <Link to={`/search?searchTerm=${useraddress.city}&sort=created_at&order=desc`} className='w-full h-1/3 gap-3 flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listings Near You</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={locationpreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>}
        <Link to={'/search?searchTerm=&type=hotel&sort=created_at&order=desc'} className='w-full h-1/3 gap-3 flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listings For Hotel</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={hotelpreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>
        <Link to={'/search?searchTerm=&type=rent&sort=created_at&order=desc'} className='w-full h-1/3 gap-3 flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listings For Rent</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={rentpreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>
        <Link to={'/search?searchTerm=&type=sale&sort=created_at&order=desc'} className='w-full h-1/3 gap-3  flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listings For Sell</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={salepreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>
    </div>
  )
}

export default MainPageListing