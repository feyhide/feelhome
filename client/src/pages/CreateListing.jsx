import React, { useState } from 'react'
import { app } from '../firebase';
import { getDownloadURL,ref, getStorage, uploadBytesResumable } from 'firebase/storage';

const CreateListing = () => {
    const [files,setFiles] = useState([])
    const [imageUploadError,setimageUploadError] = useState(false)
    const [formData,setformData] = useState({
        imageUrls:[]
    })
    console.log(formData.imageUrls)
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
    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col gap-2 sm:flex-row'>
            <div className='flex flex-col gap-3 flex-1'>
                <input type='text' placeholder='Name' required minLength='10' maxLength="62" id='name' className='border p-3 rounded-lg'/>
                <input type='text' required minLength='10' maxLength="62" id='description' placeholder='Description' className='border p-3 rounded-lg'/>
                <input type='text' required minLength='10' maxLength="62" id='address' placeholder='Address' className='border p-3 rounded-lg'/>
                <div className='flex gap-2'>
                    <div className='flex gap-4 flex-wrap'>
                        <input type='checkbox' id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <input className='border-gray-300 p-3 border' type='number' id='bedrooms' defaultValue='1' min='1' max='10' required/>
                        <span>Beds</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input className='border-gray-300 p-3 border' type='number' id='bathrooms' defaultValue='1' min='1' max='10' required/>
                        <span>Baths</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input className='border-gray-300 p-3 border' type='number' id='regularPrice' defaultValue='1' min='1' required/>
                        <div className='flex flex-col'>
                            <span>Regular Price</span>
                            <span className='text-sm'>($/Month)</span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input className='border-gray-300 p-3 border' type='number' id='discountPrice' defaultValue='1' min='1' required/>
                        <div className='flex flex-col'>
                            <span>Discounted Price</span>
                            <span className='text-sm'>($/Month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1'>
                <p className='font-semibold'>Images:<span className='font-normal text-gray-700'>the first image will be the cover (max 6)</span></p>
                <div className='flex  gap-4'>
                    <input onChange={(e)=>setFiles(e.target.files)} className='p-2 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple/>
                    <button type='button' onClick={handleImage} className='p-3 text-white bg-green-600 border border-green-600 rounded uppercase'>Upload</button>
                </div>
                <p className='text-red-600'>{imageUploadError ? imageUploadError : ''}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div className='flex justify-between p-3 border items-center'>
                            <img key={index} src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg'/>
                            <button onClick={()=>handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase'>Delete</button>
                        </div>
                    ))
                }
                <button className=' p-3 rounded-lg bg-slate-600 text-white'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing