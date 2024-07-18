import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ListingBox = ({ data,id }) => {
  const [userlisting, setUserListing] = useState([]);
  const [Landlord,setLandLord] = useState([])

  const params = useParams();

  const getDesc = (desc) => {
    if (desc.length > 30) {
      desc = desc.substring(0, 30) + "...";
    }
    return desc;
  };
  
  if(id){
    useEffect(() => {
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
      const handleShowListing = async() => {
        try {
          const res = await fetch(`/api/v1/user/listings/${id}`)
          const data = await res.json()
          if(data.success === false){
            return
          }
          const filteredListings = data.filter(listing => listing._id !== params.listingID);
          setUserListing(filteredListings)
          console.log(data)
        } catch (error) {
          console.log(error)
        }
        console.log(id)
      }
      fetchLandLord();
      handleShowListing();
    }, [id,params.listingID]);
  }

  if(data){
    useEffect(() => {
      if (data) {
        setUserListing(data);
      }
    }, [data]);
  }

  console.log(userlisting)
  return (
    <>
      {userlisting.length > 0 ? (
        userlisting.map((listing) => (
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
        ))
      ) : (
        <h1 className='font-main text-xl tracking-[-1px]'>{params.listingID ? `${Landlord.username} have no more listing` : "Error Loading Listing"}</h1>
      )}
    </>
  );
};

export default ListingBox;
