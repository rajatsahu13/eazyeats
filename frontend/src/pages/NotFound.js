import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className='flex flex-col items-center my-20 space-y-4'>
            <h1 className='font-bold text-9xl text-red-600 '>404</h1>
            <h4 className='font-bold text-4xl'>Page Not Found</h4>
            <p className='font-bold text-xl'>The page you are looking for doesn't exist.</p>
            <Link to='/'>
                <button className='btn mt-2 bg-red-600 text-white hover:bg-red-700 hover:border-red-700  border-2 border-red-600'>Return Home</button>
            </Link>
        </div>
    )
}

export default NotFound
