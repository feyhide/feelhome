import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const ListingBoxProfile = ({ id }) => {
  const {url} = useSelector(state=>state.user)
  const [userlisting, setUserListing] = useState([]);
  const [currentlisting,setcurrentlisting] = useState('')
  const [hasRent,sethasRent] = useState(false)
  const [hasSale,sethasSale] = useState(false)
  const [hasHotel,sethasHotel] = useState(false)

  const params = useParams()
  const getDesc = (desc) => {
    if(desc.length > 30){
        desc = desc.substring(0,30) + "..."
    }
    return desc
  }
  const handleShowListing = async() => {
    setUserListing(null)
    try {
      const res = await fetch(`/api/v1/user/listings/${id}`)
      const data = await res.json()
      if(data.success === false){
        return
      }
      const filteredListings = data.filter(listing => listing._id !== currentlisting);
      setUserListing(filteredListings)
      const hasRent = filteredListings.some(listing => listing.type === 'rent');
      const hasSale = filteredListings.some(listing => listing.type === 'sale');
      const hasHotel = filteredListings.some(listing => listing.type === 'hotel');
        
      sethasRent(hasRent);
      sethasSale(hasSale);
      sethasHotel(hasHotel);
      console.log(data)
    } catch (error) {
      
    }
  }
  

  //console.log("id prop",id)
  useEffect(() => {
    setcurrentlisting(null)
    if(params.listingID){
        setcurrentlisting(params.listingID)
    }
    console.log(id)
    handleShowListing();
  }, [params.listingID]);

  console.log(userlisting)

  return (
    <>
        {userlisting && (
            <>
                {hasRent && (
                    <div className='w-full flex flex-col font-sub font-bold tracking-[-1.5px]'>
                        <h1 className='w-full text-center p-5 text-xl md:text-3xl'>For Rent</h1>
                        <div className='w-full flex-wrap flex gap-2 items-center justify-center'>
                            {userlisting
                                .filter(listing => listing.type === 'rent')
                                .map(listing => (
                                <Link
                                to={`/listing/${listing._id}`}
                                key={listing._id}
                                className='flex-shrink-0 font-main tracking-[0px] w-[160px] h-[300px] md:w-[300px] md:h-[250px] rounded-xl overflow-hidden flex flex-row relative'
                                >
                                <img className='w-full h-full object-cover' src={listing.imageUrls[0]} alt='listing images' />
                                <div className='w-full hover:bg-black transition-all ease bg-gradient-to-t from-black to-transparent bg-opacity-60 text-white font-light absolute h-full flex flex-col justify-end p-5 items-start'>
                                    <p className='text-sm md:text-base font-semibold tracking-tighter'>{listing.name}</p>
                                    <p className='text-xs'>{getDesc(listing.description)}</p>
                                    <p className='text-xs'>{listing.address}</p>
                                </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                {hasSale && (
                    <div className='w-full flex flex-col font-sub font-bold tracking-[-1.5px]'>
                        <h1 className='w-full text-center p-5 text-xl md:text-3xl'>For Sale</h1>
                        <div className='w-full flex gap-4 flex-wrap items-center justify-center'>
                            {userlisting
                                .filter(listing => listing.type === 'sale')
                                .map(listing => (
                                <Link
                                to={`/listing/${listing._id}`}
                                key={listing._id}
                                className='flex-shrink-0 font-sub tracking-[0px] w-[160px] h-[300px] md:w-[300px] md:h-[250px] rounded-xl overflow-hidden flex flex-row relative'
                                >
                                <img className='w-full h-full object-cover' src={listing.imageUrls[0]} alt='listing images' />
                                <div className='w-full hover:bg-black font-main transition-all ease bg-gradient-to-t from-black to-transparent bg-opacity-60 text-white font-light absolute h-full flex flex-col justify-end p-5 items-start'>
                                    <p className='text-sm md:text-base font-semibold tracking-tighter'>{listing.name}</p>
                                    <p className='text-xs'>{getDesc(listing.description)}</p>
                                    <p className='text-xs'>{listing.address}</p>
                                </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                {hasHotel && (
                    <div className='w-full flex flex-col font-sub font-bold tracking-[-1.5px]'>
                        <h1 className='w-full text-center p-5 text-xl md:text-3xl'>For Hotel</h1>
                        <div className='w-full flex gap-4 font-main flex-wrap items-center justify-center'>
                            {userlisting
                                .filter(listing => listing.type === 'hotel')
                                .map(listing => (
                                <Link
                                to={`/listing/${listing._id}`}
                                key={listing._id}
                                className='flex-shrink-0 font-main tracking-[0px] w-[160px] h-[300px] md:w-[300px] md:h-[250px] rounded-xl overflow-hidden flex flex-row relative'
                                >
                                <img className='w-full h-full object-cover' src={listing.imageUrls[0]} alt='listing images' />
                                <div className='w-full hover:bg-black transition-all ease bg-gradient-to-t from-black to-transparent bg-opacity-60 text-white font-light absolute h-full flex flex-col justify-end p-5 items-start'>
                                    <p className='text-sm md:text-base font-semibold tracking-tighter'>{listing.name}</p>
                                    <p className='text-xs'>{getDesc(listing.description)}</p>
                                    <p className='text-xs'>{listing.address}</p>
                                </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </>
        )}
        {userlisting && userlisting.length < 1 && (
            <h1 className='font-sub text-xl tracking-[-1px]'>You currently have no listing</h1>
        )}
    </>
  );
};

export default ListingBoxProfile;
