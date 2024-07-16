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
  },[location.pathname])

  console.log(signIn,signUp)
  return (
    <>
      <div className='flex w-full h-[80px] fixed top-0 z-50 bg-white justify-between items-center py-3 mx-auto px-40'>
        <div className='relative w-[200px] h-full'>
          <img className='w-full h-full object-contain' src='/feelhome.png'/>
        </div>
        {/* <form onSubmit={handleSubmit} className='bg-slate-100 p-3 flex items-center rounded-lg'>
          <input value={searchTerm} onChange={(e)=>setsearchTerm(e.target.value)} className='bg-transparent focus:outline-none w-24 sm:w-64' type='text' placeholder='search.....'/>
          <button type='submit'>Submit</button>
          </form> */}
        <ul className='flex gap-4 font-main items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-500 tracking-tight text-[20px] hover:text-black hover:text-[22px] hover:underline transition-all ease'>home</li>
          </Link>
          <Link to='/about'>
              <li className='tracking-tight text-slate-500 text-[20px] hover:underline hover:text-black hover:text-[22px] transition-all ease'>about</li>
            </Link>
          {!currentUser ? (
            <Link onClick={()=>{setsignIn(!signIn),setsignUp(false)}}>
              <li className='hidden tracking-tight sm:inline text-slate-500 text-[20px] transition-all ease hover:text-[22px] hover:underline hover:text-black'>sign in</li>
            </Link>
          ) : (
            <Link to={`/profile/${currentUser._id}`}>
              <img className='w-10 h-10 rounded-full' src={currentUser.avatar} alt=""/>
            </Link>
          )}
        </ul>
      </div>
      {signIn || signUp ? (
        <div className='w-screen h-screen flex items-center justify-center'>

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
            <p onClick={()=>{setsignIn(false),setsignUp(true)}} className='font-main text-md tracking-tight'>
              Don't have an account? <span className='text-blue-400 hover:underline'>Create One</span>
            </p>
          )}
          {signUp && (
            <p onClick={()=>{setsignIn(true),setsignUp(false)}} className='font-main text-md tracking-tight'>
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