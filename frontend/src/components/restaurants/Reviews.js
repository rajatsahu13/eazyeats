import React, { useState, useEffect, useContext } from 'react'
import StarRatings from 'react-star-ratings';
import ReviewForm from './ReviewForm';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { RestaurantContext } from '../../RestaurantContext'
import sleep from '../../hooks/sleep'

function Reviews() {
    const [payload] = useContext(RestaurantContext)
    const [message, setMessage] = useState('')
    const [index, setIndex] = useState('')
    let { pathname } = useLocation()
    let navigate = useNavigate()
    const [reviews, setReviews] = useState({
        isUpdated: false,
        data: []
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api' + pathname + '/reviews')
            setReviews(reviews => ({
                ...reviews,
                isUpdated: true,
                data: response.data.reviews
            }))
        }
        fetchData()
    }, [pathname, reviews.isUpdated])

    const deleteReview = async (e) => {
        let i = e.target.parentElement.id
        setIndex(i)
        const reviewId = e.target.parentElement.parentElement.parentElement.id
        const restaurantId = pathname.slice(13)
        axios.delete('/api/reviews', {
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
                    await sleep(2000)
                    setMessage('')
                    setIndex('')
                    setReviews({
                        ...reviews,
                        isUpdated: true,
                        data: response.data.reviews
                    })
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
    return (
        <div className='mt-6 md:w-2/3'>
            <h4 className='text-xl text-left font-bold'>Reviews</h4>
            <ReviewForm setReviews={setReviews} />
            {
                reviews.data && reviews.data.map((review, i) => (
                    <div className='py-4 md:pr-20' key={review._id} id={review._id}>
                        <div className='flex items-center justify-between space-x-2 pb-2'>
                            <h5 className='text-xl font-bold pb-1'>{review.author.name}</h5>
                            {
                                payload.user && payload.user._id === review.author._id &&
                                <div id={i} onClick={deleteReview} className='cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                            }
                        </div>
                        <div>
                            <div className='flex items-center space-x-2'>
                                <StarRatings
                                    rating={review.rating}
                                    starRatedColor="red"
                                    numberOfStars={5}
                                    starDimension='25'
                                    starSpacing='0'
                                />
                                <p>{moment(review.date).format('MMMM DD, YYYY')}</p>
                            </div>
                            <p className='tracking-wide py-2'>{review.body}</p>
                        </div>
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
    )
}

export default Reviews
