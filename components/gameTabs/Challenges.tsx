'use client'
import { MetroGameBoardProps } from "@/scripts/types";
import { useContext } from "react";
import { GameContext } from "@/components/ClientContainer";
import { Stack, Container, Paper, Group, Button } from "@mantine/core";
import Header from "@/components/userInterface/Header";

export default function Challenges(){
	const props: MetroGameBoardProps = useContext(GameContext);
	console.log("player data", props.initialPlayerData);
	//TODO: hoist this
	const { allTeamsData, allPlayersData } = props.G; 
	const playerData = allPlayersData[props.initialPlayerData.playerID]
	const myTeam = playerData.teamColor
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	if(!challengeHand){
		return <h1>No challenges available</h1>	
	}
	return(
		<>
		<Header>
			<h1>Challenges</h1>
		</Header>
		<Container mt="md" mb="md">
			<Stack>
				<Group>
					<Button>Discard Hand</Button>
				</Group>
				{challengeHand.map((challenge, index) => {
					return <Paper key={index} shadow="xs" withBorder p="md" radius="md">
						<h3>{ challenge.title}</h3>
						<p>{ challenge.description}</p>
					</Paper>
				})}
			</Stack>
		</Container>
		</>
	)
}