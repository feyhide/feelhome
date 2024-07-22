import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ListingItem from './ListingItem'
import ListingBox from '../components/ListingBox'
import MapComponent from './MapComponent'

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation() // To get location.search
    const [loading, setloading] = useState(false)
    const [listing, setlisting] = useState([])
    const [total,settotal] = useState(null)
    const [searcherror, setsearcherror] = useState(null)
    const [particularlocation, setparticularlocation] = useState(null)
    const [currentPage, setCurrentPage] = useState(0) // State to manage current page

    const [sidebarData, setsidebarData] = useState({
        searchTerm: '',
        type: 'all',
        sort: "created_at",
        order: "desc"
    })

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        const typeFromUrl = urlParams.get("type")
        const sortFromUrl = urlParams.get("sort")
        const orderFromUrl = urlParams.get("order")
        const pageFromUrl = parseInt(urlParams.get("page")) || 0 // Get page from URL or default to 0

        setCurrentPage(pageFromUrl)

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setsidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            })
        }

        const fetchListings = async () => {
            setloading(true)
            try {
                const searchQuery = urlParams.toString()
                console.log(`/api/v1/listing/get?${searchQuery}&page=${pageFromUrl}`)
                const res = await fetch(`/api/v1/listing/get?${searchQuery}&page=${pageFromUrl}`)
                const data = await res.json()
                if (data.success === false) {
                    setsearcherror(data.error)
                    return
                }
                if (data.listings.length > 0) {
                    const firstAddressParts = data.listings[0].address.toLowerCase().split(/[\/,]/).map(addr => addr.trim())
                    console.log("First Address Parts:", firstAddressParts)
                    let check = true

                    data.listings.forEach(listing => {
                        const listingAddressParts = listing.address.toLowerCase().split(/[\/,]/).map(addr => addr.trim())
                        for (let i = 0; i < firstAddressParts.length; i++) {
                            if (listingAddressParts[i] !== firstAddressParts[i]) {
                                check = false
                                break
                            }
                        }
                    })

                    if (check) {
                        setparticularlocation(firstAddressParts.join(','))
                    } else {
                        setparticularlocation(null)
                    }
                }
                settotal(data.totalListingsCount)
                setlisting(data.listings)
                setloading(false)
            } catch (error) {
                setsearcherror(error)
                setloading(false)
            }
        }
        fetchListings()
        window.scrollTo(0, 0);
    }, [location.search, currentPage])

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'hotel' || e.target.id === 'rent' || e.target.id === 'sale') {
            setsidebarData({ ...sidebarData, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setsidebarData({ ...sidebarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'

            setsidebarData({ ...sidebarData, sort, order })
        }
    }

    const handlesubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set("searchTerm", sidebarData.searchTerm)
        urlParams.set("type", sidebarData.type)
        urlParams.set("sort", sidebarData.sort)
        urlParams.set("order", sidebarData.order)
        urlParams.set("page", currentPage) // Include currentPage in URL params
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const handlePageChange = (direction) => {
        const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1
        if (newPage >= 0) { // Ensure page number is non-negative
            setCurrentPage(newPage)
            const urlParams = new URLSearchParams(location.search)
            urlParams.set("page", newPage)
            const searchQuery = urlParams.toString()
            navigate(`/search?${searchQuery}`)
        }
    }
                
    return (
        <div className='w-screen h-screen font-sub font-semibold tracking-[-1px] flex-col md:flex-row flex relative'>
            <div className='w-full md:w-[30%] mt-[80px] md:h-screen h-[40vh] md:fixed md:top-0 bg-white bg-opacity-60'>
                <form className='w-full h-1/2 gap-4 flex flex-col items-center p-10 md:p-20' onSubmit={handlesubmit}>
                    <div className='w-full flex flex-col'>
                        <label className='text-lg md:text-2xl font-bold'>Search:</label>
                        <input value={sidebarData.searchTerm} onChange={handleChange} className='w-full p-2 border rounded-lg' type='text' id='searchTerm' placeholder='Search... (Particular or City or Country)' />
                    </div>
                    <div className='flex flex-wrap items-center gap-3 justify-center w-full'>
                        <label className='text-lg md:text-2xl font-bold'>Type:</label>
                        <div className=''>
                            <input checked={sidebarData.type === 'all'} onChange={handleChange} type='checkbox' id='all' />
                            <span>All</span>
                        </div>
                        <div>
                            <input checked={sidebarData.type === 'hotel'} onChange={handleChange} type='checkbox' id='hotel' />
                            <span>Hotel</span>
                        </div>
                        <div>
                            <input checked={sidebarData.type === 'rent'} onChange={handleChange} type='checkbox' id='rent' />
                            <span>Rent</span>
                        </div>
                        <div>
                            <input checked={sidebarData.type === 'sale'} onChange={handleChange} type='checkbox' id='sale' />
                            <span>Sale</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='text-lg md:text-2xl font-bold'>Sort:</label>
                        <select className='rounded-lg p-1' onChange={handleChange} defaultValue='created_at_desc' id='sort_order'>
                            <option value='regularPrice_desc'>Price High to Low</option>
                            <option value='regularPrice_asc'>Price Low to High</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='w-full bg-black text-white text-lg md:text-2xl font-bold hover:text-black hover:bg-white hover:border-black border transition-all ease rounded-lg p-3' type='submit'>Search</button>
                </form>
                <div className='w-full md:block hidden h-1/2 absolute bottom-0'>
                    {particularlocation ? (<MapComponent location={particularlocation} />) : (<MapComponent listings={listing} />)}
                </div>
            </div>
            <div className='w-full h-[50vh] md:w-[70%] md:absolute flex flex-col gap-4 mt-[20px] md:top-0 md:right-0 md:mt-[80px]'>
                <h1 className='text-4xl w-full text-center tracking-[-2px]'>Results</h1>
                {!loading && !searcherror && listing.length === 0 && (
                    <div className='w-full text-center'>
                        <p>No Matches Found</p>
                        <p>Try searching for another place or change the type</p>
                    </div>
                )}
                {!loading && searcherror && (
                    <div className='w-full text-center'>
                        <p>Error while loading data</p>
                        <p>Might be a server issue, try again later</p>
                    </div>
                )}
                {loading && (
                    <p className='w-full text-center'>Loading...</p>
                )}
                <div className='flex flex-col w-full'>
                    <div className='flex items-center justify-center w-full flex-wrap gap-2'>
                        {!loading && listing && (
                            <ListingBox data={listing} />
                        )}
                    </div>
                    <div className='w-full h-[10vh] justify-evenly flex items-center p-20'>
                        <img 
                            src='/arrowback.png' 
                            onClick={() => handlePageChange('previous')} 
                            alt='Previous' 
                            className={`cursor-pointer ${currentPage === 0 ? 'opacity-50 pointer-events-none' : ''}`} 
                        />
                        <img 
                            src='/arrowback.png' 
                            onClick={() => handlePageChange('next')} 
                            alt='Next' 
                            className={`rotate-180 cursor-pointer ${ (currentPage+1)*9 >= total ? 'opacity-50 pointer-events-none' : ''}`} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search
