import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from './ListingItem'

const Search = () => {
    const navigate = useNavigate()
    const [loading,setloading] = useState(false)
    const [listing,setlisting] = useState([])

    const [sidebarData,setsidebarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:"created_at",
        order:"desc"
    })

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        const typeFromUrl = urlParams.get("type")
        const parkingFromUrl = urlParams.get("parking")
        const furnishedFromUrl = urlParams.get("furnished")
        const offerFromUrl = urlParams.get("offer")
        const sortFromUrl = urlParams.get("sort")
        const orderFromUrl = urlParams.get("order")

        if(
            searchTermFromUrl,
            typeFromUrl,
            parkingFromUrl,
            furnishedFromUrl,
            offerFromUrl,
            sortFromUrl,
            orderFromUrl
        ){
            setsidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                parking: parkingFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            })
        }

        const fetchListings = async () => {
            setloading(true)
            const searchQuery = urlParams.toString()
            console.log(`/api/v1/listing/get?${searchQuery}`)
            const res = await fetch(`/api/v1/listing/get?${searchQuery}`)
            const data = await res.json()
            setlisting(data)
            setloading(false)
        }
        fetchListings()
    },[location.search])
    
    console.log(listing)
    console.log(sidebarData)
    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setsidebarData({...sidebarData,type:e.target.id})
        }
        if(e.target.id === 'searchTerm'){
            setsidebarData({...sidebarData,searchTerm:e.target.value})
        }
        if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished'){
            setsidebarData({...sidebarData,[e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
        }
        if(e.target.id === 'sort_order'){
            console.log("hee")
            const sort = e.target.value.split('_')[0] || 'created_at'
            
            const order = e.target.value.split('_')[1] || 'desc'

            setsidebarData({...sidebarData,sort,order})
        }
    }

    const handlesubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set("searchTerm",sidebarData.searchTerm)
        urlParams.set("type",sidebarData.type)
        urlParams.set("parking",sidebarData.parking)
        urlParams.set("furnished",sidebarData.furnished)
        urlParams.set("offer",sidebarData.offer)
        urlParams.set("sort",sidebarData.sort)
        urlParams.set("order",sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    
  return (
    <div className='flex'>
        <div>
            <form onSubmit={handlesubmit}>
                <div>
                    <label>search term</label>
                    <input value={sidebarData.searchTerm} onChange={handleChange} className='w-full border rounded-lg' type='text' id='searchTerm' placeholder='Search....' />
                </div>
                <div className='flex flex-wrap gap-3'>
                    <label>type:</label>
                    <div>
                        <input checked={sidebarData.type === 'all'} onChange={handleChange} type='checkbox' id='all'/>
                        <span>Rent & Sale</span>
                    </div>
                    <div>
                        <input checked={sidebarData.type === 'rent'} onChange={handleChange}  type='checkbox' id='rent'/>
                        <span>Rent</span>
                    </div>
                    <div>
                        <input checked={sidebarData.type === 'sale'} onChange={handleChange}  type='checkbox' id='sale'/>
                        <span>Sale</span>
                    </div>
                    <div>
                        <input checked={sidebarData.offer} onChange={handleChange}  type='checkbox' id='offer'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <label>Amenities:</label>
                    <div>
                        <input checked={sidebarData.parking} onChange={handleChange}  type='checkbox' id='parking'/>
                        <span>Parking</span>
                    </div>
                    <div>
                        <input checked={sidebarData.furnished} onChange={handleChange}  type='checkbox' id='furnished'/>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label>sort:</label>
                    <select onChange={handleChange} defaultValue='created_at_desc' id='sort_order'>
                        <option value='regularPrice_desc'>Price High to Low</option>
                        <option value='regularPrice_asc'>Price Low to High</option>
                        <option value='created_at_desc'>Latest</option>
                        <option value='created_at_asc'>Oldest</option>
                    </select>
                </div>
                <button type='submit'>Search</button>
            </form>
        </div>
        <div>
            <h1>Search Result</h1>
            <div>
                {!loading && listing.length === 0 && (
                    <p>No Matches Found</p>
                )}
                {!loading && listing && listing.map((item) => 
                    <ListingItem key={item._id} item={item}/>
                )}
            </div>
        </div>
    </div>
  )
}

export default Search