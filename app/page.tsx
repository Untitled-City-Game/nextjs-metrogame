'use client'
import { GameContext } from "@/components/ClientContainer";
import GameLog from "@/components/GameLog";
import MapBoard from "@/components/googleMaps/mapAsBoardgame";
import { MetroGameBoardProps } from "@/scripts/types";
import { Tabs, TabsTab, TabsList, TabsPanel, Container, Stack, Center, Text, Button } from "@mantine/core";
import { useContext } from "react";
import { redirect } from 'next/navigation'

export default function Home() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const playerData = props.G.allPlayersData
	if(props.G.active) {
		redirect('/game')
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
				}
				}>Start the Game</Button>
			</Stack>
		</Center>
	)
}
