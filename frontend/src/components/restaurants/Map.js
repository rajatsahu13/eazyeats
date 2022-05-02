import React from 'react'
import GoogleMapReact from 'google-map-react';

function Map({ lat, lng, address }) {

    const location = {
        address: address,
        center: {
            lat: lat,
            lng: lng
        }
    }
    const createMapOptions = {
        panControl: false,
        mapTypeControl: false,
        scrollwheel: false,
        zoomControl: false,
        fullscreenControl: false
    }
    return (
        <div className='pt-4 container'>
            <h4 className='text-xl text-left font-bold pb-4'>Location</h4>
            <div id='map'>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
                    center={location.center}
                    zoom={16}
                    options={createMapOptions}
                >
                    <LocationPin
                        lat={location.center.lat}
                        lng={location.center.lng}
                        text={location.address}
                    />
                </GoogleMapReact>
            </div>
            <p className='text-md text-left pt-4'>{location.address}</p>
        </div >
    )
}

const LocationPin = ({ text }) => (
    <div style={{
        position: 'absolute',
        transform: 'translate(-50%, -70%)',
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="rgb(220, 38, 38)">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {/* <p className="pin-text">{text}</p> */}
    </div>
)

export default Map
