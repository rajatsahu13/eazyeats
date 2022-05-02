import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'

export const RestaurantContext = createContext()

export const RestaurantProvider = (props) => {
    const [payload, setPayload] = useState({
        isUpdated: false,
        loginStatus: false,
        user: null,
        restaurants: []
    })

    useEffect(() => {
        const fetchData = () => {
            const token = localStorage.getItem("token")
            axios.post('/api/restaurants').then((response) => {
                const restaurantData = response.data.restaurants
                if (token) {
                    axios.get('/api/auth/checkUser', {
                        headers: {
                            "x-access-token": token
                        }
                    }).then((response) => {
                        if (response.data.loggedIn) {
                            setPayload(payload => ({
                                ...payload,
                                isUpdated: true,
                                loginStatus: true,
                                user: response.data.user,
                                restaurants: restaurantData
                            }))
                        } else {
                            localStorage.removeItem("token")
                            setPayload(payload => ({
                                ...payload,
                                isUpdated: true,
                                loginStatus: false,
                                user: null,
                                restaurants: restaurantData
                            }))
                        }
                    })
                } else {
                    setPayload(payload => ({
                        ...payload,
                        isUpdated: true,
                        loginStatus: false,
                        user: null,
                        restaurants: restaurantData
                    }))
                }
            })
        }
        fetchData()
    }, [payload.isUpdated])

    return (
        <RestaurantContext.Provider value={[payload, setPayload]}>
            {props.children}
        </RestaurantContext.Provider>
    )
}

export default RestaurantContext
