import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import { signinFailure, signinStart, signinSuccess } from '../redux/user/userSlice'

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
        navigate("/home")
       } catch (error) {
        dispatch(signinFailure(error.message))
       }
    }
    
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={handleChange} type='text' placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input onChange={handleChange} type='password' placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase'>{loading ? 'Loading...':'Sign Up'}</button>
      </form>
      <div className='flex gap-2 mt-6'>
        <p>have an account ?</p>
        <Link to="/signup">
            <span className='text-blue-700'>Don't have a account</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn