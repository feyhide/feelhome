import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from './ListingItem'
import ListingBox from '../components/ListingBox'
import MapComponent from './MapComponent'

const Search = () => {
    const navigate = useNavigate()
    const [loading,setloading] = useState(false)
    const [listing,setlisting] = useState([])

    const [sidebarData,setsidebarData] = useState({
        searchTerm:'',
        type:'all',
        sort:"created_at",
        order:"desc"
    })

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        const typeFromUrl = urlParams.get("type")
        const sortFromUrl = urlParams.get("sort")
        const orderFromUrl = urlParams.get("order")

        if(
            searchTermFromUrl,
            typeFromUrl,
            sortFromUrl,
            orderFromUrl
        ){
            setsidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
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
        if(e.target.id === 'all' || e.target.id === 'hotel' || e.target.id === 'rent' || e.target.id === 'sale'){
            setsidebarData({...sidebarData,type:e.target.id})
        }
        if(e.target.id === 'searchTerm'){
            setsidebarData({...sidebarData,searchTerm:e.target.value})
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
        urlParams.set("sort",sidebarData.sort)
        urlParams.set("order",sidebarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    
  return (
    <div className='w-screen font-sub font-semibold tracking-[-1px] flex relative'>
        <div className='w-[30%] mt-[80px] h-screen fixed top-0 bg-slate-300 bg-opacity-60'>
            <form className='w-full h-1/2 gap-4 flex flex-col items-center p-20' onSubmit={handlesubmit}>
                <div className='w-full flex flex-col'>
                    <label>Search:</label>
                    <input value={sidebarData.searchTerm} onChange={handleChange} className='w-full p-2 border rounded-lg' type='text' id='searchTerm' placeholder='Search... (Particular or City or Country)' />
                </div>
                <div className='flex flex-wrap gap-3 justify-center w-full'>
                    <label>Type:</label>
                    <div>
                        <input checked={sidebarData.type === 'all'} onChange={handleChange} type='checkbox' id='all'/>
                        <span>All</span>
                    </div>
                    <div>
                        <input checked={sidebarData.type === 'hotel'} onChange={handleChange}  type='checkbox' id='hotel'/>
                        <span>Hotel</span>
                    </div>
                    <div>
                        <input checked={sidebarData.type === 'rent'} onChange={handleChange}  type='checkbox' id='rent'/>
                        <span>Rent</span>
                    </div>
                    <div>
                        <input checked={sidebarData.type === 'sale'} onChange={handleChange}  type='checkbox' id='sale'/>
                        <span>Sale</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label>Sort:</label>
                    <select className='rounded-lg p-1' onChange={handleChange} defaultValue='created_at_desc' id='sort_order'>
                        <option value='regularPrice_desc'>Price High to Low</option>
                        <option value='regularPrice_asc'>Price Low to High</option>
                        <option value='created_at_desc'>Latest</option>
                        <option value='created_at_asc'>Oldest</option>
                    </select>
                </div>
                <button className='w-full bg-white rounded-lg p-3' type='submit'>Search</button>
            </form>
            <div className='w-full h-1/2 absolute bottom-0'>
                <MapComponent listings={listing}/>
            </div>
        </div>
        <div className='w-[70%] absolute flex flex-col gap-4 p-10 top-0 right-0 mt-[80px]'>
            <h1 className='text-4xl tracking-[-2px]'>Results</h1>
            {!loading && listing.length === 0 && (
                <p>No Matches Found</p>
            )}
            {loading && (
                <p>Loading...</p>
            )}
            <div className='flex flex-wrap gap-4'>
                {!loading && listing && (
                    <ListingBox data={listing}/>
                )}
            </div>
        </div>
    </div>
  )
}

export default Search

// <div>
//                 {!loading && listing.length === 0 && (
//                     <p>No Matches Found</p>
//                 )}
//                 {!loading && listing && listing.map((item) => 
//                     <ListingItem key={item._id} item={item}/>
//                 )}
//             </div>