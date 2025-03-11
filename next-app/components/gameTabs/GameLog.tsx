"use client";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../ClientContainer";
import { Alert, Stack, Text, Group, Button, Box } from "@mantine/core";
import { GameState, LogMetadata, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import Header from "../userInterface/Header";
import { ClaimStateMoves } from "@/server/connect_four";
import { LogEntry } from "boardgame.io";

export default function GameLog() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const playerData = props.playerData.data;
	function handleEndGame(){
		console.log("ending game");
		moves.endGame();
		props.playerData.setter(undefined);
	}
	return (
		<>
			<Header>
				<h1>Game Log</h1>
				<p>Game will end at GAME END TIME</p>
				<Group>
					<Button variant="outline">Pause Game</Button>
					<Button onClick={handleEndGame}>End Game</Button>
				</Group>
			</Header>
			<Box m="md">
				<Stack align="flex-start">
					{props.log
						.map((entry, index) => (
							<MessageBox key={index} entry={entry} gameData={props.G} playerData={playerData}>
								<Text>
									Move: {entry.action.payload.type}
								</Text>
							</MessageBox>
						))
						.toReversed()}
				</Stack>
			</Box>
		</>
	);
}

function MessageBox({ children, entry, gameData, playerData }: { children: React.ReactNode, entry: LogEntry, gameData: GameState, playerData: PlayerData }) {
	const [timestamp, setTimestamp] = useState("");
	const metadata = entry.metadata ? entry.metadata as LogMetadata : undefined;
	useEffect(() => {
		if(metadata && metadata.date){
			const date = new Date(metadata.date);
			setTimestamp(date.toLocaleTimeString());
			return;
		}
	}, [metadata]);
	const senderData = gameData.allPlayersData[entry.action.payload.playerID];
	return (
		<Alert maw="max-content" miw="40%" title={senderData.name} color={senderData.teamColor} ml={senderData.playerID === playerData.playerID ? "auto" : "0"}>
			<Text fs="italic">{senderData.teamColor} team</Text>
			{children}
			<Text>{timestamp}</Text>
		</Alert>
	);
}

// function MetadataRenderer({ metadata }: { metadata: LogMetadata}) {
// 	if (!metadata){
// 		return <Text>No metadata</Text>
// 		}
// 		return (
// 			<Stack>
// 				<Text>Date: {metadata.date.toLocaleString()}</Text>
// 				<Text>Team: {metadata.team}</Text>
// 				{metadata.challenge && <Text>Challenge: {metadata.challenge}</Text>}
// 				{metadata.zone && <Text>Zone: {metadata.zone}</Text>}
// 				{metadata.evidence && <Image src={metadata.evidence} alt="evidence" w={300} h={300} />}
// 				</Stack>
// 			)
// }