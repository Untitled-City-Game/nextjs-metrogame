//TODO: Add custom info window
//TODO: Route to location claim page

'use client';

import {useState, useEffect} from 'react'
import { GoogleMap, useJsApiLoader, KmlLayer, Marker } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';

const libraries : Library[] = ['places', 'geometry'];

export default function Map() {
	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA',
		libraries: libraries,
	})  

	//Not sure what this is for yet
	const [map, setMap] = useState(null)	
	
	//Location marker
	const [location, setLocation] = useState(center)

	const locationMarker = <Marker 
		position={location}
		title="You are here"
	/>

	//Track user location
	useEffect(() => {
		navigator.geolocation.watchPosition(showPosition)
	})

	function showPosition(current_pos: GeolocationPosition) {
		console.log(
			"Location: " + current_pos.coords.latitude + 
			"," + current_pos.coords.longitude
		);
		setLocation({
			lat: current_pos.coords.latitude,
			lng: current_pos.coords.longitude
		});
	}

	//Render the map or loading screen
	return isLoaded ? (
		<div id="map">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
		{/* This does the montreal grid */}
      <KmlLayer
      url="https://drive.google.com/uc?export=kml&id=1ro8t3OM2T_RNs7QNwACjvmo1XhmUcN2e"
      options={{ 
		preserveViewport: true, 
		suppressInfoWindows: true,
	}}

	// What happens if you click on a region
	  onClick={(event: google.maps.KmlMouseEvent) => {
		if(event.featureData != null) {
			console.log(event.featureData.name)
		}
	  }}
    />

	{locationMarker}
    </GoogleMap>
        </div>
	) : <>Loading...</>
}


//Styles to make map appear
const containerStyle = {
	width: '800px',
	height: '800px',
  }
  
  //Map center location
  const center = {
	lat:  45.529819917244254,
	lng: -73.60361034602055,
  }