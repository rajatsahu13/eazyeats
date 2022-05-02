import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom"
import { RestaurantContext } from '../RestaurantContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import sleep from '../hooks/sleep'

function Navbar({ setSearchResponse }) {
    const [payload, setPayload] = useContext(RestaurantContext)
    const [options, setOptions] = useState(false)
    const [menu, setMenu] = useState(false)
    const [searchParams, setSearchParams] = useState('')
    let navigate = useNavigate();

    const logout = async () => {
        await axios.get('/api/auth/logout')
        await sleep(2000);
        setPayload({
            ...payload,
            isUpdated: true,
            loginStatus: false,
            user: null
        })
        setOptions(false)
        localStorage.removeItem("token")
    }

    const searchRestaurants = async () => {
        const response = await axios.post('/api/restaurants', {
            searchQuery: searchParams
        })
        setSearchResponse(response.data.searchQuery)
        await sleep(2000)
        setPayload({
            ...payload,
            isUpdated: true,
            restaurants: response.data.restaurants
        })
        setSearchParams('')
        navigate('/');
    }

    const home = () => {
        axios.post('/api/restaurants').then((response) => {
            setPayload({
                ...payload,
                isUpdated: true,
                restaurants: response.data.restaurants
            })
        })
        navigate('/')
    }

    const showMenu = () => {
        setMenu(!menu)
    }

    return (
        <nav className='flex flex-col sm:mx-auto md:flex-row md:justify-between md:items-center py-4 relative'>
            <div onClick={home} className='cursor-pointer'>
                <h1 className='font-heading text-4xl'>
                    <button>eazyeats</button>
                </h1>

            </div>
            <div className={`${menu ? 'flex w-full mt-4' : 'hidden sm:hidden md:flex md:w-10/12 md:justify-center'}`}>
                <input value={searchParams} onChange={(e) => setSearchParams(e.target.value)} className='w-full border-t-2 shadow-md border-b-2 border-l-2 placeholder:text-sm md:placeholder:text-base placeholder-gray-400 focus:outline-none rounded-l-md pl-2 py-2 md:w-2/3' placeholder='Search for a restaurant, cuisine or location' />
                <div onClick={searchRestaurants} className='bg-red-600 h-11 w-11 rounded-r-md flex items-center justify-center shadow-md cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <div className='absolute right-0 top-7 cursor-pointer md:hidden' onClick={showMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </div>
            <ul className={`${menu ? 'flex flex-col text-2xl space-y-4 mt-4' : 'hidden sm:hidden space-x-3 items-center md:flex'}`}>
                {!payload.loginStatus &&
                    <Link to="/login" className={`${menu ? 'flex items-center space-x-2' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${menu ? 'h-6 w-6' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <li className={`${menu ? ' font-light' : 'btn border-primary hover:shadow-inner hover:bg-gray-300'}`}>Login</li>
                    </Link>
                }
                {!payload.loginStatus &&
                    <Link to="/register" className={`${menu ? 'flex items-center space-x-2' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${menu ? 'h-6 w-6' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <li className={`${menu ? ' font-light' : 'btn bg-red-600 text-white  border-red-600 hover:bg-red-700 hover:border-red-700'}`}>Register</li>
                    </Link>}
                {
                    payload.loginStatus && <div className='relative sm:mb-5 md:mb-0'>
                        <div className='flex cursor-pointer space-x-2 items-center' onClick={() => setOptions(!options)}>
                            <span className='font-bold text-lg block w-auto truncate'>Welcome, {payload.user.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${options ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${options ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </div>
                        <div className={`absolute bg-white flex flex-col z-50 space-y-2 mt-2 top-6 border-2 w-40 shadow-lg rounded-lg ${options ? '' : 'hidden'}`}>
                            <Link to={`/users/${payload.user._id}/reviews`}>
                                <div className='cursor-pointer text-base pl-4 py-1 font-light hover:bg-gray-300'>Reviews</div>
                            </Link>
                            <Link to={`/users/${payload.user._id}/bookings`}>
                                <div className='cursor-pointer text-base pl-4 py-1 font-light hover:bg-gray-300'>Bookings</div>
                            </Link>
                            <div className='cursor-pointer text-base pl-4 py-1 font-light hover:bg-gray-300' onClick={logout}>Logout</div>
                        </div>
                    </div>
                }
            </ul>
        </nav >
    )
}

export default Navbar
