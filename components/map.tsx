//TODO: Add custom info window
//TODO: Route to location claim page
//TODO: UseEffect cleanup
'use client';

import {useState, useEffect} from 'react'
import Link from 'next/link'
import { GoogleMap, useJsApiLoader, KmlLayer, Marker, InfoWindow } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';

const libraries : Library[] = ['places', 'geometry'];

export default function Map() {
	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA',
		libraries: libraries,
	})

	//Location marker
	const [location, setLocation] = useState(center);
	const [currentRegion, setCurrentRegion] = useState("");
	const [infoWindowPos, setInfoWindowPos] = useState(center);
	const locationMarker = <Marker 
		position={location}
		title="You are here"
	/>

	//Track user location
	useEffect(() => {
		//Track user location
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

	//Info window
	const regionWindow = <InfoWindow 
			position = {infoWindowPos}
			onCloseClick = {() => setCurrentRegion("")}
		>
		<div style = {infoWindowStyle}>
			{currentRegion}
			<Link href={{
				pathname: '/claim',
				query: {region: currentRegion}
			}}>
				Claim
			</Link>
		</div>
	</InfoWindow>

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

	// Click on a region
	  onClick={(event: google.maps.KmlMouseEvent) => {
		console.log("click!");
		if(event.featureData != null && event.latLng != null) {
			//Open the info window
			setCurrentRegion(event.featureData.name);
			setInfoWindowPos({
				lat: event.latLng.lat(),
				lng: event.latLng.lng()
			});
		}
	  }}
    >
	</KmlLayer>		
	{/* This is the info window popup */}
	{currentRegion? regionWindow: null}
	{/* This is the location marker */}
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

const infoWindowStyle = {
	color: 'black',
	fontWeight: 'bold',
	fontSize: '24px',
	  }
  
  //Map center location
  const center = {
	lat:  45.529819917244254,
	lng: -73.60361034602055,
  }