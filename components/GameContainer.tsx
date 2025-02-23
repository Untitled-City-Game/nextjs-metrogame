import { MetroGameProps } from '@/scripts/types';
import ClientContainer from './ClientContainer';

export default async function GameContainer({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>) {
	const res = await fetch("http://localhost:8000/map-data")
	const mapData = await res.json() as MetroGameProps;
	return(
	<ClientContainer zones={mapData.zones} winningLines={mapData.winningLines}>{children}</ClientContainer>
	)
}


