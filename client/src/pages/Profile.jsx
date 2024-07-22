import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { deleteFailure, deleteUserStart, deleteUserSuccess, reset, signOutFailure, signOutUserStart, signOutUserSuccess, updateFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import {Link, useNavigate, useParams} from 'react-router-dom'
import ListingBox from '../components/ListingBox'
import ListingBoxProfile from '../components/ListingBoxProfile'

const Profile = () => { 
    const [currentProfile,setcurrentProfile] = useState({})
    const params = useParams()
    const dispatch = useDispatch()
    const [loadingprofile,setloadingprofile] = useState(false)
    const [update,setupdate] = useState(false)
    const [userLoaderror,setuserLoaderror] = useState(null)
    const {loading,error,currentUser} = useSelector((state)=> state.user)
    const [userlisting,setuserlisting] = useState({})
    const imageRef = useRef(null)
    const [file,setfile] = useState(undefined)
    const [filepercentage,setfilepercentage] = useState(0)
    const [fileerror,setfileerror] = useState(null)
    const [formData,setformData] = useState({})
    const navigate = useNavigate()
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
      setfileerror(null)
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
      setfileerror(null)
      if(e.target.id === "username"){
        let temp = e.target.value
        temp = temp.split(' ').join('')
        setformData({...formData,[e.target.id]: temp})
      }else{
        setformData({...formData,[e.target.id]: e.target.value})
      }
      console.log(formData)
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
        setupdate(false)
        window.location.reload();
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
        const res = await fetch(`/api/v1/auth/signout`)
        const data = await res.json();
        if(data.success === false){
          dispatch(signOutFailure(data.message))
          console.log(data.message)
          return;
        }
        dispatch(signOutUserSuccess())
        navigate("/")
      } catch (error) {
        dispatch(signOutFailure(error.message))
        console.log(error.message)
      }
    }

    useEffect(()=>{
      const fetchProfile = async () => {
          setloadingprofile(true)
          try {
              const res = await fetch(`/api/v1/user/${params.profileID}`)
              const data = await res.json()
              if(data.success === false){
                  checkNoUser()
                  setuserLoaderror(data.success)
                  return 
              }
              setcurrentProfile(data)
              
             setloadingprofile(false)
          } catch (error) {
            setloadingprofile(false)
              setuserLoaderror(error)
              console.log(error)
          }
      }
      fetchProfile()
      window.scrollTo(0, 0);
    },[params.profileID])


    return (
        <>
        {
          !loadingprofile && currentUser._id === currentProfile._id && update && (
            <div className='w-screen h-screen z-30 flex gap-4 flex-col items-center justify-center bg-black bg-opacity-50 fixed top-0'>
              <div className='w-full md:w-1/2 h-[70%] md:h-[500px] flex flex-col items-center justify-center  bg-white rounded-xl relative'>
                  <div onClick={()=>{setupdate(false)}} className='absolute z-10 top-5 left-5 w-10 h-10'>
                    <img src='/arrowback.png' alt='Back' />
                  </div>
                  <div className=' font-sub font-bold tracking-[-1.5px] md:tracking-[-3px]  text-2xl md:text-4xl text-center flex items-center justify-center w-full'>
                    Update Profile
                  </div>
                  <form onSubmit={handleSubmit} className='flex p-10 w-full h-[60%] items-center justify-center gap-2'>
                    <div className=' w-1/2 h-full flex flex-col items-center justify-center'>
                      <input onChange={(e)=>setfile(e.target.files[0])} accept='image/*' type='file' ref={imageRef} hidden/>
                      <div className={`w-[80%] md:w-1/2 h-full overflow-hidden rounded-xl relative`}>
                        <img onClick={()=>imageRef.current.click()} className={`w-full h-full object-cover`} src={formData.avatar || currentUser.avatar} alt=""/>
                      </div>
                      {/* {
                        fileerror ? (
                          <p className='text-red-700'>Error Uploading File</p>
                        ) : (
                          filepercentage > 0 && filepercentage < 100 ? (
                            <p className='text-green-700'>Uploading {filepercentage}%</p>
                          ) : (
                            ""
                          )
                        )
                      } */}
                    </div>
                    <div className=' flex gap-2 font-sub justify-center items-center text-lg w-1/2 h-full flex-col'>  
                      <div className='w-full h-full  flex flex-col gap-2 justify-center items-center tracking-[-1px]'>
                        <div className=' text-base flex flex-col w-full'>
                          <label className='text-lg md:text-xl font-bold'>Username:</label>
                          <input type='text' onChange={handleChange} defaultValue={currentUser.username} placeholder='username' className='border p-2 rounded-lg w-full text-sm md:text-base md:w-[80%] bg-slate-100 ' id='username'/>  
                        </div>
                        <div  className=' text-base flex flex-col w-full'>
                          <label className='text-lg md:text-xl font-bold'>Email:</label>
                          <input type='text' onChange={handleChange} defaultValue={currentUser.email} placeholder='email' className='border p-2 rounded-lg w-full text-sm md:text-base md:w-[80%] bg-slate-100 ' id='email'/>
                        </div>
                        <div  className=' text-base flex flex-col w-full'>
                          <label className='text-lg md:text-xl font-bold'>Password:</label>
                          <input type='password' onChange={handleChange} placeholder='password' className='border p-2 rounded-lg w-full text-sm md:text-base md:w-[80%] tracking-tight bg-slate-100 ' id='password'/>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className='w-full flex p-2 font-sub tracking-[-1px] font-bold items-center justify-center'>
                    <button onClick={handleSubmit} type='submit' disabled={loading} className='bg-green-600 h-10 transition-all ease text-black rounded-lg uppercase w-[50%]'>{loading ? "Loading..." : "Update"}</button>  
                  </div>
                  <div className='text-red-500 w-full font-sub text-lg md:text-xl font-semibold tracking-[-1px] flex justify-evenly items-center gap-5'>
                      <p onClick={handleDeleteUser}>Delete Account</p>
                      <p onClick={handleSignout}>Sign Out</p>
                  </div>
              </div>
            </div>
          )
        }
        {!loadingprofile && !userLoaderror && (
          <>
          <div className='w-screen relative gap-4 font-sub h-1/2 mt-[100px] items-center justify-center flex-col flex'>
          <div className='w-full bg-white h-1/4 p-10 my-10 flex flex-col gap-2'>
            <div className='font-sub font-bold  tracking-[-1.5px] md:tracking-[-3px] text-2xl md:text-5xl text-center flex items-center justify-center w-full h-1/6'>
              {currentUser._id === currentProfile._id ? "Your Profile" : ``}
            </div>
            <div className='w-full h-1/2 relative flex justify-center items-center'>
              <div className='bg-red-600 w-[100px] rounded-full h-[100px] overflow-hidden'>
                <img className='w-full h-full object-cover' src={currentProfile.avatar}/>
              </div>
            </div>
            <div className='text-lg md:text-xl w-full tracking-[-1px] flex-col h-1/2 relative flex justify-start items-center'>
              {currentUser._id === currentProfile._id && (
                <img onClick={()=>{setupdate(true)}} className='w-5 h-5' src='/editicon.png'/>
              )}
              <h1 className='font-semibold'>@{currentProfile.username}</h1>
              <h1 className='text-base'>{currentProfile.email}</h1>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-10'>
          <div className='mt-2 -mb-2 font-sub font-bold tracking-[-1.5px] md:tracking-[-3px] text-2xl md:text-5xl text-center flex px-10 items-end justify-center w-full h-1/6'>
            {currentUser._id === currentProfile._id ? (
              <div className='w-full flex flex-col items-center p-2'>
                <p className='z-10'>Your Listing</p>
                <Link to={'/create-listing'} className='text-lg md:text-xl tracking-[-1px] font-semibold bg-green-500 p-1 w-full md:w-[20%] rounded-lg text-white'>Create Listing</Link>
              </div>
            ) : `${currentProfile.username}'s Listings`}
          </div>
          <div className='flex w-full min-h-4/5 tracking-[0px] flex-wrap gap-4 justify-center'>
            <ListingBoxProfile id={params.profileID}/>
          </div>
        </div>
        </>
        )}
        {!loadingprofile && userLoaderror && (
          <div className='w-screen font-sub h-screen flex items-center justify-center flex-col'>
            <p className='text-2xl md:text-5xl tracking-[-2px] font-bold'>Error Loading Profile</p>
            <p className='text-2xl tracking-[-1px] font-semibold'>might be a server issue or this Profile does not exist try searching for another Profile</p>
          </div>
        )}
        {loadingprofile && (
            <div className='w-screen font-sub h-screen flex items-center justify-center flex-col'>
                <p className='text-5xl tracking-[-2px] font-bold'>Loading Profile</p>
            </div> 
        )}
      </>
    )
}

export default Profile