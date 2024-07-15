import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Contact from './Contact'

const ListingPage = () => {
    const {currentUser} = useSelector(state=>state.user)
    const [listing, setListing] = useState({})
    const [contact,setContact] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [imageNo,setimageNo] = useState(0)
    
    const params = useParams()

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/v1/listing/get/${params.listingID}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(data.message)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingID])
    console.log(listing)

    return (
        <>
        <div className='w-screen h-[90vh] mt-[80px] justify-center items-center flex'>
            <div className='w-[80%] relative h-[70%] rounded-xl overflow-hidden'>
                {listing && listing.imageUrls && (
                    <img className='w-full h-full object-cover' src={listing.imageUrls[1]}/>
                )}
                <div className='absolute top-0 bg-gradient-to-tl from-black via-transparent to-transparent flex items-end w-full h-full '>
                    <div className='font-main bg-gradient-to-tl from-black via-transparent to-transparent text-4xl tracking-[-3px] w-full h-[50vh] text-white flex flex-col items-end justify-end pb-10 pr-10'>
                        <h1>{listing.name}</h1>
                        <div className='w-full flex text-3xl justify-end'>
                            <div className='w-8 h-8  relative'>
                                <img className='w-full h-full object-contain' src='/locationicon.png'/>
                            </div>
                            <h1>{listing.address}</h1>
                        </div>
                        <h1 className='text-3xl'>${listing.regularPrice}/month</h1>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-screen h-[90vh] flex'>
            <div className='w-1/2 h-full relative items-center justify-center  flex flex-wrap'>
                <div className='w-[80%] h-[90%] absolute rounded-xl overflow-hidden'>
                    {listing && listing.imageUrls && (
                        <img className='w-full h-full object-cover' src={listing.imageUrls[imageNo]}/>
                    )}
                    <div className='absolute flex justify-center items-center gap-4 w-full h-[100px] bg-white bg-opacity-80 bottom-10'>
                        {listing && listing.imageUrls && listing.imageUrls.map((url, index) => (
                            <img onClick={()=>setimageNo(index)} className='w-20 h-20' src={url} key={index} />
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-1/2 h-full flex items-center justify-center'>  
                <div className='w-[80%] bg-red-200 rounded-xl h-[90%] flex'>
                    <Contact listing={listing}/>
                </div>
            </div>

        </div>
        </>
    )
}

export default ListingPage