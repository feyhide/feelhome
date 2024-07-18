import React, { useEffect, useState } from 'react'
import ListingBox from '../components/ListingBox'
import { Link } from 'react-router-dom'

const MainPageListing = () => {
  const [hotelpreview,sethotelpreview] = useState({})
  const [salepreview,setsalepreview] = useState({})
  const [rentpreview,setrentpreview] = useState({})
  
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
  },[])

  return (
    <div className='w-full font-sub font-bold tracking-[-1px] h-full flex flex-col'>
        <Link to={'/search?searchTerm=&type=hotel&sort=created_at&order=desc'} className='w-full h-1/3 gap-3 bg-red-200 flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listing For Hotels</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={hotelpreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>
        <Link to={'/search?searchTerm=&type=rent&sort=created_at&order=desc'} className='w-full h-1/3 gap-3 bg-red-200 flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listing For Rents</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={rentpreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>
        <Link to={'/search?searchTerm=&type=sale&sort=created_at&order=desc'} className='w-full h-1/3 gap-3 bg-red-200 flex flex-col items-center justify-center'>
          <h1 className='text-4xl tracking-[-2px]'>Listing For Sales</h1>
          <div className='w-full gap-4 flex flex-wrap items-center justify-center'>
            <ListingBox data={salepreview}/>
          </div>
          <h1 className='hover:text-slate-500 transition-all ease'>View More</h1>
        </Link>
    </div>
  )
}

export default MainPageListing