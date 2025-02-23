import { Server, Origins } from 'boardgame.io/server';
import { MetroMayhem } from '@/scripts/Game';
import makeLines from '@/components/geojson/makeLines';
import makePolygons from '@/components/geojson/makePolygons';
import { LineData, MetroGameProps, PolyData } from './types';
import {promises as fs} from 'fs';


async function fetchData(){
	const zoneData = await fs.readFile(process.cwd() + '/data/melbourne.geojson', 'utf8');
	const zoneDataObj: GeoJSON.FeatureCollection = JSON.parse(zoneData);
	const zoneLines: LineData[] = makeLines(zoneDataObj);
	const zonePolygons: PolyData[] = makePolygons(zoneDataObj, zoneLines);
	return {zones: zonePolygons, winningLines: zoneLines};
}

async function buildServer(){
	const mapData : MetroGameProps = await fetchData();
	const server = Server({
		games: [MetroMayhem(mapData.zones)],
		origins: [Origins.LOCALHOST],
	});
	server.router.get('/hello', (ctx, next) => {
		ctx.body = 'Hello ee!';
	  });
	server.router.get('/map-data', (ctx, next) => {
		ctx.body = mapData;
	  });
	server.run(8000, () => console.log("server running..."));
}

buildServer();

