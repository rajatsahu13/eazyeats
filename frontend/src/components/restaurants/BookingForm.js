import React, { useContext, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../form-components/FormikControl'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RestaurantContext } from '../../RestaurantContext'
import sleep from '../../hooks/sleep'

function BookingForm() {
    const [payload] = useContext(RestaurantContext)
    const [message, setMessage] = useState('')
    const { pathname } = useLocation()
    let navigate = useNavigate();
    const dropdownOptions = [
        { key: '1 person', value: '1' },
        { key: '2 people', value: '2' },
        { key: '3 people', value: '3' },
        { key: '4 people', value: '4' },
        { key: '5 people', value: '5' },
        { key: '6 people', value: '6' },
        { key: '7 people', value: '7' },
        { key: '8 people', value: '8' },
        { key: '9 people', value: '9' },
        { key: '10 people', value: '10' }
    ]

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        selectGuests: '2',
        date: new Date()
    }
    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().required('Required'),
        phone: Yup.number().required('Required'),
        selectGuests: Yup.string().required('Required'),
        date: Yup.date().required('Required')
    })
    const onSubmit = async (values, submitProps) => {
        if (payload.loginStatus) {
            setMessage('Finding a table')
            const response = await axios.post('/api' + pathname + '/book', {
                firstname: values.firstName,
                lastname: values.lastName,
                email: values.email,
                phone: values.phone,
                guests: values.selectGuests,
                date: values.date
            }, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
            await sleep(2000)
            if (response.data.success) {
                setMessage(response.data.message)
                await sleep(2000)
                submitProps.resetForm()
                setMessage('')
            } else {
                setMessage(response.data.message)
                await sleep(2000)
            }
        } else {
            navigate('/login')
        }
    }

    return (
        <div className='col-span-1 mt-8 md:mt-0'>
            <div className='border-2 px-4 pt-4 rounded-md'>
                <h4 className='text-2xl font-bold'>Make A Reservation</h4>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {formik => (
                        <Form className='py-6'>
                            <FormikControl
                                control='input'
                                type='text'
                                label='First Name'
                                name='firstName'
                            />
                            <FormikControl
                                control='input'
                                type='text'
                                label='Last Name'
                                name='lastName'
                            />
                            <FormikControl
                                control='input'
                                type='email'
                                label='Email'
                                name='email'
                            />
                            <FormikControl
                                control='input'
                                type='text'
                                label='Phone'
                                name='phone'
                            />
                            <FormikControl
                                control='select'
                                label='Select guests'
                                name='selectGuests'
                                options={dropdownOptions}
                            />
                            <FormikControl
                                control='date'
                                label='Pick a date'
                                name='date'
                            />
                            <button className='mt-5 border-2 bg-red-600 text-white text-sm rounded-md border-red-600 py-2 font-bold tracking-wider cursor-pointer w-full hover:bg-red-700 hover:border-red-700 shadow-sm' type='submit'>Find a Table</button>
                            <div className={`${message !== 'Finding a table' ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-gray-600'>{message}</span>

                            </div>
                            <div className={`${message !== 'Successfully booked a table!' ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-green-600'>{message}</span>

                            </div>
                            <div className={`${message !== 'Cannot find a table!' ? 'hidden' : 'flex justify-center items-center pt-3 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-red-600'>{message}</span>

                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default BookingForm
