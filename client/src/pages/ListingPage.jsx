import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Contact from './Contact'

const ListingPage = () => {
    const {currentUser} = useSelector(state=>state.user)
    const [listing, setListing] = useState({})
    const [contact,setContact] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
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
    }, [params.listingID])
    console.log(listing)
    return (
        <div className='listing-details'>
            <h2>{listing.name}</h2>
            <p><strong>Description:</strong> {listing.description}</p>
            <p><strong>Address:</strong> {listing.address}</p>
            <p><strong>Regular Price:</strong> ${listing.regularPrice}</p>

            <div className='image-gallery'>
                {listing.imageUrls && listing.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Image ${index + 1}`} />
                ))}
            </div>
            {currentUser && !contact && currentUser._id !== listing.userRef && (
                <button onClick={()=>setContact(true)}>Contact Landlord</button>
            )}
            {contact ? (<Contact listing={listing}/>) : ''}
        </div>
    )
}

export default ListingPage