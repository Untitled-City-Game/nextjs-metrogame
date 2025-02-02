import MapContainer from "@components/mapcontainer";
import { Tabs, TabsTab, TabsList, TabsPanel, Container } from "@mantine/core";
export default function Home() {
  return (
	<Container mih = "100vh" h={0} px={0}>
			<Tabs defaultValue={"map"} h="100%" variant="pills" radius="xs">
				<TabsPanel value="game" style={panelStyles}>
					<h1>Game</h1>
				</TabsPanel>
				<TabsPanel value="map" style={panelStyles}>
					<MapContainer />
				</TabsPanel>
				<TabsPanel value="log" style={panelStyles}>
					<h1>Log</h1>
				</TabsPanel>
				<TabsList pos="fixed" bottom={0} left={0} h={tabHeight} w="100%" grow={true}>
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
			</Tabs>
	</Container>		
  );
}

const tabHeight = "3rem";

const panelStyles: React.CSSProperties = {
	paddingBottom: tabHeight,
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	height: "100%",
}