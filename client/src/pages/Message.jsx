import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Message = ({ listing }) => {
    const [Landlord, setLandLord] = useState(null);
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


    return (
        Landlord && (
            <>
                <div className='w-full h-full flex gap-2 tracking-[-1px] flex-col items-center bg-white bg-opacity-30 backdrop-blur-sm justify-center font-main'>
                    <h1 className='text-3xl'>Contact <span className='font-bold'>{Landlord.username}</span></h1>
                    <textarea className='bg-opacity-70 w-1/2 p-2 rounded-xl bg-white text-black' name='message' placeholder='Message....' value={message} onChange={handlemessage} id='message' rows='2'></textarea>
                    <Link className='w-1/3 p-2 font-bold text-center uppercase rounded-xl bg-white' to={`mailto:${Landlord.email}?subject=Regrading ${listing.name}&body=${message}`}>
                    Send Message
                    </Link>
                </div>
            </>
        )
    );
};

export default Message;
