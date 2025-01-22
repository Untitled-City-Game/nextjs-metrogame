import {promises as fs} from 'fs';
import Map from './map';

export default async function MapContainer() {
	const regionData = await fs.readFile(process.cwd() + '/app/data/melbourne.geojson', 'utf8');
	return(
		<Map regionData = {regionData} />
	)
}
