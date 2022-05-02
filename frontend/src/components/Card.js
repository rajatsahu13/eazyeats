import React from 'react'
import { Link } from "react-router-dom"

function Card({ restaurant }) {
    const url = restaurant.images[0].url
    const thumbnail = `${url.slice(0, 42)}/upload/w_400/${url.slice(50, url.length)}`
    return (
        <Link to={`/restaurants/${restaurant._id}`}>
            <div className="card hover:shadow-lg">
                <img
                    src={thumbnail}
                    alt="stew"
                    className="h-32 sm:h-48 w-full object-cover"
                />
                <div className="m-4">
                    <span className="font-bold truncate block text-left"
                    >{restaurant.title}</span>
                    <span className="block text-gray-500 text-sm text-left">{restaurant.cuisines}</span>
                    <span className="block text-gray-500 text-sm text-left">{restaurant.location}</span>
                </div>
            </div>
        </Link>
    )
}

export default Card
