import React, { useEffect, useRef, useState } from 'react'
import MainPageListing from './MainPageListing'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

const Home = () => {

  const home1ref = useRef(null);
  const home1text = useRef(null)
  const home2text = useRef(null)
  const home1cont = useRef(null);

  useGSAP(()=>{
    gsap.to(home1ref.current,{
      height:"70%",
      width:"90%",
      duration: 2,
      ease: 'expo.out'      
    })
    gsap.from(home1text.current,{
      opacity:0,
      duration: 0.5,
      delay:2,
      ease: 'expo.out'      
    })
    gsap.from(home2text.current,{
      opacity:0,
      duration: 0.5,
      delay:2,
      ease: 'expo.out'      
    })
  },{scope: home1cont})


  const [searchData,setsearchData] = useState({
      searchTerm:'',
      type:'all',
      sort:"created_at",
      order:"desc"
  })

  const navigate = useNavigate()
  const handleChange = (e) => {
      if(e.target.id === 'all' || e.target.id === 'hotel' || e.target.id === 'rent' || e.target.id === 'sale'){
        setsearchData({...searchData,type:e.target.id})
      }
      if(e.target.id === 'searchTerm'){
        setsearchData({...searchData,searchTerm:e.target.value})
      }
      console.log(searchData)
  }
  const handlesubmit = (e) => {
      e.preventDefault()
      const urlParams = new URLSearchParams()
      urlParams.set("searchTerm",searchData.searchTerm)
      urlParams.set("type",searchData.type)
      urlParams.set("sort",searchData.sort)
      urlParams.set("order",searchData.order)
      const searchQuery = urlParams.toString()
      navigate(`/search?${searchQuery}`)
  }
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  return (
    <>
    <div ref={home1cont} className='w-screen font-main tracking-[-1px] h-screen items-center justify-center flex flex-col'>
      <div ref={home1ref} className='w-full relative rounded-xl overflow-hidden h-[100%]'>
        <video className='w-full h-full object-cover' autoPlay loop muted>
          <source src='/mainvideo.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        <div className='absolute px-10 top-0 items-center  justify-center flex flex-col w-full h-full backdrop-blur-[1px] bg-gradient-to-r from-slate-300 to-transparent'>
            <h1 ref={home1text} className='font-bold text-white font-sub w-full text-center text-wrap text-5xl md:text-7xl tracking-[-4px]'>Find A Place Where</h1>
            <h1 ref={home2text} className='font-bold text-white font-sub w-full text-center text-wrap text-5xl md:text-7xl tracking-[-4px]'>Every Stay Feels Like Home</h1>
        </div>
      </div>
    </div>
    <div className='w-screen h-screen flex items-center justify-center'>
      <form className='w-screen relative h-[50vh] font-sub tracking-tighter items-center justify-center flex flex-col'>
        <img className='w-full h-full object-cover' src='/searchimg.jpg'/>
        <div className='p-10 absolute top-0 w-full h-full items-center justify-center flex flex-col bg-white bg-opacity-35 backdrop-blur-sm'>
          <h1 className='font-bold font-sub text-3xl md:text-5xl w-full text-center text-wrap tracking-[-2px] md:tracking-[-4px]'>Search For Your New Place</h1>
          <div className='w-full md:w-1/2 flex p-2 overflow-hidden bg-white rounded-xl'>
            <input value={searchData.searchTerm} onChange={handleChange} className='w-full outline-none bg-transparent' id='searchTerm' type='text' placeholder='Search... (Particular or City or Country)'/>
            <img className='w-8 md:w-12' onClick={handlesubmit} src='/searchicon.png'/>
          </div>
          <div className='flex gap-4 p-2 font-bold'>
            <div className='flex'>
              <input checked={searchData.type === 'all'} onChange={handleChange} className='w-5' id='all' type='checkbox'/>
              <label>All</label>
            </div>
            <div className='flex'>
              <input checked={searchData.type === 'rent'} onChange={handleChange} className='w-5' id='rent' type='checkbox'/>
              <label>Rent</label>
            </div>
            <div className='flex'>
              <input checked={searchData.type === 'sale'} onChange={handleChange} className='w-5' id='sale' type='checkbox'/>
              <label>Sale</label>
            </div>
            <div className='flex'>
              <input checked={searchData.type === 'hotel'} onChange={handleChange} className='w-5' id='hotel' type='checkbox'/>
              <label>Hotel</label>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div className='w-screen py-10 flex'>
      <MainPageListing/>
    </div>
    <div className='w-screen h-[50vh] bg-white font-sub flex gap-2 tracking-[-1px] flex-col justify-evenly items-center'>
        <img className='w-[150px] h-[100px] md:w-30 md:h-30 object-contain' src='/feelhome.png' alt='Feelhome Logo'/>
        <p className='text-center md:px-20'>
            <span className='tracking-[-2px] font-bold'>Feelhome</span> is a real estate and hotel information site created by Fahad for his fullstack portfolio. Users can create accounts to access detailed information about various places and contact owners for further details. The data used in this project is sourced from Airbnb, and none of the listings are real or for profit. This project highlights Fahad's skills in fullstack development, integrating both front-end and back-end technologies to create a seamless user experience.
        </p>
        <a target='_blank' href='https://www.linkedin.com/in/feyhide/'>
          <img className='w-10 h-10' src='/linkedinicom.png'/>
        </a>
    </div>
    </>
  )
}

export default Home