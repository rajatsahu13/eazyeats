import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'

function UserBookings() {
    let { pathname } = useLocation()
    let navigate = useNavigate()
    const [bookings, setBookings] = useState([])

    const getThumbnail = (url => {
        return `${url.slice(0, 42)}/upload/w_400/${url.slice(50, url.length)} `
    })

    useEffect(() => {
        const fetchData = () => {
            axios.get('/api/users/' + pathname.slice(7, 31) + '/bookings', {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then(response => {
                if (!response.data.auth) {
                    navigate('/login')
                } else {
                    setBookings(response.data.bookings)
                }
            }).catch(error => {
                console.log(error)
                navigate('/404')
            })
        }
        fetchData()
    }, [pathname, navigate])

    return (
        <div className='my-4'>
            <h1 className='text-2xl font-semibold'>Bookings</h1>
            <div className='grid sm:grid-cols-1 xl:grid-cols-3 gap-10 mt-4'>
                {
                    bookings.map(booking => (
                        <div className='pb-2 col-span-1 shadow rounded-md overflow-hidden' key={booking._id}>
                            <img className='h-40 w-full object-fill' src={getThumbnail(booking.restaurant.images[0].url)} alt='' />
                            <div className='pl-4 py-2'>
                                <h4 className='text-xl font-semibold'>{booking.restaurant.title}</h4>
                                <h4 className='text-md'>{booking.restaurant.location}</h4>
                                <p className='pt-2 tracking-wide'>BOOKING FOR</p>
                                <h4 className='text-md font-semibold'>{moment(booking.date).format('MMMM DD, YYYY')}, {booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}</h4>
                            </div>
                            <div className='px-4'>
                                <Link to={`/restaurants/${booking.restaurant._id}`}>
                                    <button className='btn w-full my-2 text-white bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700'>Book Again</button>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default UserBookings
