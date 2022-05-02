import React, { useState, useEffect } from 'react'
import Flickity from 'react-flickity-component'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import About from './About';
import Reviews from './Reviews';

function Restaurant() {
    let { pathname } = useLocation();
    let navigate = useNavigate()
    const [restaurant, setRestaurant] = useState({
        cuisines: '',
        geometry: {
            coordinates: []
        },
        images: [],
        location: "",
        timings: {},
        price: null,
    })

    const flickityOptions = {
        wrapAround: true,
        autoPlay: true,
        pageDots: false,
    }

    useEffect(() => {
        const fetchData = () => {
            axios.get(`/api${pathname}`).then(response => {
                if (response.data.error) {
                    navigate('/404')
                } else {
                    setRestaurant(response.data)
                }
            }).catch(error => {
                console.log(error)
                navigate('/404')
            })
        }
        fetchData()
    }, [pathname, navigate])

    return (
        <div className='container my-6'>
            <div>
                <Flickity options={flickityOptions} disableImagesLoaded={true}>
                    {
                        restaurant.images && restaurant.images.map((img, i) => (
                            <div key={i} className='w-4/6 h-36 md:h-96'>
                                <img className='object-scale-down' src={img.url} alt='' />
                            </div>
                        ))
                    }
                </Flickity>
                <div className='flex flex-col items-start mt-5'>
                    <h2 className='text-2xl md:text-4xl font-bold'>{restaurant.title}</h2>
                    <h4 className='text-base md:text-xl pt-2 font-semibold'>{restaurant.cuisines}</h4>
                    <p className='text-base md:text-xl font-semibold'>{restaurant.location}</p>
                </div>
            </div>
            <div className='flex flex-col mt-5'>
                <About restaurant={restaurant} />
                <Reviews restaurant={restaurant} />
            </div>
        </div>
    )
}

export default Restaurant
