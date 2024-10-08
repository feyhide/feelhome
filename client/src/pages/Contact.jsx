import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MapComponent from './MapComponent';
import Calendar from './Calender';

const Contact = ({Landlord, listing }) => {
    const [posttime, setPostTime] = useState('');
    const [fulldesc, setFulldesc] = useState([]);
    const [shortdesc, setShortdesc] = useState('');
    const [descActive, setDescActive] = useState(false);
    const [viewBooking, setviewBooking] = useState(false);

    useEffect(() => {
        if (listing.createdAt) {
            const time = listing.createdAt;
            let date = time.split('T')[0].split('-').join('/');
            setPostTime(date);
        }
    }, [listing.createdAt]);

    useEffect(() => {
        // if (listing.description) {
        //     let temp = listing.description;
        //     let desc = temp.split('(_)');
        //     setFulldesc(desc.join('<br/>')); // Join parts with <br/> for line breaks

        //     let temp2 = '';
        //     if (desc.length > 0) {
        //         temp2 = desc[0].substring(0, 200) + '....'; // Adjust short description logic as needed
        //     }
        //     setShortdesc(temp2);
        // }
        if(listing.description){
            let temp = listing.description
            temp = temp.split("\n")
            setFulldesc(temp)
            let temp2 = listing.description
            if(temp2.length > 200){
                temp2 = temp2.substring(0,200) + "...."
            }
            temp2 = temp2.split("\n")
            setShortdesc(temp2)
        }
        //console.log(listing.description)
    }, [listing.description]);


    return (
        <>
            {Landlord && (
                <div className='w-full relative h-full flex flex-col rounded-xl overflow-hidden'>
                    {descActive && (
                        <div className='w-full h-full font-sub tracking-[-1px] absolute p-5 top-0 bg-white z-20 overflow-hidden'>
                            <div className='flex flex-col h-full'>
                                <div className='relative flex items-center justify-center w-full'>
                                    <div onClick={() => setDescActive(false)} className='w-6 h-6 absolute left-0'>
                                        <img className='w-full h-full object-contain' src='/arrowback.png' alt='Arrow Back' />
                                    </div>
                                    <p className='font-semibold text-sm md:text-2xl'>Description:</p>
                                </div>
                                <div className='flex-1 text-sm md:text-xl flex flex-col overflow-y-auto p-4'>
                                    {/* <div dangerouslySetInnerHTML={{ __html: fulldesc }} /> */}
                                    <div onClick={() => setDescActive(true)} className='flex flex-col gap-2 transition-all ease w-full'>
                                    {fulldesc.map((text,index)=>(
                                        <p key={index}>{text}</p>
                                    ))}
                                </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='font-sub gap-2 tracking-[-1px] p-4 w-full h-[60%] flex flex-col'>
                        <div>
                            <p className='w-full text-center pt-3 text-lg md:text-3xl'>Listed By <span className='font-bold'>{Landlord.username}</span></p>
                            <p className='w-full text-center text-sm md:text-2xl'>For <span className='uppercase font-bold'>{listing.type}</span></p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className=''>
                            <p className='font-semibold text-sm md:text-2xl w-full'>Description:</p>
                                <div onClick={() => setDescActive(true)} className='hover:text-slate-500 text-sm md:text-base flex flex-col transition-all ease w-full'>
                                    {shortdesc.slice(0, 3).map((text, index) => (
                                        <p className='line-clamp-1' key={index}>{text}</p>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className='font-semibold text-sm md:text-2xl w-full'>Address: </p>
                                <p className='w-full text-sm md:text-base'>{listing.address}</p>
                            </div>
                        </div>
                        <div className='w-full gap-4 flex flex-wrap'>
                            {listing.parking && (
                                <div className='flex gap-1 items-center'>
                                    <div className='w-5 h-full flex items-center relative'>
                                        <img className='w-full h-full object-contain' src='/parkingicon.png' alt='Parking Icon' />
                                    </div>
                                    <p className='text-sm md:text-base'>Parking</p>
                                </div>
                            )}
                            {listing.furnished && (
                                <div className='flex gap-1 items-center'>
                                    <div className='w-5 h-full flex items-center relative'>
                                        <img className='w-full h-full object-contain' src='/furnishedicon.png' alt='Furnished Icon' />
                                    </div>
                                    <p className='text-sm md:text-base'>Furnished</p>
                                </div>
                            )}
                            <div className='flex gap-1 items-center'>
                                <div className='w-5 h-full flex items-center relative'>
                                    <img className='w-full h-full object-contain' src='/bedroomicon.png' alt='Bedroom Icon' />
                                </div>
                                <p className='text-sm md:text-base'>{listing.bedrooms} beds</p>
                            </div>
                            <div className='flex gap-1 items-center'>
                                <div className='w-5 h-full flex items-center relative'>
                                    <img className='w-full h-full object-contain' src='/bathroomicon.png' alt='Bathroom Icon' />
                                </div>
                                <p className='text-sm md:text-base'>{listing.bathrooms} bathrooms</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 flex-col'>
                            <div className='flex text-sm md:text-base gap-1'>
                                <p>Posted on</p>
                                <p>{posttime}</p>
                            </div>
                        </div>
                        {listing.type === 'hotel' && (
                            <div className='relative w-full'>
                                <h1 className='h-[20px] text-sm md:text-base' onClick={()=>setviewBooking(!viewBooking)}>{viewBooking ? "Close Bookings" : 'View Bookings'}</h1>
                                {viewBooking && (
                                    <div className='mt-[20px] absolute z-10 w-full top-0'>
                                        <Calendar bookingDates={listing.bookingDates}/>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='w-full bg-green-200 relative h-[40%] z-0'>
                        <MapComponent location={listing.address} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Contact;
