//TODO: Experiment with lines to show row of 4

'use client';

import {useState, useEffect, ReactElement} from 'react'
import Link from 'next/link'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polygon, Polyline } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';

const libraries : Library[] = ['places', 'geometry'];
type featureData = {
	featureName : string,
	coords: { lat: number; lng: number; }[]
};
interface PolyData extends featureData {
	matchedLines : featureData[]
	matchedLineElements?: ReactElement[]
}
interface mapProps {
	regionData: string
	regions?: PolyData[]; //TODO: make this global
	lines?: featureData[];
}

export default function Map({regions, lines}: mapProps) {
	const [position, setPosition] = useState(center);
	// const [lineVisibility, setLineVisibility] = useState({} as {[key: string]: boolean});
	
	// //create line visibility state object
	// const lineVisibilityTemp = lines?.reduce((acc, line) => {
	// 	acc[line.featureName] = false;
	// 	return acc;
	// }, {} as {[key: string]: boolean});
	// lines?setLineVisibility(lineVisibilityTemp!):null;
	const [lineVisibility, setLineVisibility] = useState(lines? lines.reduce((acc, line) => {
			acc[line.featureName] = false;
			return acc;
		}, {} as {[key: string]: boolean}): {})

	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA',
		libraries: libraries,
	})

	//Location marker
	const [currentRegion, setCurrentRegion] = useState("");
	//const [infoWindowPos, setInfoWindowPos] = useState(center);
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
	
	//Render region lines
	const lineElements = lines?.map((line) => {
		return mapLine(line, lineVisibility);
	})

	//Render region polygons
	const regionElements = regions?.map((region) => {
		const onClick = function () {
			//create a shallow copy of lineVisibility with matched lines set to true and others set to false
			const lineVisibilityTemp = {...lineVisibility};
			lines?.forEach((line) => {
				lineVisibilityTemp[line.featureName] = region.matchedLines.some((matchedLine) => matchedLine.featureName === line.featureName);
			})
			setLineVisibility(lineVisibilityTemp);
			// setCurrentRegion(region.featureName);
		}
		return RegionPolygon(region, onClick);

	})

	//Info window
	const regionWindow = <InfoWindow 
			position = {center}
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

	//Render the map or loading screen
	return isLoaded ? (
	<div id="map">
		<GoogleMap
		mapContainerStyle={containerStyle}
		center={center}
		zoom={12}
		>
		{/* This does the montreal grid */}
		
		{regionElements}
		{lineElements}

		{/* This is the info window popup */}
		{currentRegion? regionWindow: null}
		{/* This is the location marker */}
		
		{locationMarker}
		</GoogleMap>
    </div>
	) : <>Loading...</>
}

function mapLine(line: featureData, lineVisibility: {[key: string]: boolean}) {
	return <Polyline 
	key = {line.featureName}
	path = {line.coords}
	visible = {lineVisibility[line.featureName]}
	options = {{
		strokeColor: 'red',
		strokeOpacity: 0.5,
		strokeWeight: 6
	}}
	/>
}

function RegionPolygon(region: PolyData, onClick: () => void) {
	const [hovered, setHovered] = useState(false);
	return <Polygon 
		path = {region.coords}
		key = {region.featureName}
		options = {{
			strokeColor: 'black',
			strokeOpacity: 0.8,
			strokeWeight: hovered ? 4 : 2,
			fillColor: 'black',
			fillOpacity: 0.35
		}}
		onClick = {onClick}
		onMouseOver = {() => {
			setHovered(true)
		}}
		onMouseOut = {() => {
			setHovered(false)
		}}
		/>
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

const center: google.maps.LatLngLiteral = {
	lat: -37.8136,
	lng: 144.9631
  }
