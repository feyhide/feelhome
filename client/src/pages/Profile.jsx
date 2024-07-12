import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser} = useSelector((state)=> state.user)
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-6'>Profile</h1>
      <form className='flex w-full flex-col items-center justify-center gap-4'>
        <img className="w-20 h-20 rounded-full" src={currentUser.avatar} alt=""/>
        <input type='text' placeholder='username' className='w-[50%] border p-3 rounded-lg' id='username'/>
        <input type='text' placeholder='email' className='w-[50%] border p-3 rounded-lg' id='email'/>
        <input type='password' placeholder='password' className='w-[50%] border p-3 rounded-lg' id='password'/>
        <button className='w-[50%] bg-slate-700 text-white p-3 rounded-lg uppercase'>Update</button>
      </form>
      <div className='flex justify-between px-52 py-2 text-red-600'>
        <span>Delete Account</span>
        <span>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile