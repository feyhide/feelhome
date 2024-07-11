import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'

const Header = () => {
  const {currentUser} = useSelector(state => state.user)

  return (
    <div className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center mx-auto p-3'>
        <h1 className='text-bold text-sm sm:text-xl flex flex-wrap'>
            <span>Real</span>
            <span>Estate</span>
        </h1>
        <form className='bg-slate-100 p-3 flex items-center rounded-lg'>
          <input className='bg-transparent focus:outline-none w-24 sm:w-64' type='text' placeholder='search.....'/>
        </form>
        <ul className='flex gap-4 items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>home</li>
          </Link>
          <Link to='/about'>
              <li className=' text-slate-700 hover:underline'>about</li>
            </Link>
          {!currentUser ? (
            <Link to='/signin'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>signin</li>
            </Link>
          ) : (
            <Link to='/profile'>
              <img className='bg-red-200 w-10 h-10 rounded-full' src={currentUser.avatar} alt=""/>
            </Link>

          )}
        </ul>
      </div>
    </div>
  )
}

export default Header