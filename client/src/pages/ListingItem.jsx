import React from 'react'
import { Link } from 'react-router-dom'

const ListingItem = ({item}) => {
  return (
    <Link to={`/listing/${item._id}`}>{item.name}</Link>
  )
}

export default ListingItem