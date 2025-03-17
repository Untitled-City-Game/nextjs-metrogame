import makeLines from "@/components/geojson/makeLines";
import makePolygons from "@/components/geojson/makePolygons";
import { LineData, PolyData } from "./types";
import {promises as fs} from 'fs';

export async function fetchMapData(cityName: string = "melbourne") {
  const zoneData = await fs.readFile(process.cwd() + `/../data/${cityName}.geojson`, 'utf8');
  const zoneDataObj: GeoJSON.FeatureCollection = JSON.parse(zoneData);
  const zoneLines: LineData[] = makeLines(zoneDataObj);
  const zonePolygons: PolyData[] = makePolygons(zoneDataObj, zoneLines);
  return {
    zonePolygons: zonePolygons,
    winningLines: zoneLines
  };
}
  