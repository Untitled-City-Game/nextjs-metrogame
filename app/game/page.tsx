import MapContainer from "@components/mapcontainer";
import { Tabs, TabsTab, TabsList, TabsPanel, Container } from "@mantine/core";
export default function Home() {
  return (
	<Container mih = "100vh" h="0">
			<Tabs defaultValue={"map"} h="100%">
			<TabsList>
				<TabsTab value="cards">
					Game
				</TabsTab>
				<TabsTab value="map">
					Map
				</TabsTab>
				<TabsTab value="log">
					Log
				</TabsTab>
			</TabsList>
			<TabsPanel value="game">
				<h1>Game</h1>
			</TabsPanel>
			<TabsPanel value="map" h="100%">
				<MapContainer />
				<p>Here is some text</p>
				<p>More text</p>
			</TabsPanel>
			<TabsPanel value="log">
				<h1>Log</h1>
			</TabsPanel>
			</Tabs>		
			</Container>		
  );
}
