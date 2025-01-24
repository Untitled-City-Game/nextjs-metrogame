//TODO: Experiment with lines to show row of 4

'use client';

import {useState, useEffect, ReactNode, ReactElement} from 'react'
import Link from 'next/link'
import { GoogleMap, useJsApiLoader, KmlLayer, Marker, InfoWindow, Polygon, Polyline, PolylineProps } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import { LineString, Position } from 'geojson';

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
	
	//create line visibility state object
	const lineVisibilityState = lines?.reduce((acc, line) => {
		acc[line.featureName] = useState(false);
		return acc;
	}, {} as {[key: string]: [boolean, React.Dispatch<React.SetStateAction<boolean>>]});
	
	//Render region lines
	const lineElements = lines?.map((line) => {
		return <Polyline 
		key = {line.featureName}
		path = {line.coords}
		visible = {lineVisibilityState![line.featureName][0]} //assert not undefined because lines is not undefined
		options = {{
			strokeColor: 'red',
			strokeOpacity: 0.5,
			strokeWeight: 6
		}}
		/>
	})
	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.MAPS_API as string,
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


	//Render region polygons
	const regionElements = regions?.map((region) => {
		//get matched lines
		const matchedLineElements = region.matchedLines?.map((line) => {
			//find lineElement in lineElements
			const lineElement = lineElements?.find((lineElement) => {
				return lineElement.key === line.featureName;
			})
			return lineElement ? lineElement : null;
		})
		return <Polygon 
		path = {region.coords}
		key = {region.featureName}
		onClick = {() => {
			//setCurrentRegion(region.featureName);
			//make all line elements invisible
			Object.values(lineVisibilityState!).forEach((lineState) => {
				lineState[1](false);
			})
			//make matched line elements visible
			matchedLineElements?.forEach((lineElement) => {
				if(lineElement) {
					lineVisibilityState![lineElement.key as string][1](true);
				}
			})
		}}
		/>
	})

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
		const regionDataObj: GeoJSON.FeatureCollection = JSON.parse(regionData);

		//Create the polygons
		const regionPolygons: ReactNode[] = regionDataObj.features.map((region: GeoJSON.Feature) => {
			//check if region is a polygon
			if(region.geometry.type !== "Polygon" || !region.properties) {
				return null;
			}
			const regionName: string = region.properties.Name;
			//convert coords to latlong
			const regionCoords = region.geometry.coordinates[0].map((coord: any) => {
				return {lat: coord[1], lng: coord[0]}
			})
			return (
			<Polygon
				path = {regionCoords}
				key = {regionName}
				onClick = {(evt) => {
					evt.latLng ? setInfoWindowPos(evt.latLng.toJSON()) : null;
					setCurrentRegion(regionName);
				}}
			/>
		)
		})
		return regionPolygons;
	}

	function makeLines(regionData: string) {
		//Parse the region data
		const regionDataObj: GeoJSON.FeatureCollection = JSON.parse(regionData);

		//Create the lines
		const regionLines: ReactNode[] = regionDataObj.features.map((line: GeoJSON.Feature) => {
			//check if region is a polygon
			if(line.geometry.type !== "LineString" || !line.properties) {
				return null;
			}
			const lineName: string = line.properties.Name;
			//convert coords to latlong
			const lineCoords = line.geometry.coordinates.map((coord: Position) => {
				const latlong = coord as number[];
				return {lat: latlong[1], lng: latlong[0]}
			})
			return (
			<Polyline
				path = {lineCoords}
				key = {lineName}
				onClick = {(evt) => {
					evt.latLng ? setInfoWindowPos(evt.latLng.toJSON()) : null;
					setCurrentRegion(lineName);
				}}
			/>
		)
		})
		return regionLines;
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
