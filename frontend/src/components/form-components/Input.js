import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

const InputComponent = ({ field, form, ...props }) => {
    const { name } = field
    return (
        <input className={`border-2 shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-sky-500 focus:ring-1 rounded-md w-full pl-2 py-2 ${(form.errors[name] && form.touched[name]) ? 'border-red-600' : ''} `} {...field} {...props}></input>
    )
}

function Input(props) {
    const { label, name, ...rest } = props
    return (
        <div className='mb-5'>
            <Field component={InputComponent} id={name} name={name} {...rest} placeholder={label} />
            <ErrorMessage component={TextError} name={name} />
        </div>
    )
}

export default Input
