import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({listing}) => {
    const [Landlord,setLandLord] = useState(null)
    const [posttime,setposttime] = useState('')
    const [message,setmessage] = useState(null)
    const handlemessage = (e) => {
        setmessage(e.target.value)
    }
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

    useEffect(()=>{
        const time = listing.createdAt
        let date = null
        if(time){
            date = time.split('T')[0].split('-').join("/")
            date = date.split('/')
            date = date.reverse().join('/')
        }
        setposttime(date)
    },[listing])
    return (
    <>
    {Landlord && (
        <div className='font-main tracking-[-1px] p-4 w-full h-full flex flex-col'>
            <p className='w-full text-center pt-3 text-3xl'>Listed By <span className='font-bold'>{Landlord.username}</span></p>
            <p className='w-full text-center text-2xl'>For <span className='uppercase font-bold'>{listing.type}</span></p>
            <p className='font-semibold text-2xl w-full'>Description:</p>
            <p className='w-full'>{listing.description}</p>
            <p className='font-semibold text-2xl w-full'>Address: </p>
            <p className='w-full'>{listing.address}</p>
            <div className='w-full gap-4 flex'>
                {listing.parking && (
                    <div className='flex my-2 gap-1 items-center'>
                        <div className='w-5 h-full flex items-center relative'>
                            <img className='w-full h-full object-contain' src='/parkingicon.png'/>
                        </div>
                        <p className=''>Parking</p>
                    </div>
                )}
                {listing.furnished && (
                    <div className='flex my-2 gap-1 items-center'>
                        <div className='w-5 h-full flex items-center relative'>
                            <img className='w-full h-full object-contain' src='/furnishedicon.png'/>
                        </div>
                        <p className=''>Furnished</p>
                    </div>
                )}
            </div>
            <div className='w-full gap-4 flex'>
                <div className='flex my-2 gap-1 items-center'>
                    <div className='w-5 h-full flex items-center relative'>
                        <img className='w-full h-full object-contain' src='/bedroomicon.png'/>
                    </div>
                    <p className=''>{listing.bedrooms} beds</p>
                </div>
                <div className='flex my-2 gap-1 items-center'>
                    <div className='w-5 h-full flex items-center relative'>
                        <img className='w-full h-full object-contain' src='/bathroomicon.png'/>
                    </div>
                    <p className=''>{listing.bathrooms} bathrooms</p>
                </div>
            </div>
            <div className='flex gap-1'>    
                <p>Posted on</p>
                <p>{posttime}</p>
            </div>
            <div>
                
            </div>
            {/* <textarea name='message' placeholder='Message....' value={message} onChange={handlemessage} id='message' rows='2'></textarea>
            <Link to={`mailto:${Landlord.email}?subject=Regrading ${listing.name}&body=${message}`}>
            Send Message
            </Link> */}
        </div>
    )}
    </>
  )
}

export default Contact