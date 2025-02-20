import { PolyData, zoneData, Color } from "@/app/types";
import { Polygon } from "@react-google-maps/api";

type ZonePolygonProps = {
	zone: PolyData, 
	onClick: (lineVisibility: {[key: string]: boolean}, polygonVisibility: {[key: string]: boolean}) => void,
	currentZone: zoneData | undefined, 
	highlightedZones: {[key: string]: boolean,}, 
	highlightColor: Color,
	zoneGameData: zoneData,
}

export default function ZonePolygon({zone, onClick, currentZone, highlightedZones, highlightColor, zoneGameData} : ZonePolygonProps){
	const amCurrentZone = zone.featureName === currentZone?.name;
	
	const lineVisibilityTemp = Object.fromEntries(zone.matchedLines.map((line) => [line.featureName, true]));
	const highlightedZonesTemp = Object.fromEntries(zone.matchedLines.map((line) => line.matchedPolygons.map((poly) => {
		return [poly.featureName, true]
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
		onClick = {() => onClick(lineVisibilityTemp, highlightedZonesTemp)}
		/>
}