import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const Signup = () => {
    const [formData,setformData] = useState({})
    const navigate = useNavigate()
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const handleChange = (e) => {
        setformData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }
    const handleSubmit = async (e) => {
       try {
        e.preventDefault()
        setLoading(true)
        const res = await fetch('/api/v1/auth/signup',
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
        navigate("/signin")
       } catch (error) {
        setLoading(false)
        setError(error.message)
       }
    }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={handleChange} type='text' placeholder='username' className='border p-3 rounded-lg' id='username'/>
        <input onChange={handleChange} type='text' placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input onChange={handleChange} type='password' placeholder='password' className='border p-3 rounded-lg' id='password'/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase'>{loading ? 'Loading...':'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-6'>
        <p>have an account ?</p>
        <Link to="/signin">
            <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signup