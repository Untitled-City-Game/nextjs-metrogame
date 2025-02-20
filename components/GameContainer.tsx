import {LineData, PolyData } from '@/app/types';
import {promises as fs} from 'fs';
import makeLines from './geojson/makeLines';
import makePolygons from './geojson/makePolygons';
import ClientContainer from './ClientContainer';


export default async function GameContainer({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>) {
	const {zonePolygons: zonePolygons, zoneLines: zoneLines} = await fetchData();
	return(
	<ClientContainer zoneData={'zoneData'} zones={zonePolygons} winningLines={zoneLines}>{children}</ClientContainer>
	)
}


async function fetchData(){
	const zoneData = await fs.readFile(process.cwd() + '/app/data/melbourne.geojson', 'utf8');
	const zoneDataObj: GeoJSON.FeatureCollection = JSON.parse(zoneData);
	const zoneLines: LineData[] = makeLines(zoneDataObj);
	const zonePolygons: PolyData[] = makePolygons(zoneDataObj, zoneLines);
	return {zonePolygons: zonePolygons, zoneLines};
}

