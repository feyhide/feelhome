import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import SignIn from '../pages/SignIn'
import Signup from '../pages/Signup'

const Header = () => {
  const {currentUser} = useSelector(state => state.user)
  const [signIn,setsignIn] = useState(false)
  const [signUp,setsignUp] = useState(false)
  const [searchTerm,setsearchTerm] = useState(null)
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("searchTerm",searchTerm);
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if(searchTermFromUrl){
      setsearchTerm(searchTermFromUrl)
    }
  },[location.search])

  useEffect(()=>{
    setsignIn(false)
    setsignUp(false)
  },[location.pathname,currentUser])

  console.log(signIn,signUp)
  return (
    <>
      <div className='flex w-full h-[80px] fixed top-0 z-50 bg-white justify-evenly md:justify-between items-center py-3 md:mx-auto md:px-40'>
        <Link to={'/'} className='relative w-[200px] h-full'>
          <img className='w-full h-full object-contain' src='/feelhome.png'/>
        </Link>
        {/* <form onSubmit={handleSubmit} className='bg-slate-100 p-3 flex items-center rounded-lg'>
          <input value={searchTerm} onChange={(e)=>setsearchTerm(e.target.value)} className='bg-transparent focus:outline-none w-24 sm:w-64' type='text' placeholder='search.....'/>
          <button type='submit'>Submit</button>
          </form> */}
        <ul className='flex gap-4 font-sub items-center'>
          {!currentUser ? (
            <Link onClick={()=>{setsignIn(!signIn),setsignUp(false)}}>
              <li className='tracking-[-1px] sm:inline text-slate-500 text-lg transition-all ease hover:text-[22px] hover:underline hover:text-black'>sign in</li>
            </Link>
          ) : (
            <Link to={`/profile/${currentUser._id}`}>
              <img className='w-10 h-10 rounded-full' src={currentUser.avatar} alt=""/>
            </Link>
          )}
        </ul>
      </div>
      {signIn || signUp ? (
        <div className='w-screen fixed top-0 z-50 h-screen flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm'>
        <div className='w-[500px] relative h-[500px] flex-col justify-center gap-2 items-center flex bg-white rounded-xl'>
          <div onClick={()=>{setsignIn(false),setsignUp(false)}} className='absolute top-5 left-5 w-10 h-10'>
            <img src='/arrowback.png' alt='Back' />
          </div>
          {signIn && (
            <>
              <div className='w-full h-[80%]'>
                <SignIn />
              </div>
            </>
          )}
          {signUp && (
            <div className='w-full h-[80%]'>
              <Signup />
            </div>
          )}
          {signIn && (
            <p onClick={()=>{setsignIn(false),setsignUp(true)}} className='font-sub text-md tracking-[-1px]'>
              Don't have an account? <span className='text-blue-400 hover:underline'>Create One</span>
            </p>
          )}
          {signUp && (
            <p onClick={()=>{setsignIn(true),setsignUp(false)}} className='font-sub text-md tracking-[-1px]'>
              Already have an account ? <span className='text-blue-400 hover:underline'>Sign In</span>
            </p>
          )}
          
        </div>
        </div>
      ) : null}
    </>
  )
}

export default Header