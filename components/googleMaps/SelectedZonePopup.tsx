import { zoneData } from "@/app/types";
import { Paper, Button } from "@mantine/core";
import Link from "next/link";

export default function SelectedZonePopup ({currentZone}: {currentZone: zoneData | undefined}) {
	return (
		currentZone ? (
			<Paper style={infoZoneStyles}>
				{currentZone.name}
				<Button
					component={Link}
					href={{
						pathname: "/claim",
						query: { zone: currentZone.id },
					}}>
					Claim
				</Button>
			</Paper>
		) : null

	)
}

const infoZoneStyles: React.CSSProperties = {
	flexBasis: "20px",
	flexGrow: 1,
};