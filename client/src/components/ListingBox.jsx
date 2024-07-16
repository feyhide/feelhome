import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import listing from '../../../api/models/listing.model';

const ListingBox = ({ id }) => {
  const [userlisting, setUserListing] = useState([]);
  const [currentlisting,setcurrentlisting] = useState('')

  const params = useParams()
  const getDesc = (desc) => {
    if(desc.length > 30){
        desc = desc.substring(0,30) + "..."
    }
    return desc
  }
  const handleShowListing = async() => {
    try {
      const res = await fetch(`/api/v1/user/listings/${id}`)
      const data = await res.json()
      if(data.success === false){
        return
      }
      setUserListing(data)
      console.log(data)
    } catch (error) {
      
    }
  }
  

  //console.log("id prop",id)
  useEffect(() => {
    if(params.listingID){
        setcurrentlisting(params.listingID)
    }
    console.log(id)
    handleShowListing();
  }, []);

  console.log(userlisting)

  return (
    <>
      {userlisting
        .filter(listing => {
            return listing._id !== currentlisting;
        })
        .map(listing => (
            <Link
            to={`/listing/${listing._id}`}
            key={listing._id}
            className='flex-shrink-0 font-main tracking-[0px] w-[300px] h-[250px] rounded-xl overflow-hidden flex flex-row relative'
            >
            <img className='w-full h-full object-cover' src={listing.imageUrls[0]} alt='listing images' />
            <div className='w-full hover:bg-black transition-all ease bg-gradient-to-t from-black to-transparent bg-opacity-60 text-white font-light absolute h-full flex flex-col justify-end p-5 items-start'>
                <p className='font-semibold tracking-tighter'>{listing.name}</p>
                <p className='text-xs'>{getDesc(listing.description)}</p>
                <p className='text-xs'>{listing.address}</p>
            </div>
            </Link>
        ))}
        {userlisting.length < 1 && (
            <h1 className='font-main text-xl tracking-[-1px]'>You currently have no listing</h1>
        )}
    </>
  );
};

export default ListingBox;
