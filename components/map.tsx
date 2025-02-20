//TODO: Experiment with lines to show row of 4

'use client';

import {useState, useEffect, ReactElement} from 'react'
import Link from 'next/link'
import { GoogleMap, useJsApiLoader, Marker, Polygon, Polyline, Circle } from '@react-google-maps/api';
import { Library } from '@googlemaps/js-api-loader';
import { Paper, Button } from '@mantine/core';
import type { GameState } from '@/app/types.js';

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
	zones?: PolyData[]; //TODO: make this global
	winningLines?: featureData[];
}

export default function DrawGoogleMap({zones, winningLines}: mapProps) {
	const [position, setPosition] = useState(gameLocationCenter);
	//tracks which lines should be visible
	const [lineVisibility, setLineVisibility] = useState(winningLines? winningLines.reduce((acc, line) => {
			acc[line.featureName] = false;
			return acc;
		}, {} as {[key: string]: boolean}): {});
	//tracks which polygons should be highlighted
	const [highlightedRegions, setHighlightedRegions] = useState(zones? zones.reduce((acc, region) => {
		acc[region.featureName] = false;
		return acc;
	}, {} as {[key: string]: boolean}): {});

	const [currentRegion, setCurrentRegion] = useState("");
	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA',
		libraries: libraries,
	})

	//Location marker
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
	const lineElements = winningLines?.map((line) => {
		return mapLine(line, lineVisibility);
	})

	//Render region polygons
	const regionElements = zones?.map((region) => {
		//create a shallow copy of lineVisibility with matched lines set to true
		const lineVisibilityTemp = {...lineVisibility};
		winningLines?.forEach((line) => {
			lineVisibilityTemp[line.featureName] = region.matchedLines.some((matchedLine) => matchedLine.featureName === line.featureName);
		})
		//create shallow copy of highlightedRegions with any regions that are associated with the lines set to true
		const highlightedRegionsTemp = {...highlightedRegions};
		zones?.forEach((region) => {
			highlightedRegionsTemp[region.featureName] = region.matchedLines.some((matchedLine) => lineVisibilityTemp[matchedLine.featureName]);
		});
		const onClick = function () {
			//set line visibility
			setLineVisibility(lineVisibilityTemp);
			//set region highlight
			setHighlightedRegions(highlightedRegionsTemp);
			setCurrentRegion(region.featureName);
		}
		return RegionPolygon(region, onClick, currentRegion, highlightedRegions);
	})

	//Render the map or loading screen
	return isLoaded ? (
		<>
	<div id="map" style = {mapStyles}>
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={gameLocationCenter}
			zoom={12}
			>
			{/* This does the montreal grid */}
			{regionElements}
			{lineElements}
			
			{/* This is the location marker */}
			{locationMarker}
		</GoogleMap>
    </div>
	{currentRegion ? (
	<Paper style={infoRegionStyles}>
		{currentRegion}
		<Button component={Link} href={{
			pathname: '/claim',
			query: {region: currentRegion}
		}}>
			Claim
		</Button>
	</Paper>
	) : null}
	</>
	) : <>Loading...</>
}

function mapLine(line: featureData, lineVisibility: {[key: string]: boolean}) {
	return(
		<>
			<Polyline 
			key = {line.featureName}
			path = {line.coords}
			visible = {lineVisibility[line.featureName]}
			options = {{
				strokeColor: 'red',
				strokeOpacity: 0.8,
				strokeWeight: 6
			}}
			/>
			{/* Make a circle at each vertex of the polyline */}
			{line.coords.map((coord, index) => {
				return (<><Circle
					center = {coord}
					radius = {0}
					visible = {lineVisibility[line.featureName]}
					key = {line.featureName + String(index)}
					options = {{
						strokeColor: 'red',
						strokeOpacity: 1,
						strokeWeight: 12,
						fillColor: 'red',
						fillOpacity: 1
					}}
				/>
				<Circle
					center = {coord}
					radius = {0}
					visible = {lineVisibility[line.featureName]}
					key = {line.featureName + String(index) + "inner"}
					options = {{
						strokeColor: 'white',
						strokeOpacity: 1,
						strokeWeight: 6,
						zIndex: 1
					}}
				/>
				</>)
			})}
		</>
	)
}

function RegionPolygon(region: PolyData, onClick: () => void, currentRegion: string, highlightedRegions: {[key: string]: boolean}) {
	const amCurrentRegion = region.featureName === currentRegion;
	return <Polygon 
		path = {region.coords}
		key = {region.featureName}
		options = {{
			strokeColor: 'black',
			strokeOpacity: 0.8,
			strokeWeight: amCurrentRegion ? 4 : 2,
			fillColor: highlightedRegions[region.featureName] ? 'blue' : 'black',
			fillOpacity: amCurrentRegion ? 0.5 : 0.2
		}}
		onClick = {onClick}
		/>
}

//Styles to make map appear
const containerStyle = {
	width: '100%',
	height: '100%',
  }  

 //Montreal

//   const center = {
// 	lat:  45.529819917244254,
// 	lng: -73.60361034602055,
//   }

//melbourne

const gameLocationCenter: google.maps.LatLngLiteral = {
	lat: -37.8136,
	lng: 144.9631
  }
  const mapStyles: React.CSSProperties = {
	flexBasis: "200px",
	flexGrow: 5
}

const infoRegionStyles: React.CSSProperties = {
	flexBasis: "100px",
	flexGrow: 1
}