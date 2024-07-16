import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Contact from './Contact'
import Message from './Message'
import ListingPageRecommendation from './ListingPageRecommendation'

const ListingPage = () => {
    const {currentUser} = useSelector(state=>state.user)
    const [listing, setListing] = useState({})
    const [contact,setContact] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [imageNo,setimageNo] = useState(0)
    
    //console.log(currentUser,listing)

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
                        <h1 className='text-3xl'>${listing.regularPrice}{listing.pricetype === "" ? "" : `/${listing.pricetype}`}</h1>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-screen h-[90vh] flex gap-2'>
            <div className='w-1/2 h-full relative items-center justify-end  flex flex-wrap'>
                <div className='w-[80%] h-[90%] absolute rounded-xl overflow-hidden'>
                    {listing && listing.imageUrls && (
                        <img className='w-full h-full object-cover' src={listing.imageUrls[imageNo]}/>
                    )}
                    <div className='absolute flex justify-center items-center gap-4 w-full h-[100px] bg-white bg-opacity-80 bottom-10'>
                        {listing && listing.imageUrls && listing.imageUrls.map((url, index) => (
                            <img onClick={()=>setimageNo(index)} className='w-20 h-20 object-contain' src={url} key={index} />
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-1/2 relative h-full flex items-center justify-start'>
                <div className='w-[80%] bg-white relative rounded-xl h-[90%] flex'>
                    {currentUser._id === listing.userRef && (
                        <Link to={`/update-listing/${listing._id}`} className='absolute z-10 top-5 right-5'>
                            <img className='w-full h-full object-contain' src='/editicon.png'/>
                        </Link>
                    )}
                    <Contact listing={listing}/>
                </div>
            </div>
        </div>
        {currentUser._id !== listing.userRef &&  listing && listing.imageUrls && (
            <div className='w-screen mt-10 relative text-black h-[50vh]'>
                <img className='w-full h-full object-cover' src={listing.imageUrls[0]}/>
                <div className='w-full h-full absolute top-0'>
                    <Message listing={listing} />
                </div>
            </div>
        )}
        <div className='w-screen bg-white'>
            <ListingPageRecommendation listing={listing}/>
        </div>
        </>
    )
}

{/* <button type='button' onClick={() => handleDeleteListing(listing._id)} className='text-red-600'>Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-600'>Edit</button>
            </Link> */}

export default ListingPage