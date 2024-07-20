import React, { useEffect, useState } from 'react';
import ListingBox from '../components/ListingBox';
import { useSelector } from 'react-redux';
import ListingBoxProfile from '../components/ListingBoxProfile';

const ListingPageRecommendation = ({Landlord,listing}) => {

    const [userlisting,setuserlisting] = useState({})

    const {currentUser} = useSelector(state=>state.user)


    const handleShowListing = async() => {
        try {
          const res = await fetch(`/api/v1/user/listings/${listing.userRef}`)
          const data = await res.json()
          if(data.success === false){
            return
          }
          setuserlisting(data)
        } catch (error) {
          
        }
      }
      
      console.log(userlisting)

      useEffect(()=>{
        handleShowListing()
      },[])

  return (
    Landlord && (
        <>
            <div className='w-full font-semibold p-20 gap-3 font-sub flex flex-col justify-center items-center '>
                {listing.userRef === currentUser._id ? (
                    <h1 className='text-4xl tracking-[-2px]'>More Listing Of Yours</h1>
                ) : (
                    <h1 className='text-4xl tracking-[-2px]'>More Listing By {Landlord.username}</h1>
                )}
                <div className='w-full tracking-[0px] flex gap-4 flex-wrap justify-center items-center'>
                    <ListingBox id={listing.userRef}/>
                </div>
            </div>
        </>
    )
  )
}

export default ListingPageRecommendation