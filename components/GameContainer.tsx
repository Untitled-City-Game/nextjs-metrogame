import { GameSetupData } from '@/scripts/types';
import ClientContainer from './ClientContainer';

export default async function GameContainer({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>) {
	const res = await fetch(process.env.GAME_SERVER + "/map-data")
	const mapData = await res.json() as GameSetupData;
	return(
	<ClientContainer zonePolygons={mapData.zonePolygons} winningLines={mapData.winningLines}>{children}</ClientContainer>
	)
}