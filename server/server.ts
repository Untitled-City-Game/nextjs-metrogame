import { Server, Origins, FlatFile } from 'boardgame.io/server';
import {promises as fs} from 'fs';
import { LineData, PolyData, GameSetupData } from '@/scripts/types';
import makeLines from '@/components/geojson/makeLines';
import makePolygons from '@/components/geojson/makePolygons';
import { MetroMayhem } from './connect_four';

async function fetchData(cityName : string = "melbourne"){
	const zoneData = await fs.readFile(process.cwd() + `/../data/${cityName}.geojson`, 'utf8');
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
		origins: [Origins.LOCALHOST, "https://next-metrogame.netlify.app"],
		db: new FlatFile({
			dir: process.cwd() + '/db',
			logging: false,
		})
	});
	server.router.get('/hello', (ctx) => {
		ctx.body = 'Hello ee!';
	  });
	server.router.get('/map-data', (ctx) => {
		ctx.body = mapData;
	  });
	const PORT = parseInt(process.env.PORT || "8000");
	server.run(PORT, () => console.log("server running..."));
}

buildServer();