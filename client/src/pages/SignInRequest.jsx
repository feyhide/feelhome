import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const SignInRequest = () => {
    const {currentUser} = useSelector((state)=> state.user)
    
  return (
    !currentUser ? (<div className='w-screen font-sub font-semibold tracking-[-2px] h-screen flex flex-col items-center justify-center'>
        <h1 className='font-bold text-5xl'>To View Full Profiles and Listings</h1>
        <h1 className='text-2xl tracking-tighter'>You need to sign up by clicking on the option in the header</h1>
    </div>) : (
        <Navigate to='/'/>
    )
  )
}

export default SignInRequest