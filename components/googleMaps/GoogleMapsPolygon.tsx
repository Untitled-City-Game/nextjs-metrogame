import { PolyData, ZoneData, Color } from "@/scripts/types";
import { Polygon } from "@react-google-maps/api";

type ZonePolygonProps = {
	zone: PolyData, 
	handleZoneClick: (lineVisibility: {[key: string]: boolean}, polygonVisibility: {[key: string]: boolean}) => void,
	currentZone: ZoneData | undefined, 
	highlightedZones: {[key: string]: boolean,}, 
	highlightColor: Color,
	zoneGameData: ZoneData,
}

export default function ZonePolygon({zone, handleZoneClick, currentZone, highlightedZones, highlightColor, zoneGameData} : ZonePolygonProps){
	const amCurrentZone = zone.featureName === currentZone?.name;
	
	const lineVisibilityTemp = Object.fromEntries(zone.matchedLines.map((line) => [line.featureName, true]));
	const highlightedZonesTemp = Object.fromEntries(zone.matchedLines.map((line) => line.matchedPolygons.map((poly) => {
		return [poly, true]
	})).flat());
	return <Polygon 
		path = {zone.coords}
		key = {zone.featureName}
		options = {{
			strokeColor: 'black',
			strokeOpacity: 0.8,
			strokeWeight: amCurrentZone ? 4 : 2,
			fillColor: highlightedZones[zone.featureName] ? highlightColor : zoneGameData.color,
			fillOpacity: amCurrentZone ? 0.5 : 0.2
		}}
		onClick = {() => handleZoneClick(lineVisibilityTemp, highlightedZonesTemp)}
		/>
}