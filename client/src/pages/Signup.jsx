import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username'/>
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input type='text' placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-6'>
        <p>have an account ?</p>
        <Link to="/signin">
            <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default Signup