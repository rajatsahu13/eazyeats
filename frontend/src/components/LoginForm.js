import React, { useState, useContext } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from './form-components/FormikControl'
import axios from 'axios'
import { RestaurantContext } from '../RestaurantContext'
import { useNavigate } from 'react-router-dom'
import sleep from '../hooks/sleep'

function LoginForm() {
    const [payload, setPayload] = useContext(RestaurantContext)
    const [message, setMessage] = useState('')
    let navigate = useNavigate();

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string().required('Required')
    })

    const onSubmit = async (values) => {
        setMessage('Logging in')
        const response = await axios.post('/api/auth/login/', {
            email: values.email,
            password: values.password
        })
        await sleep(2000)
        if (response.data.auth) {
            setMessage('Successfully logged in!')
            localStorage.setItem("token", response.data.token)
            setPayload({
                ...payload,
                isUpdated: true,
                loginStatus: true,
                user: response.data.user
            })
            await sleep(2000)
            navigate(-1)
            setMessage('')
        } else if (!response.data.auth && response.data.message === 'Wrong password!') {
            setMessage('Wrong password!')
        } else {
            setMessage('That email is not registered!')
        }
    }

    return (
        <div className='w-full md:w-1/3 mx-auto my-28 md:my-20'>
            <h2 className='text-2xl font-bold py-4 text-center'>Login to easyeats</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {formik => {
                    return (
                        <Form>
                            <FormikControl
                                control='input'
                                type='email'
                                label='Email'
                                name='email'
                            />
                            <FormikControl
                                control='input'
                                type='password'
                                label='Password'
                                name='password'
                            />
                            <button className='mt-5 border-2 bg-red-600 text-white text-sm rounded-md border-red-600 py-2 font-bold tracking-wider cursor-pointer w-full hover:bg-red-700 hover:border-red-700 shadow-sm' type='submit' disabled={!formik.isValid}>Login</button>
                            <div className={`${message !== 'Logging in' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className='font-bold text-gray-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'Successfully logged in!' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-green-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'Wrong password!' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-red-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'That email is not registered!' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-red-600'>{message}</span>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default LoginForm
