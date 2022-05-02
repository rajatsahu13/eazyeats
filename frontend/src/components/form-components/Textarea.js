import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function Textarea(props) {
    const { label, name, ...rest } = props
    return (
        <div className='mt-4'>
            <Field as='textarea' className="border-2 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-sky-500 focus:ring-1 rounded-md w-full pl-2 py-2" id={name} name={name} placeholder={label} {...rest} />
            <ErrorMessage component={TextError} name={name} />
        </div>
    )
}

export default Textarea
