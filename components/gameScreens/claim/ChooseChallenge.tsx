"use client";
import { MetroGameBoardProps } from "@/scripts/types";
import { Radio, Paper, Group, Text, Container } from "@mantine/core";
import { Form } from "./ClaimFlow";

export function ChooseChallenge({
	props, claimForm,
}: {
	props: MetroGameBoardProps;
	claimForm: Form;
}) {
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.playerData.data.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	if (!challengeHand) {
		return <h1>No challenges available</h1>;
	}
	const challengeCards = challengeHand.map((challenge, index) => {
		return (
			<Radio.Card value={challenge.title} key={index}>
				<Paper radius="md" p="md">
					<Group wrap="nowrap" align="center">
						<Radio.Indicator size="lg" />
						<div>
							<Text fz="lg" fw="bold">{challenge.title}</Text>
							{/* <Text>{challenge.description}</Text> */}
						</div>
					</Group>
				</Paper>
			</Radio.Card>
		);
	});
	return (
		<Container>
			<Radio.Group
				label="Choose a challenge"
				key={claimForm.key("challenge")}
				{...claimForm.getInputProps("challenge")}>
				<Group>
					{challengeCards}
				</Group>
			</Radio.Group>
		</Container>
	);
}
