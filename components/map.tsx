//TODO: Show location
//TODO: Add custom info window
//TODO: Route to location claim page

'use client';

import React from 'react'
import { GoogleMap, useJsApiLoader, KmlLayer } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';

const libraries : Library[] = ['places', 'geometry'];

export default function Map() {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA',
		libraries: libraries,
	})  
	const [map, setMap] = React.useState(null)	
	return isLoaded ? (
		<div id="map">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      <KmlLayer
      url="https://drive.google.com/uc?export=kml&id=1ro8t3OM2T_RNs7QNwACjvmo1XhmUcN2e"
      options={{ 
		preserveViewport: true, 
		suppressInfoWindows: true,
	}}
	  onClick={(event: google.maps.KmlMouseEvent) => {
		if(event.featureData != null) {
			console.log(event.featureData.name)
		}
	  }}
    />
    </GoogleMap>
        </div>
	) : <>Loading...</>
}

const containerStyle = {
	width: '800px',
	height: '800px',
  }
  
  const center = {
	lat:  45.529819917244254,
	lng: -73.60361034602055,
  }