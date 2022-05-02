import React, { useState } from 'react'
import DateView from 'react-datepicker'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'
import 'react-datepicker/dist/react-datepicker.css'

function DatePicker(props) {
    const [date, setDate] = useState(new Date());
    const { label, name, ...rest } = props
    return (
        <div className='form-control'>
            <Field name={name}>
                {({ form, field }) => {
                    const { setFieldValue } = form
                    return (
                        <DateView
                            id={name}
                            {...field}
                            {...rest}
                            selected={date}
                            onChange={val => setFieldValue(name, val) && setDate(val)}
                            minDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                            className='border-2 w-full rounded-md pl-2 py-2 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-sky-500 focus:ring-1'
                        />
                    )
                }}
            </Field>
            <ErrorMessage component={TextError} name={name} />
        </div>
    )
}

export default DatePicker
