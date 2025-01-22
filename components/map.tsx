//TODO: Experiment with lines to show row of 4
//TODO: Try with polygons instead of KML

'use client';

import {useState, useEffect, ReactNode} from 'react'
import Link from 'next/link'
import { GoogleMap, useJsApiLoader, KmlLayer, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';

const libraries : Library[] = ['places', 'geometry'];

interface mapProps {
	regionData: string
}

export default function Map({regionData}: mapProps) {
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
		const watchID = navigator.geolocation.watchPosition(showPosition)
		return () => {
			navigator.geolocation.clearWatch(watchID)
		}
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
			<div >
				{currentRegion}
			</div>
			<Link href={{
				pathname: '/claim',
				query: {region: currentRegion}
			}}>
				Claim
			</Link>
		</div>
	</InfoWindow>

	//Make the polygons
	function makePolygons(regionData: string) {
		//Parse the region data
		const regionDataObj = JSON.parse(regionData);

		//Create the polygons
		const regionPolygons: ReactNode[] = regionDataObj.features.map((region: any) => {
			//check if region is a polygon
			if(region.geometry.type !== "Polygon") {
				return null;
			}
			const regionName = region.properties.name;
			//convert coords to latlong
			const regionCoords = region.geometry.coordinates[0].map((coord: any) => {
				return {lat: coord[1], lng: coord[0]}
			})
			return (
			<Polygon
				path = {regionCoords}
				key = {regionName}
			/>
		)
		})
		return regionPolygons;
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
	
	{makePolygons(regionData)}

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
	width: '400px',
	height: '100%',
  }

const infoWindowStyle = {
	color: 'black',
	fontWeight: 'bold',
	fontSize: '24px',
	  }
  
  //Map center location

//   const center = {
// 	lat:  45.529819917244254,
// 	lng: -73.60361034602055,
//   }
//melbourne
const center = {
	lat: -37.8136,
	lng: 144.9631
} 
