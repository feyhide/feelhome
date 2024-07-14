import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { deleteFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutUserStart, signOutUserSuccess, updateFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import {Link} from 'react-router-dom'
const Profile = () => {
  const dispatch = useDispatch()
  const {loading,error,currentUser} = useSelector((state)=> state.user)
  const [userlisting,setuserlisting] = useState({})
  const imageRef = useRef(null)
  const [file,setfile] = useState(undefined)
  const [filepercentage,setfilepercentage] = useState(0)
  const [fileerror,setfileerror] = useState(null)
  const [formData,setformData] = useState({})
  console.log(filepercentage)
  console.log(fileerror)
  console.log(formData)
  
  // firebasestorage
  // service firebase.storage {
  //   match /b/{bucket}/o {
  //     match /{allPaths=**} {
  //       allow read;
  //       allow write:
  //       if request.resource.size < 2*1024*1024 &&
  //       request.resource.contentType.matches('image/.*');
  //     }
  //   }
  // }


  useEffect(()=>{
    if(file){
      setfileerror(null)
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime()+file.name
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on('state_changed',(snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
      setfilepercentage(Math.round(progress))
    },
    (error) => {
      setfileerror(error)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadUrl)=>{
        setformData({...formData,avatar:downloadUrl})
      })
    });

  }


  const handleChange = (e) => {
    setformData({...formData,[e.target.id]:e.target.value})
  }

  const handleSubmit = async (e) => { 
    e.preventDefault()
    console.log("user updateding")
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/v1/user/update/${currentUser._id}`,{
        method: "POST",
        headers: {
          "Content-Type":'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(updateFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      console.log("user updated:",data)

    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/v1/user/delete/${currentUser._id}`,{
        method: "DELETE"
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(deleteFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
      console.log("user deleted : ", data)
    } catch (error) {
      dispatch(deleteFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('api/v1/auth/signout')
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  const handleShowListing = async() => {
    try {
      const res = await fetch(`/api/v1/user/listings/${currentUser._id}`)
      const data = await res.json()
      if(data.success === false){
        return
      }
      setuserlisting(data)
      console.log(data)
    } catch (error) {
      
    }
  }
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/v1/listing/delete/${id}`,{
        method:"DELETE",
      })
      const data = await res.json()
      if(data.success === false){
        console.log(data.message)
        return
      }
      setuserlisting((prev)=>{
        prev.filter((listing)=>  listing._id !== id )
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-6'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex w-full flex-col items-center justify-center gap-4'>
        <input onChange={(e)=>setfile(e.target.files[0])} accept='image/*' type='file' ref={imageRef} hidden/>
        <img onClick={()=>imageRef.current.click()} className="w-20 h-20 rounded-full" src={formData.avatar || currentUser.avatar} alt=""/>
        {
          fileerror ? (
            <p className='text-red-700'>Error Uploading File</p>
          ) : (
            filepercentage > 0 && filepercentage < 100 ? (
              <p className='text-green-700'>Uploading {filepercentage}%</p>
            ) : (
              ""
            )
          )
        }
        <input type='text' onChange={handleChange} defaultValue={currentUser.username} placeholder='username' className='w-[50%] border p-3 rounded-lg' id='username'/>
        <input type='text' onChange={handleChange} defaultValue={currentUser.email} placeholder='email' className='w-[50%] border p-3 rounded-lg' id='email'/>
        <input type='password' onChange={handleChange} placeholder='password' className='w-[50%] border p-3 rounded-lg' id='password'/>
        <button type='submit' disabled={loading} className='w-[50%] bg-slate-700 text-white p-3 rounded-lg uppercase'>{loading ? "Loading..." : "Update"}</button>
        <Link className='w-[50%] text-center bg-green-700 text-white p-3 rounded-lg uppercase' to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className='flex justify-between px-52 py-2 text-red-600'>
        <span onClick={handleDeleteUser}>Delete Account</span>
        <span onClick={handleSignout}>Sign Out</span>
      </div>
        <p className='mt-5 text-red-700'>{error? error : ''}</p>
        <div className='w-full flex flex-col p-4 items-center justify-center'>
          <button onClick={handleShowListing} className='mb-5 w-[50%] bg-slate-700 text-white p-3 rounded-lg uppercase'>Show Listings</button>
          {userlisting && userlisting.length > 0 && userlisting.map((listing) => (
              <Link key={listing._id} className='w-full flex flex-row relative m-2 h-[200px]'>
                  <img className='w-1/2 h-full object-cover' src={listing.imageUrls[0]} alt='listing images' />
                  <div className='w-1/2 h-full flex flex-col justify-center items-center'>
                    <p>{listing.name}</p>
                    <p>{listing.description}</p>
                    <p>{listing.address}</p>
                  </div>
                  <div>
                    <button type='button' onClick={()=>handleDeleteListing(listing._id)} className='text-red-600'>Delete</button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-600'>Edit</button>
                    </Link>
                  </div>
              </Link>
          ))}
        </div>
    </div>
  )
}

export default Profile