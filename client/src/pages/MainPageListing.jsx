import React, { useEffect, useRef, useState } from 'react'
import ListingBox from '../components/ListingBox'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useSelector } from 'react-redux'

const MainPageListing = () => {
  const container = useRef(null)
  const boxes = useRef([])
  const {address} = useSelector(state=>state.user)
  const [hotelpreview, sethotelpreview] = useState({})
  const [salepreview, setsalepreview] = useState({})
  const [locationpreview, setlocationpreview] = useState({})
  const [rentpreview, setrentpreview] = useState({})
  const [location, setlocation] = useState([])
  const [error, seterror] = useState(null)

  useEffect(() => {
    const fetchHotelListing = async () => {
      try {
        const res = await fetch(`/api/v1/listing/get?type=hotel&limit=4`)
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        sethotelpreview(data.listings)
        console.log("hotel listing", data.listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchHotelListing()
    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/v1/listing/get?type=rent&limit=4`)
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        setrentpreview(data.listings)
        console.log("rent listing", data.listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchRentListing()
    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`/api/v1/listing/get?type=sale&limit=4`)
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        setsalepreview(data.listings)
        console.log("sale listing", data.listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSaleListing()
  }, [])

  useEffect(() => {
    const fetchLocationListing = async () => {
      //console.log("hello")
      try {
        const res = await fetch(`/api/v1/listing/get?searchTerm=${address.city}&limit=4&sort=created_at&order=desc`)
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        setlocationpreview(data.listings)
        console.log("location listing", data.listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLocationListing()
  }, [address])

  useEffect(() => {
    if (boxes.current.length > 0) {
      boxes.current.forEach((box, index) => {
        gsap.to(box, {
          duration: 1 + Math.random() * 1, // 3 to 5 seconds
          x: `+=${Math.random() * 20 - 10}`, // -10 to 10 px
          y: `+=${Math.random() * 20 - 10}`, // -10 to 10 px
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.5, // staggered start
        })
      })
    }
  }, [hotelpreview, salepreview, locationpreview, rentpreview])


  return (
    <div ref={container} className='w-full font-sub font-bold gap-10 tracking-[-1px] h-full flex flex-col'>
      {address && address.city && <Link to={`/search?searchTerm=${address.city}&sort=created_at&order=desc`} className='md:flex-row flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50  w-full h-1/3 gap-3 flex items-center justify-center'>
        <div className='w-full md:w-1/2 items-center h-1/2 md:h-full flex flex-col gap-2 md:mb-0 mb-2 md:gap-4'>
          <h1 className='text-3xl w-full text-center md:text-6xl tracking-[-2px]'>Listings Near You</h1>
          <div className=' items-center flex'>
            <img className='w-10' src='/blacklocationicon.png' />
            <h1 className='text-2xl md:text-4xl italic tracking-[-1.5px]'>{address.city}</h1>
          </div>
          <h1 className='text-base md:text-xl hover:text-slate-500 transition-all ease'>View More</h1>
        </div>
        <div ref={el => (boxes.current[0] = el)} className='w-full md:rotate-[10deg] md:w-1/2 h-1/2 md:h-full gap-2 md:gap-4 flex flex-wrap items-center justify-center'>
          <ListingBox data={locationpreview} />
        </div>
      </Link>}
      <Link to={'/search?searchTerm=&type=hotel&sort=created_at&order=desc'} className='md:flex-row flex-col-reverse bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50  w-full h-1/3 gap-3 flex items-center justify-center'>
        <div ref={el => (boxes.current[1] = el)} className='md:rotate-[10deg] w-full md:w-1/2 h-1/2 md:h-full gap-2 flex flex-wrap items-center justify-center'>
          <ListingBox data={hotelpreview} />
        </div>
        <div className='w-full md:w-1/2 h-1/2 md:h-full items-center flex flex-col gap-4'>
          <h1 className='text-3xl w-full text-center md:text-6xl tracking-[-2px]'>Listings For Hotel</h1>
          <h1 className='text-base md:text-xl text-center hover:text-slate-500 transition-all ease'>View More</h1>
        </div>
      </Link>
      <Link to={'/search?searchTerm=&type=rent&sort=created_at&order=desc'} className='md:flex-row flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50  w-full h-1/3 gap-3 flex items-center justify-center'>
        <div className='w-full md:w-1/2 h-1/2 md:h-full items-center flex flex-col gap-4'>
          <h1 className='text-3xl w-full text-center md:text-6xl tracking-[-2px]'>Listings For Rent</h1>
          <h1 className='text-base md:text-xl text-center hover:text-slate-500 transition-all ease'>View More</h1>
        </div>
        <div ref={el => (boxes.current[2] = el)} className='md:rotate-[10deg] w-full md:w-1/2 h-1/2 md:h-full gap-2 flex flex-wrap items-center justify-center'>
          <ListingBox data={rentpreview} />
        </div>
      </Link>
      <Link to={'/search?searchTerm=&type=sale&sort=created_at&order=desc'} className='md:flex-row flex-col-reverse bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50  w-full h-1/3 gap-3  flex  items-center justify-center'>
        <div ref={el => (boxes.current[3] = el)} className='md:rotate-[10deg] w-full md:w-1/2 h-1/2 md:h-full gap-2 flex flex-wrap items-center justify-center'>
          <ListingBox data={salepreview} />
        </div>
        <div className='w-full md:w-1/2 h-1/2 md:h-full items-center flex flex-col gap-2'>
          <h1 className='text-3xl w-full text-center md:text-6xl tracking-[-2px]'>Listings For Sale</h1>
          <h1 className='text-base md:text-xl text-center hover:text-slate-500 transition-all ease'>View More</h1>
        </div>
      </Link>
    </div>
  )
}

export default MainPageListing
