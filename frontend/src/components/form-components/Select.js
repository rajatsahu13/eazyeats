import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function Select(props) {
    const { label, name, options, ...rest } = props
    return (
        <div className='mb-5'>
            <Field as='select' id={name} name={name} {...rest} className='border-2 rounded-md w-full pl-2 py-2 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-sky-500 focus:ring-1'>
                {options.map(option => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.key}
                        </option>
                    )
                })}
            </Field>
            <ErrorMessage component={TextError} name={name} />
        </div>
    )
}

export default Select
