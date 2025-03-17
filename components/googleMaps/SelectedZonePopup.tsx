import { zoneData } from "@/scripts/types";
import { Paper, Button, Container, Center } from "@mantine/core";
import Link from "next/link";

export default function SelectedZonePopup ({currentZone}: {currentZone: zoneData | undefined}) {
	return (
		currentZone ? (
			<Center style={infoZoneStyles}>
				<Container>
			<Paper >
				<Button
					component={Link}
					href={{
						pathname: "/game/match/claim",
						query: { zone: currentZone.id },
					}}>
					Claim {currentZone.name}
				</Button>
			</Paper>
			</Container>
			</Center>
		) : null

	)
}

const infoZoneStyles: React.CSSProperties = {
	flexBasis: "20px",
	flexGrow: 1,
};