import React, { useEffect, useState } from 'react'
import { app } from '../firebase';
import { getDownloadURL,ref, getStorage, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate,useParams} from 'react-router-dom';

const UpdateListing = () => {
    const params = useParams()
    const [files,setFiles] = useState([])
    const [imageUploadError,setimageUploadError] = useState(false)
    const [formData,setformData] = useState({
        imageUrls:[],
        name:'',
        description:``,
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountedPrice:0,
        offer:false,
        parking:false,
        furnished:false
    })
    const {currentUser} = useSelector(state => state.user)
    const [loading,setloading] = useState(false)
    const [error,seterror] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchListing = async () => {
            const listingId = params.listingID
            const res = await fetch(`/api/v1/listing/get/${listingId}`)
            const data = await res.json();
            if(data.success === false){
                console.log('error',data.message)
                return 
            }
            setformData(data)
            console.log(data)
        }
    fetchListing()
    },[])

    const handleImage = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls)=>{
                setformData({...formData,imageUrls:formData.imageUrls.concat(urls)})
                setimageUploadError(false)
            }).catch((err)=>{
                console.log(err)
                setimageUploadError("Image Upload Failed (2 mb max)")
            })
        }else{
            setimageUploadError("Image Upload Failed (only 6 images)")
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName)
            const uploadTask = uploadBytesResumable(storageRef,file)
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setformData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i)=> i !== index)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent' || e.target.id === 'hotel'){
            setformData({
                ...formData,
                type:e.target.id
            })
            if (e.target.id === 'sale') {
                setformData(prevState => ({
                    ...prevState,
                    pricetype: ''
                }));
            } else if (e.target.id === 'rent') {
                setformData(prevState => ({
                    ...prevState,
                    pricetype: 'month'
                }));
            } else if (e.target.id === 'hotel') {
                setformData(prevState => ({
                    ...prevState,
                    pricetype: 'night'
                }));
            }
        }

        if(e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === "offer"){
            setformData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if(e.target.id !== 'description' && (e.target.type === 'number' || e.target.type === 'text')){
            setformData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
        if(e.target.id === 'description'){
            setformData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
        console.log(formData)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        //const formattedDescription = formData.description.replace(/(\r\n|\n|\r)/gm, '(_)');
        setformData({
            ...formData,
            description: formData.description
        })

        try {
            if(formData.imageUrls.length < 1 ){
                seterror("you must upload at least one image")
                return
            }
            if(+formData.regularPrice<+formData.discountedPrice){
                seterror("Discounted price must be lower than regular ones")
                return
            }
            setloading(true)
            seterror(null)
            const listingId = params.listingID
            const res = await fetch(`/api/v1/listing/update/${listingId}`,{
                method:"PATCH",
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef:currentUser._id
                })
            })
            const data = await res.json();
            setloading(false);
            if(data.success == false){
                seterror(data.message)
                return
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            seterror(error.message)
            setloading(false)
        }
    }

    const handleDeleteListing = async () => {
        
        const id = params.listingID
        try {
          const res = await fetch(`/api/v1/listing/delete/${id}`,{
            method:"DELETE",
          })
          const data = await res.json()
          if(data.success === false){
            console.log(data.message)
            return
          }
          console.log("deleted")
          navigate('/')
        } catch (error) {
          console.log(error)
        }
      }

    return (
    <main className='p-3 w-screen flex flex-col justify-center items-center font-main tracking-[-1px] mx-auto mt-[100px]'>
        <h1 className='text-5xl font-bold text-center tracking-[-2px] mt-10 mb-3'>Update Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-10 rounded-xl bg-white w-[80%] sm:flex-row'>
            <div className='flex flex-col gap-3 flex-1'>
                <div className='flex flex-col'>
                    <label className='font-semibold text-lg'>Title</label>
                    <input value={formData.name} onChange={handleChange} type='text' placeholder='Name' required minLength='10' maxLength="62" id='name' className='bg-slate-300 border p-3 rounded-lg'/>
                </div>
                <div className='flex flex-col'>
                    <label className='font-semibold text-lg'>Address</label>
                    <input value={formData.address} onChange={handleChange} type='text' required minLength='10' maxLength="62" id='address' placeholder='Address' className='bg-slate-300 border p-3 rounded-lg'/>
                </div>
                <div className='flex flex-col'>
                    <label className='font-semibold text-lg'>Description</label>
                    <textarea value={formData.description} onChange={handleChange} type='text' required minLength='10' id='description' placeholder='Description' className='bg-slate-300  border p-3 rounded-lg'/>
                </div>
                
                <div className='flex gap-3'>
                    <div className='flex gap-1 flex-wrap'>
                        <input checked={formData.type === "sale"} onChange={handleChange} type='checkbox' id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.type === 'rent'} onChange={handleChange} type='checkbox' id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.parking} onChange={handleChange} type='checkbox' id='parking' className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.furnished} onChange={handleChange} type='checkbox' id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input checked={formData.offer} onChange={handleChange} type='checkbox' id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <input value={formData.bedrooms} onChange={handleChange} className='bg-slate-300 rounded-lg border-gray-300 p-3 border' type='number' id='bedrooms' defaultValue='1' min='1' max='10' required/>
                        <span>Beds</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input value={formData.bathrooms} onChange={handleChange} className='bg-slate-300 rounded-lg border-gray-300 p-3 border' type='number' id='bathrooms' min='1' max='10' required/>
                        <span>Baths</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input value={formData.regularPrice} onChange={handleChange} className='bg-slate-300 rounded-lg border-gray-300 p-3 border' type='number' id='regularPrice' defaultValue='1' min='1' required/>
                        <div className='flex flex-col'>
                            <span>Regular Price</span>
                            <span className='text-sm'>($/Month)</span>
                        </div>
                    </div>
                    {formData.offer ? (
                        <div className='flex gap-2 items-center'>
                            <input value={formData.discountedPrice} onChange={handleChange} className='bg-slate-300 rounded-lg cborder-gray-300 p-3 border' type='number' id='discountedPrice' defaultValue='1' min='1' required/>
                            <div className='flex flex-col'>
                                <span>Discounted Price</span>
                                <span className='text-sm'>($/Month)</span>
                            </div>
                        </div>
                    ): ""}
                </div>
            </div>
            <div className='flex items-center justify-center flex-col gap-3 flex-1'>
                <p className='font-semibold text-lg'>Images:<span className='px-2 font-normal text-gray-700'>the first image will be the cover (max 6)</span></p>
                <div className='flex w-full gap-4'>
                    <input onChange={(e)=>setFiles(e.target.files)} className='p-2 border border-gray-300 rounded-lg bg-slate-300 w-full' type='file' id='images' accept='image/*' multiple/>
                </div>
                <button type='button' onClick={handleImage} className='p-3 w-1/2 text-white bg-green-600 border border-green-600 rounded-lg uppercase'>Upload</button>
                <p className='text-red-600'>{imageUploadError ? imageUploadError : ''}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div className='flex w-full h-[100px] rounded-xl justify-between p-3 border items-center'>
                            <img key={index} src={url} alt='listing image' className='w-1/2 h-full object-contain rounded-lg'/>
                            <button onClick={()=>handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase'>Delete</button>
                        </div>
                    ))
                }
                <button disabled={loading} onClick={() => handleDeleteListing()} className='w-1/2 p-3 rounded-lg bg-red-600 text-white'>{loading ? "Loading...": 'Delete Listing'}</button>
                <button disabled={loading} className=' p-3 rounded-lg w-1/2 bg-green-600 text-white'>{loading ? "Loading...": 'Update Listing'}</button>
                {error ? <p className='text-sm text-red-600'>${error}</p> : ""}
            </div>
        </form>
    </main>
  )
}

export default UpdateListing