'use client'
import { MetroGameBoardProps } from "@/scripts/types";
import { Center, Stack, Button, Container } from "@mantine/core";
import { useContext } from "react";
import { GameContext } from "../Board";

export default function Waiting() {
	console.log("rendering waiting page")
	const props: MetroGameBoardProps = useContext(GameContext);
	const playerData = props.G.allPlayersData
	return (
		<Center>
			<Stack>
				<h1>Untitled City Game</h1>
				<h2>Your game is waiting to start</h2>
				<p>Players can still join.</p>
				{Object.values(playerData).map((player, index) => {
					return <Container key={index}>{player.name}, {player.teamColor} team</Container>
				})}
				<Button onClick={() => {
					props.moves.startGame()
				}
				}>Start the Game</Button>
			</Stack>
		</Center>
	)
}
