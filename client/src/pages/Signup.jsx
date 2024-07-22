import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { useDispatch, useSelector } from 'react-redux'
import { signinSuccess } from '../redux/user/userSlice'

const Signup = () => {
    const {url} = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const [formData,setformData] = useState({})
    const [otp,setotp] = useState(null)
    const [verify,setverify] = useState(null)
    const navigate = useNavigate()
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }
    const handleOTP = (e) => {
      setotp(e.target.value)
  }
    const handleSubmit = async (e) => {
       try {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`${url}/api/v1/auth/signup`,
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
            setError(data.message)
            setLoading(false)
            return
        }
        setError(null)
        setLoading(false)
        console.log(data)
        setverify(true)
        //navigate("/signin")
       } catch (error) {
        setLoading(false)
        setError(error.message)
       }
    }

    const handleOtpSubmit = async (e) => {
      try {
       e.preventDefault()
       setLoading(true)
       const res = await fetch(`${url}/api/v1/auth/verifyOTP`,
           {
               method: "POST",
               headers: {
                   'Content-Type':'application/json'
               },
               body: JSON.stringify({ otp })
           }
       )
       const data = await res.json()
       if(data.success === false){
           setError(data.message)
           setLoading(false)
           return
       }
       dispatch(signinSuccess(data));
       setError(null)
       setLoading(false)
       //console.log(data)
       //navigate("/")
      } catch (error) {
       setLoading(false)
       setError(error.message)
      }
   }
  return (
    !verify ? (<div className='font-main w-full h-full flex flex-col items-center justify-center p-3'>
      <h1 className='text-4xl text-center font-bold tracking-tighter my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex w-full flex-col gap-4 items-center'>
        <input onChange={handleChange} type='text' placeholder='Username' className='border p-3 rounded-lg w-[70%] tracking-tight bg-slate-100 border-slate-200' id='username'/>
        <input onChange={handleChange} type='text' placeholder='Email Address' className='border p-3 rounded-lg w-[70%] tracking-tight bg-slate-100 border-slate-200' id='email'/>
        <input onChange={handleChange} type='password' placeholder='Password' className='border p-3 rounded-lg w-[70%] tracking-tight bg-slate-100 border-slate-200' id='password'/>
        <button disabled={loading} className='bg-slate-200 border border-white bg-opacity-60 backdrop-blur-xl h-10 transition-all ease text-black rounded-lg uppercase w-[70%] '>{loading ? 'Loading...':'Sign Up'}</button>
        <OAuth/>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>) : (<div className='font-main w-full h-full flex flex-col items-center justify-center p-3'>
      <h1 className='text-4xl text-center font-bold tracking-tighter my-7'>Enter OTP</h1>
      <form onSubmit={handleOtpSubmit} className='flex w-full flex-col gap-4 items-center'>
        <input value={otp} onChange={handleOTP} type='number' placeholder='OTP' className='border p-3 rounded-lg w-[70%] tracking-tight bg-slate-100 border-slate-200' id='otp'/>
        <button disabled={loading} className='bg-slate-200 border border-white bg-opacity-60 backdrop-blur-xl h-10 transition-all ease text-black rounded-lg uppercase w-[70%] '>{loading ? 'Loading...':'Sign Up'}</button>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>)
  )
}

export default Signup