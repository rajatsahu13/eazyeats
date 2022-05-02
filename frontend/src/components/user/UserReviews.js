import React, { useState, useEffect } from 'react'
import axios from 'axios'
import sleep from '../../hooks/sleep'
import { useLocation, useNavigate } from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import moment from 'moment'

function UserReviews() {
    let { pathname } = useLocation()
    let navigate = useNavigate()
    const [reviews, setReviews] = useState([])
    const [restaurants, setRestaurants] = useState([{ title: '' }])
    const [message, setMessage] = useState('')
    const [index, setIndex] = useState('')

    const deleteReview = async (e) => {
        let i = e.target.parentElement.id || e.target.id
        setIndex(i)
        const reviewId = reviews[i]._id
        const restaurantId = restaurants[i]._id
        axios.delete('/api/users/' + pathname.slice(7, 31) + '/reviews', {
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            data: {
                reviewId: reviewId,
                restaurantId: restaurantId
            }
        }).then(async response => {
            if (!response.data.auth) {
                navigate('/login')
            } else {
                setMessage('Deleting review')
                if (response.data.success) {
                    await sleep(2000)
                    setMessage('Successfully deleted review!')
                    let temp = []
                    response.data.allRestaurants.map(restaurant => {
                        return temp.push(restaurant[0])
                    })
                    await sleep(2000)
                    setMessage('')
                    setIndex('')
                    setReviews(response.data.reviews)
                    setRestaurants(temp)
                } else {
                    await sleep(2000)
                    setMessage('Cannot delete review!')
                    await sleep(2000)
                    setMessage('')
                    setIndex('')
                }
            }
        }).catch(async error => {
            console.log(error)
            await sleep(2000)
            setMessage('Cannot delete review!')
            await sleep(2000)
            setMessage('')
            setIndex('')
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            let temp = []
            axios.get('/api/users/' + pathname.slice(7, 31) + '/reviews', {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then((response) => {
                if (!response.data.auth) {
                    navigate('/login')
                } else {
                    setReviews(response.data.reviews)
                    response.data.allRestaurants.map(restaurant => {
                        return temp.push(restaurant[0])
                    })
                    setRestaurants(temp)
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
            <h1 className='text-2xl font-semibold'>Reviews</h1>
            <div className='grid sm:grid-cols-1 xl:grid-cols-3 gap-10 mt-4'>
                {
                    reviews.map((review, i) => (
                        <div className='col-span-1 shadow p-4 relative rounded-md' key={review._id} id={review._id}>
                            {
                                restaurants[i] && <h4 className='text-xl'>{restaurants[i].title}</h4>
                            }
                            {
                                restaurants[i] && <h4 className='text-md'>{restaurants[i].location}</h4>
                            }
                            <div className='flex items-center space-x-2 pt-2'>
                                <StarRatings
                                    rating={review.rating}
                                    starRatedColor="red"
                                    numberOfStars={5}
                                    starDimension='20'
                                    starSpacing='0'
                                />
                                <p className='font-light text-sm'>{moment(review.date).format('MMMM DD, YYYY')}</p>
                            </div>
                            <p className='pt-2 break-all font-light text-base'>{review.body}</p>
                            <button id={i} onClick={deleteReview} className='cursor-pointer absolute flex items-center justify-center top-4 right-4' >
                                <svg id={i} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <div className={`${index === `${i}` ? 'block' : 'hidden'}`}>
                                <div className={`${message !== 'Deleting review' && index !== i ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    <span className='font-bold text-gray-600'>{message}</span>
                                </div>
                                <div className={`${message !== 'Successfully deleted review!' && index !== i ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className='font-bold text-green-600'>{message}</span>
                                </div>
                                <div className={`${message !== 'Cannot delete review!' && index !== i ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className='font-bold text-red-600'>{message}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default UserReviews
