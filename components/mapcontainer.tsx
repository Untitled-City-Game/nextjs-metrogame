import {promises as fs} from 'fs';
import Map from './map';
import { Position, LineString } from 'geojson';
import PointInPolygon from 'point-in-polygon';

export default async function MapContainer() {
	const regionData = await fs.readFile(process.cwd() + '/app/data/melbourne.geojson', 'utf8');
	const regionDataObj: GeoJSON.FeatureCollection = JSON.parse(regionData);
	const regionLines: LineData[] = makeLines(regionDataObj);
	const regionPolygons: PolyData[] = makePolygons(regionDataObj, regionLines);
	type featureData = {
		featureName : string,
		coords: { lat: number; lng: number; }[]
	};
	interface PolyData extends featureData {
		matchedLines : LineData[]
	}
	interface LineData extends featureData {
		matchedPolygons : PolyData[]
	}
	return(
		<Map regionData = {regionData} regions = {regionPolygons} lines = {regionLines}/>
	)
		interface PolygonFeature extends GeoJSON.Feature {
			geometry: GeoJSON.Polygon;
			properties: GeoJSON.GeoJsonProperties & {Name: string};
		}
		//Make the polygons
		function makePolygons(regionDataObj: GeoJSON.FeatureCollection, regionLines: LineData[]) {

			//filter to polygons
			const isPolygon = (region: GeoJSON.Feature) => region.geometry.type === "Polygon";
			const polygons : GeoJSON.Feature[] = regionDataObj.features.filter(isPolygon);
			//filter to polygons with valid properties and coordinates
			const isValidPolygon = (region: GeoJSON.Feature): region is PolygonFeature => {return 'properties' in region && 'geometry' in region && 'coordinates' in region.geometry && region.geometry.coordinates.length > 0;}
			const validPolygons = polygons.filter(isValidPolygon);
			//Create the regions
			const regionPolygons = validPolygons.map((region: PolygonFeature) => {
				const regionName: string = region.properties.Name;
				//Find lines which have a point in the polygon
				const matchedLines = regionLines.filter((line: LineData) => {
					return line.coords.some((coord) => PointInPolygon([coord.lng, coord.lat], region.geometry.coordinates[0]));
				});

				//convert coords to latlong (for some reason polygon has an extra array layer than polyline)
				const regionCoords = region.geometry.coordinates[0].map((coord: Position) => {
					const latlong = coord as number[];
					return {lat: latlong[1], lng: latlong[0]}
				})
				const newPoly: PolyData = {featureName: regionName, coords: regionCoords, matchedLines : matchedLines};
				//add matched lines to the line's matchedPolygons
				matchedLines.forEach((line) => {
					line.matchedPolygons.push(newPoly);
				});
				return newPoly;
			})
			
			return regionPolygons;
	}

		interface LineFeature extends GeoJSON.Feature {
			geometry: LineString;
			properties: GeoJSON.GeoJsonProperties & {Name: string};
		}
	
		function makeLines(regionDataObj: GeoJSON.FeatureCollection) {
			//filter to polylines
			const isPolyLine = (line: GeoJSON.Feature) => line.geometry.type === "LineString";
			const polyLines : GeoJSON.Feature[] = regionDataObj.features.filter(isPolyLine);

			//filter to polylines with valid properties and coordinates
			const isValidPolyLine = (line: GeoJSON.Feature): line is LineFeature => {return 'properties' in line && 'geometry' in line && 'coordinates' in line.geometry && line.geometry.coordinates.length > 0;}
			const validPolyLines = polyLines.filter(isValidPolyLine);

			//Create the lines
			const regionLines = validPolyLines.map((line: LineFeature) => {
				const lineName: string = line.properties.Name
				//convert coords to latlong
				const lineCoords = line.geometry.coordinates.map((coord: Position) => {
					const latlong = coord as number[];
					return {lat: latlong[1], lng: latlong[0]}
				})
				return {featureName: lineName, coords: lineCoords, matchedPolygons: []};
			})
			return regionLines;
		}
}
