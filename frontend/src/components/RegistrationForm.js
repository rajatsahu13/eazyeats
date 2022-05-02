import React, { useState, useContext } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from './form-components/FormikControl'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { RestaurantContext } from '../RestaurantContext'
import sleep from '../hooks/sleep'


function RegistrationForm() {
    const [payload, setPayload] = useContext(RestaurantContext)
    const [message, setMessage] = useState('')
    let navigate = useNavigate();

    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string().required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
            .required('Required')
    })

    const onSubmit = async (values) => {
        setMessage('Signing up')
        const response = await axios.post('/api/auth/register', {
            name: values.name,
            email: values.email,
            password: values.password
        })
        await sleep(2000)
        if (response.data.auth) {
            setMessage('Successfully registered!')
            localStorage.setItem("token", response.data.token)
            setPayload({
                ...payload,
                isUpdated: true,
                loginStatus: true,
                username: response.data.user.name
            })
            await sleep(2000)
            navigate(-1)
            setMessage('')
        } else {
            setMessage('That email is already registered!')
        }
    }

    return (
        <div className='w-full md:w-1/3 mx-auto my-20 md:my-10'>
            <h2 className='text-2xl font-bold py-4 text-center'>Register on easyeats</h2>
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
                                type='text'
                                label='Full Name'
                                name='name'
                            />
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
                            <FormikControl
                                control='input'
                                type='password'
                                label='Confirm Password'
                                name='confirmPassword'
                            />
                            <button className='mt-5 border-2 bg-red-600 text-white text-sm rounded-md border-red-600 py-2 font-bold tracking-wider cursor-pointer w-full hover:bg-red-700 hover:border-red-700 shadow-sm' type='submit' disabled={!formik.isValid}>Register</button>
                            <div className={`${message !== 'Signing up' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className='font-bold text-gray-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'Successfully registered!' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className='font-bold text-green-600'>{message}</span>
                            </div>
                            <div className={`${message !== 'That email is already registered!' ? 'hidden' : 'flex justify-center items-center pt-4 space-x-2'}`}>
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

export default RegistrationForm
