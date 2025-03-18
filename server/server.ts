import { fetchMapData } from '@scripts/fetchMapData';
import { Server, Origins, FlatFile } from 'boardgame.io/server';
import { LineData, PolyData, GameSetupData } from '@/scripts/types';
import makeLines from '@/components/geojson/makeLines';
import makePolygons from '@/components/geojson/makePolygons';
import { ConnectFour } from './connect_four';
import { cities } from '@/scripts/consts';
import { firebaseConfig } from '@/scripts/firebase';
import admin from 'firebase-admin';
import { Firestore } from 'bgio-firebase';

const database = new Firestore({
	config: {
		credential: admin.credential.applicationDefault(),
		databaseURL: 'https://metro-game-474bc.firebaseio.com',
	},
  });
  

async function fetchAllData(){
	const allData : Record<string, GameSetupData> = {};
	for (const city of cities){
		let data : GameSetupData;
		try {
			const mapData = await fetchMapData(city);
			data = {
				city: city,
				...mapData
			}
			console.log("fetched data for city", city);
			allData[city] = data;
			continue;
			} catch (e){
				console.log("error fetching data for city", city);
				console.log(e);
				continue;
			}
	}
	return allData;
}


async function buildServer(){
	console.log("building server")
	const AllMapsData : Record<string, GameSetupData> = await fetchAllData();
	const server = Server({
		games: [ConnectFour],
		origins: [Origins.LOCALHOST, "https://nextjs-metrogame--metro-game-474bc.us-central1.hosted.app"],
		db: database,
	});
	server.router.get('/hello', (ctx) => {
		ctx.body = 'Hello ee!';
	  });
	server.router.get('/map-data/:city', (ctx) => {
		console.log("getting map data for city", ctx.params.city);
		ctx.body = AllMapsData[ctx.params.city] ? AllMapsData[ctx.params.city] : {};
	  });
	const PORT = parseInt(process.env.PORT || "8000");
	server.run(PORT, () => console.log("server running..."));
}

buildServer();