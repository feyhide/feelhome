import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser} = useSelector((state)=> state.user)
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-6'>Profile</h1>
      <form className='flex w-full flex-col items-center justify-center gap-4'>
        <img className="w-20 h-20 rounded-full" src={currentUser.avatar} alt=""/>
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button className='w-[50%] bg-slate-700 text-white p-3 rounded-lg uppercase'>Update</button>
      </form>
    </div>
  )
}

export default Profile