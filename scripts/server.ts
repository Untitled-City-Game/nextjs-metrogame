import { Server, Origins } from 'boardgame.io/server';
import { MetroMayhem } from '@/scripts/Game';
import makeLines from '@/components/geojson/makeLines';
import makePolygons from '@/components/geojson/makePolygons';
import { GameSetupData, LineData, PolyData } from './types';
import {promises as fs} from 'fs';


async function fetchData(){
	const zoneData = await fs.readFile(process.cwd() + '/data/melbourne.geojson', 'utf8');
	const zoneDataObj: GeoJSON.FeatureCollection = JSON.parse(zoneData);
	const zoneLines: LineData[] = makeLines(zoneDataObj);
	const zonePolygons: PolyData[] = makePolygons(zoneDataObj, zoneLines);
	return {zonePolygons : zonePolygons, winningLines: zoneLines};
}

async function buildServer(){
	console.log("building server")
	const mapData : GameSetupData = await fetchData();
	const server = Server({
		games: [MetroMayhem(mapData.zonePolygons)],
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

