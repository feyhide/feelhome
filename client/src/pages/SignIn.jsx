import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { signinFailure, signinStart, signinSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

    const [formData,setformData] = useState({})
    const {loading,error} = useSelector((state)=>state.user)
    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }
    const handleSubmit = async (e) => {
       try {
        e.preventDefault()
        dispatch(signinStart())
        const res = await fetch('/api/v1/auth/signin',
            {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData)
            }
        )
        const data = await res.json()
        if(data.success === false){
            dispatch(signinFailure(data.message))
            return
        }
        dispatch(signinSuccess(data))
        navigate("/")
      } catch (error) {
        dispatch(signinFailure(error.message))
       }
    }

  return (
    <div className='font-main w-full h-full flex flex-col items-center justify-center p-3'>
      <h1 className='text-4xl text-center font-bold tracking-tighter my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex w-full flex-col gap-4 items-center'>
        <input onChange={handleChange} type='text' placeholder='Email Address' className='border p-3 rounded-lg w-[70%] tracking-tight bg-slate-100 border-slate-200' id='email'/>
        <input onChange={handleChange} type='password' placeholder='Password' className='border p-3 rounded-lg w-[70%] tracking-tight bg-slate-100 border-slate-200' id='password'/>
        <button disabled={loading} className='bg-slate-200 border border-white bg-opacity-60 backdrop-blur-xl h-10 transition-all ease text-black rounded-lg uppercase w-[70%] '>{loading ? 'Loading...':'Sign In'}</button>
        <OAuth/>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn