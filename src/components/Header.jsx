import React from 'react'
import {FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'
const Header = () => {
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
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>home</li>
          </Link>
          <Link to='/signin'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>signin</li>
          </Link>
          <Link to='/about'>
            <li className=' text-slate-700 hover:underline'>about</li>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default Header