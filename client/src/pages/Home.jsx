import React, { useState } from 'react'
import MainPageListing from './MainPageListing'
import { useNavigate } from 'react-router-dom'

const Home = () => {
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
  return (
    <>
    <div className='w-screen font-main tracking-[-1px] h-screen items-center justify-center flex flex-col'>
      <div className='w-full relative h-[70%]'>
        <img className='w-full h-full object-cover' src='/mainbg.avif'/>
        <div className='absolute px-[250px] top-0 items-center justify-center flex flex-col w-full h-full backdrop-blur-[1px] bg-gradient-to-r from-slate-300 to-transparent'>
          <div className='w-full'>
            <h1 className='font-bold text-white font-sub text-7xl text-wrap tracking-[-4px]'>Find A Place Where</h1>
          </div>
          <div className='w-full z-10 text-white items-center justify-end flex'>
            <h1 className='font-bold font-sub text-7xl text-wrap tracking-[-4px]'>Every Stay Feels Like Home</h1>
          </div>
        </div>
      </div>
    </div>
    <div className='w-screen h-screen flex items-center justify-center'>
      <form className='w-screen relative h-[50vh] font-sub tracking-tighter items-center justify-center flex flex-col'>
        <img className='w-full h-full object-cover' src='/searchimg.jpg'/>
        <div className='absolute top-0 w-full h-full items-center justify-center flex flex-col bg-white bg-opacity-35 backdrop-blur-sm'>
          <h1 className='font-bold font-sub text-5xl text-wrap tracking-[-4px]'>Search For Your New Place</h1>
          <div className='w-1/2 flex p-2 overflow-hidden bg-white rounded-xl'>
            <input value={searchData.searchTerm} onChange={handleChange} className='w-full outline-none bg-transparent' id='searchTerm' type='text' placeholder='Search... (Particular or City or Country)'/>
            <img onClick={handlesubmit} src='/searchicon.png'/>
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
    <div className='w-screen h-[150vh] flex'>
      <MainPageListing/>
    </div>
    </>
  )
}

export default Home