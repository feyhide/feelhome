import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({listing}) => {
    const [Landlord,setLandLord] = useState(null)
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
    <>
    {Landlord && (
        <div>
            <p>Contact <span>{Landlord.username}</span> for {listing.name}</p>
            <textarea name='message' placeholder='Message....' value={message} onChange={handlemessage} id='message' rows='2'></textarea>
            <Link to={`mailto:${Landlord.email}?subject=Regrading ${listing.name}&body=${message}`}>
            Send Message
            </Link>
        </div>
    )}
    </>
  )
}

export default Contact