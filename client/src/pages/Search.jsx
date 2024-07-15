import React from 'react'

const Search = () => {
  return (
    <div className='flex'>
        <div>
            <form>
                <div>
                    <label>search term</label>
                    <input className='w-full border rounded-lg' type='text' id='searchTerm' placeholder='Search....' />
                </div>
                <div className='flex flex-wrap gap-3'>
                    <label>type:</label>
                    <div>
                        <input type='checkbox' id='all'/>
                        <span>Rent & Sale</span>
                    </div>
                    <div>
                        <input type='checkbox' id='rent'/>
                        <span>Rent</span>
                    </div>
                    <div>
                        <input type='checkbox' id='sale'/>
                        <span>Sale</span>
                    </div>
                    <div>
                        <input type='checkbox' id='offer'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <label>Amenities:</label>
                    <div>
                        <input type='checkbox' id='parking'/>
                        <span>Parking</span>
                    </div>
                    <div>
                        <input type='checkbox' id='furnished'/>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label>sort:</label>
                    <select id='sort_label'>
                        <option>Price High to Low</option>
                        <option>Price Low to High</option>
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
                <button type='submit'>Search</button>
            </form>
        </div>
        <div>
            <h1>Search Result</h1>
        </div>
    </div>
  )
}

export default Search