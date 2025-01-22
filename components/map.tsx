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
	const [position, setPosition] = useState(center);

	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA',
		libraries: libraries,
	})

	//Location marker
	const [currentRegion, setCurrentRegion] = useState("");
	const [infoWindowPos, setInfoWindowPos] = useState(center);
	const locationMarker = <Marker 
		position={position}
		title="You are here"
	/>

	//Track user location
	useEffect(() => {
		console.log("useEffect")
		if(navigator.geolocation) {
			navigator.geolocation.watchPosition((position) => {
				setPosition({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}),
				console.log("pos not found")
			})
		} else {
			console.log("location not found")
		}
	}, []);

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
				onClick = {() => {
					setCurrentRegion(regionName);
					setInfoWindowPos(regionCoords[0]);
				}}
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

  const center = {
	lat:  45.529819917244254,
	lng: -73.60361034602055,
  }
//melbourne
// const center: google.maps.LatLngLiteral = {
// 	lat: -37.8136,
// 	lng: 144.9631
//   }