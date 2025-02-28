"use client";

import { useState, useContext, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { MetroGameBoardProps, zoneData } from "@/scripts/types.js";
import { gameLocationCenter, highlightColor } from "@/scripts/consts";
import { GameContext } from "../ClientContainer";
import LocationMarker from "../googleMaps/location";
import MapLine from "../googleMaps/GoogleMapsLine";
import ZonePolygon from "../googleMaps/GoogleMapsPolygon";
import SelectedZonePopup from "../googleMaps/SelectedZonePopup";
import Header from "../userInterface/Header";

const libraries: Library[] = ["places", "geometry"];


export default function MapBoard() {
	const props: MetroGameBoardProps = useContext(GameContext);
	//console.log("playerdata", props.G.allPlayersData);
	const { zonePolygons, winningLines, G } = props;
	const [lineVisibility, setLineVisibility] = useState(
		winningLines
			? winningLines.reduce((acc, line) => {
					acc[line.featureName] = false;
					return acc;
			  }, {} as { [key: string]: boolean })
			: {}
	);

	const [highlightedZones, setHighlightedZones] = useState(
		zonePolygons
			? zonePolygons.reduce((acc, zone) => {
					acc[zone.featureName] = false;
					return acc;
			  }, {} as { [key: string]: boolean })
			: {}
	);

	const [currentZone, setCurrentZone] = useState<zoneData>();

	//Load the map
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: "AIzaSyAhg8bq82cx8W6bqb-KTjk1QmrgOi43gdA",
		libraries: libraries,
	});

	//Render zone lines
	const lineElements = winningLines.map((line, index) => {
		return (
			<MapLine
				index={index}
				line={line}
				lineVisibility={lineVisibility[line.featureName]}
				key={index}
			/>
		);
	});

	//Render zone polygons
	const zoneElements = zonePolygons?.map((zone, index) => {
		const onClick = function (
			lineVisibilityTemp: { [key: string]: boolean },
			highlightedZonesTemp: { [key: string]: boolean }
		) {
			//set line visibility
			setLineVisibility(lineVisibilityTemp);
			setHighlightedZones(highlightedZonesTemp);
			setCurrentZone(G.zoneData[index]);
		};
		return (
			<ZonePolygon
				zone={zone}
				onClick={onClick}
				currentZone={currentZone}
				highlightedZones={highlightedZones}
				highlightColor={highlightColor}
				zoneGameData={G.zoneData[index]}
				key={index}
			/>
		);
	});

	//Render the map or loading screen
	return isLoaded ? (
		<>
		<Header>
			<h1>Map</h1>
		</Header>
		<div style={mapContainerStyles}>
			<div id="map" style={mapStyles}>
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={gameLocationCenter}
					zoom={12}>
					{/* This does the montreal grid */}
					{zoneElements}
					<>{lineElements}</>
					{/* This is the location marker */}
					<LocationMarker initialPosition={gameLocationCenter} />
				</GoogleMap>
			</div>
			<SelectedZonePopup currentZone={currentZone} />
		</div>
		</>
	) : (
		<>Loading...</>
	);
}

//Styles to make map appear
const containerStyle = {
	width: "100%",
	height: "100%",
};

const mapStyles: React.CSSProperties = {
	flexBasis: "200px",
	flexGrow: 7,
};


const mapContainerStyles: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	flexGrow: 10,
};