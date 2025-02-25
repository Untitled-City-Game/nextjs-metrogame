'use client'
import { GameContext } from "@/components/ClientContainer";
import GameLog from "@/components/GameLog";
import MapBoard from "@/components/googleMaps/mapAsBoardgame";
import { MetroGameBoardProps } from "@/scripts/types";
import { Tabs, TabsTab, TabsList, TabsPanel, Container, Stack, Center, Text, Button } from "@mantine/core";
import { useContext } from "react";
import { useRouter } from 'next/navigation'

export default function Home() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const playerData = props.G.AllPlayersData
	const router = useRouter()
	if(props.G.active) {
		router.push('/game');
	}
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
					router.push("/game")
				}
				}>Start the Game</Button>
			</Stack>
		</Center>
	)
}
