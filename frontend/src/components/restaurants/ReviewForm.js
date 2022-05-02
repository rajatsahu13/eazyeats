import React, { useState, useContext } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../form-components/FormikControl'
import axios from 'axios'
import TextError from '../form-components/TextError'
import { RestaurantContext } from '../../RestaurantContext'
import { useNavigate, useLocation } from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import sleep from '../../hooks/sleep'

const Rating = ({ field, form, ...props }) => {
    const { setFieldValue } = form
    const { value } = field
    const ratingOptions = [
        { key: 'Select your rating', value: 0 },
        { key: 'Not good', value: 1 },
        { key: 'Could’ve been better', value: 2 },
        { key: 'OK', value: 3 },
        { key: 'Good', value: 4 },
        { key: 'Great', value: 5 },
    ]
    return (
        <div className='flex items-center space-x-4'>
            <StarRatings
                rating={value}
                starRatedColor='red'
                changeRating={val => setFieldValue('rating', val)}
                numberOfStars={5}
                starDimension='30'
                starSpacing='0'
                {...field}
            />
            <span className='font-light'>
                {
                    (ratingOptions.filter(selectedRating => selectedRating.value === value))[0].key
                }
            </span>
        </div>
    )
}
function ReviewForm({ setReviews }) {
    const [payload] = useContext(RestaurantContext)
    const [message, setMessage] = useState('')
    let navigate = useNavigate()
    let { pathname } = useLocation();
    const initialValues = {
        rating: 0,
        body: ''
    }

    const validationSchema = Yup.object({
        rating: Yup.number().min(1, 'Please leave a rating!').max(5, 'Max 5').required('Required'),
        body: Yup.string().required('Required')
    })

    const onSubmit = async (values, submitProps) => {
        if (!payload.loginStatus) {
            navigate('/login')
        } else {
            setMessage('Posting review')
            const response = await axios.post('/api/reviews', {
                rating: values.rating,
                body: values.body,
                id: pathname.slice(13),
            }, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
            await sleep(2000)
            if (response.data.success) {
                setMessage(response.data.message)
                setReviews({
                    isUpdated: true,
                    data: response.data.reviews
                })
                await sleep(2000)
                submitProps.resetForm()
                setMessage('')
            } else {
                setMessage(response.data.message)
            }
        }
    }


    return (
        <div className='border-2 shadow-sm mt-6 mb-6 px-4 md:mr-10 py-4 rounded-md'>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {formik => {

                    return (
                        <Form>
                            <div>
                                <Field name='rating' component={Rating}></Field>
                                <ErrorMessage component={TextError} name='rating' />
                            </div>
                            <FormikControl
                                control='textarea'
                                label='Write a review'
                                name='body'
                            />
                            <button className='mt-5 border-2 bg-red-600 text-white text-sm rounded-md border-red-600 py-2 font-bold tracking-wider cursor-pointer w-full hover:bg-red-700 hover:border-red-700 shadow-sm' type='submit' disabled={!formik.isValid}>Leave a Review</button>
                            <div className={`${message !== 'Posting review' ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>
                                <span className='font-bold text-gray-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'Successfully posted review!' ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-green-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'Cannot create review!' ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-red-600'>{message}</span>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}



export default ReviewForm
