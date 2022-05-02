import React, { useContext } from 'react'
import Card from './Card'
import { RestaurantContext } from '../RestaurantContext'

function Dashboard({ searchResponse }) {
    const [payload] = useContext(RestaurantContext)
    return (
        <div className='container mx-auto mt-5 mb-10'>
            <h1 className='text-3xl font-bold text-left'>{searchResponse === '' ? 'All Restaurants' : `Best ${searchResponse} Restaurants`}</h1>
            <div className='mt-8 grid lg:grid-cols-3 gap-10'>
                {payload.restaurants.map(restaurant => (
                    <Card key={restaurant._id} restaurant={restaurant} />
                ))}
            </div>
        </div>
    )
}

export default Dashboard
