import React, { useState, useMemo } from 'react'
import BookingForm from './BookingForm'
import Map from './Map'

function About({ restaurant }) {
    const [timings, setTimings] = useState([])

    const handleTimings = (timings) => {
        const data = Object.entries(timings)
        setTimings(data)
    }

    const splitTimings = (string) => {
        const checkString = string.match(',')
        if (checkString) {
            const newString1 = string.slice(0, checkString.index)
            const newString2 = string.slice(checkString.index + 1, string.length)
            return (
                <div>
                    <div>{newString1}</div>
                    <div>{newString2}</div>
                </div>
            )
        } else {
            return <div>{string}</div>
        }
    }

    useMemo(() => {
        handleTimings(restaurant.timings)
    }, [restaurant.timings])

    return (
        <div>
            <div className='md:grid grid-cols-3 sm:space-y-10 md:space-y-0 col-span-2'>
                <div className='flex flex-col col-span-2 items-start space-y-4'>
                    <div className='container'>
                        <h4 className='text-base md:text-xl text-left font-bold'>Timings</h4>
                        <div className='container w-full pt-2'>
                            {
                                timings.map((data, i) => (
                                    <div className='container w-full flex ' key={i}>
                                        <div className='w-1/2 md:w-1/3'>
                                            <div>{data[0]}</div>
                                        </div>
                                        <div className='w-1/2 md:-w-2/3 text-right md:text-left'>
                                            {splitTimings(data[1])}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <Map
                        lat={restaurant.geometry.coordinates[1]}
                        lng={restaurant.geometry.coordinates[0]}
                        address={restaurant.location}
                    />
                    <div className='container w-full pt-4'>
                        <h4 className='text-xl text-left font-bold'>Cost</h4>
                        <p className='text-lg pt-2'>${restaurant.price} for two people (approx.)</p>
                    </div>
                </div>
                <div className='md:col-span-1'>
                    <BookingForm />
                </div>
            </div >
        </div>

    )
}

export default About
