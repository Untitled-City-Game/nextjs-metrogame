import { ZoneData } from "@/scripts/types";
import { Paper, Button, Container, Center } from "@mantine/core";
import ClaimFlow from "@components/gameScreens/claim/ClaimFlow";
import { useDisclosure } from "@mantine/hooks";

export default function SelectedZonePopup({
	currentZone,
}: {
	currentZone: ZoneData | undefined;
}) {
	const [opened, { open, close }] = useDisclosure(false);

	// function gotoClaimPage() {
	// 	if (currentZone) {
	// 		const zone = currentZone.name.replace(" ", "-");
	// 		window.location.href = `/game/match/claim?zone=${zone}`;
	// 	}
	// }
	return (
		<>
			<Center
				style={infoZoneStyles}
				display={currentZone ? "initial" : "none"}>
				<Container>
					<Paper>
						<Button onClick={open}>
							Claim {currentZone?.name}
						</Button>
					</Paper>
				</Container>
			</Center>
			<ClaimFlow 
			open={opened}
			close={close}
			claimedZone={currentZone} 
			/>
		</>
	);
}

const infoZoneStyles: React.CSSProperties = {
	flexBasis: "20px",
	flexGrow: 1,
};
