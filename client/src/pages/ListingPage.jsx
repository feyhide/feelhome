import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Contact from './Contact'
import Message from './Message'
import ListingPageRecommendation from './ListingPageRecommendation'
import ListingBox from '../components/ListingBox'

const ListingPage = () => {
    const [city,setcity] = useState('')
    const {currentUser,url} = useSelector(state=>state.user)
    const [Landlord, setLandLord] = useState(null);
    const [listing, setListing] = useState({})
    const [locationListing, setlocationListing] = useState({})
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
        window.scrollTo(0, 0);
    }, [params.listingID])

    console.log(listing)

    useEffect(() => {
        if (listing.address) {
            const tempCity = listing.address.split(/[\/,]/)[0];
            setcity(tempCity);
        }
    }, [listing.address]);

    useEffect(()=>{
        const fetchlocationListing = async () => {
            try {
                console.log(city)
                const res = await fetch(`/api/v1/listing/get?searchTerm=${city}&limit=4`)
                let data = await res.json()
                if(data.success === false){
                    setError(data.message)
                    return 
                }
                data.listings = data.listings.filter(items => items._id != listing._id)
                setlocationListing(data.listings)
                console.log("location listing",data.listings)
            } catch (error) {
                setError(error)
            }
        }
        fetchlocationListing()
    },[city])
    
    useEffect(()=>{
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/v1/user/${listing.userRef}`)
                const data = await res.json()
                if(data.success === false){
                    return 
                }
                setLandLord(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandLord()
    },[listing.userRef])

    return (
        <>
        {!loading && !error && (<>
            <div className='w-screen h-[90vh] md:h-[90vh] mt-[80px] justify-center items-center flex'>
                <div className='w-[80%] relative h-[70%] rounded-xl overflow-hidden'>
                    {!loading && listing && listing.imageUrls && (
                        <img className='w-full h-full object-cover' src={listing.imageUrls[0]}/>
                    )}
                    <div className='absolute top-0 bg-gradient-to-tl from-black via-transparent to-transparent flex items-end w-full h-full '>
                        <div className='font-sub md:px-10 bg-gradient-to-tl from-black via-transparent to-transparent text-2xl md:text-4xl tracking-[-2px] w-full h-[50vh] text-white flex flex-col items-end justify-end pb-10 pr-5 md:pr-10'>
                            <h1 className='tracking-[-1.5px] w-full text-end font-semibold text-2xl md:text-4xl'>{listing.name}</h1>
                            <div className='w-full items-center justify-end flex text-xl tracking-[-1.5px] md:text-3xl'>
                                <div className='w-8 h-8 text-2xl md:text-4xl relative'>
                                    <img className='w-full h-full object-contain' src='/locationicon.png'/>
                                </div>
                                <h1 className='text-lg md:text-3xl'>{listing.address}</h1>
                            </div>
                            <h1 className='text-lg tracking-[-1.5px] md:text-3xl'>${listing.offer ? listing.discountedPrice : listing.regularPrice}{listing.pricetype === "" ? "" : `/${listing.pricetype}`}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-screen h-[200vh] md:h-[100vh] items-center justify-center flex-col md:flex-row flex gap-2'>
                <div className='w-full md:w-1/2 h-1/2 md:h-full relative items-center justify-center md:justify-end  flex flex-wrap'>
                    <div className='w-[80%] h-[90%] absolute rounded-xl overflow-hidden'>
                        {listing && listing.imageUrls && (
                            <img className='w-full h-full object-cover' src={listing.imageUrls[imageNo]}/>
                        )}
                        <div className='absolute flex justify-center items-center gap-4 w-full h-[50px] md:h-[100px] bg-white bg-opacity-80 bottom-10'>
                            {listing && listing.imageUrls && listing.imageUrls.map((url, index) => (
                                <img onClick={()=>setimageNo(index)} className='w-15 md:w-20 h-10 md:h-20 object-contain' src={url} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center md:justify-start'>
                    <div className='w-[80%] justify-center items-center bg-white relative rounded-xl h-[90%] flex'>
                        {currentUser._id === listing.userRef && (
                            <Link to={`/update-listing/${listing._id}`} className='absolute z-10 top-5 right-5'>
                                <img className='w-full h-full object-contain' src='/editicon.png'/>
                            </Link>
                        )}
                        <Contact Landlord={Landlord} listing={listing}/>
                    </div>
                </div>
            </div>
            {currentUser._id !== listing.userRef &&  listing && listing.imageUrls && (
                <div className='w-screen mt-10 relative text-black h-[50vh]'>
                    <img className='w-full h-full object-cover' src={listing.imageUrls[0]}/>
                    <div className='w-full h-full absolute top-0'>
                        <Message Landlord={Landlord} listing={listing} />
                    </div>
                </div>
            )}
            {Landlord && currentUser._id !== Landlord._id && (
                <Link to={`/profile/${Landlord._id}`} className='w-screen h-[20vh] md:h-[30vh] tracking-[-1.5px] font-sub flex flex-col items-center justify-center text-lg md:text-2xl bg-white my-2'>
                    <div className='w-[50px] h-[50px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden bg-red-200'>
                        <img className='w-full h-full object-cover' src={Landlord.avatar}/>
                    </div>
                    <h1>See <span className='font-semibold'>{Landlord.username}'s</span> Profile</h1>
                </Link>
            )}
            <div className='w-screen bg-white mb-10'>
                <ListingPageRecommendation Landlord={Landlord} listing={listing}/>
            </div>
            <div className='w-screen font-sub tracking-[-2px] font-semibold bg-white'>
                <Link to={`/search?searchTerm=${city}&sort=created_at&order=desc`} className='w-full h-1/3 gap-3 flex flex-col items-center justify-center'>
                <h1 className='text-2xl md:text-4xl tracking-[-2px]'>Listings Near This</h1>
                <div className='w-full gap-2 flex flex-wrap items-center justify-center'>
                    <ListingBox data={locationListing}/>
                </div>
                <h1 className='hover:text-slate-500 tracking-[-1px] transition-all ease'>View More</h1>
                </Link>
            </div>
        </>)}
        {!loading && error && (
            <div className='w-screen font-sub h-screen flex items-center justify-center flex-col'>
                <p className='text-5xl tracking-[-2px] font-bold'>Error Loading Listing</p>
                <p className='text-2xl tracking-[-1px] font-semibold'>might be a server issue or this Listing does not exist try searching for another Listing</p>
            </div>    
        )}
        {loading && (
            <div className='w-screen font-sub h-screen flex items-center justify-center flex-col'>
                <p className='text-5xl tracking-[-2px] font-bold'>Loading Listing</p>
            </div> 
        )}
        </>
    )
}


export default ListingPage