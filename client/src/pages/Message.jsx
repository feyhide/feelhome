import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Message = ({ Landlord,listing }) => {
    const [message,setmessage] = useState(null)
    const handlemessage = (e) => {
        setmessage(e.target.value)
    }
    return (
        Landlord && (
            <>
                <div className='w-full h-full flex gap-2 tracking-[-2px] flex-col items-center bg-white bg-opacity-30 backdrop-blur-sm justify-center font-sub'>
                    <h1 className='w-full text-center text-3xl'>Contact <span className='font-bold'>{Landlord.username}</span></h1>
                    <textarea className='bg-opacity-70 w-[80%] md:w-1/2 p-2 rounded-xl bg-white text-black' name='message' placeholder='Message....' value={message} onChange={handlemessage} id='message' rows='2'></textarea>
                    <Link className='w-1/2 md:w-1/3 text-base tracking-[-1px] hover:bg-black hover:border-black border hover:text-white transition-all ease p-2 font-bold text-center uppercase rounded-xl bg-white' to={`mailto:${Landlord.email}?subject=Regrading ${listing.name}&body=${message}`}>
                    Send Message
                    </Link>
                </div>
            </>
        )
    );
};

export default Message;
