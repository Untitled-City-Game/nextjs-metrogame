"use client";
import { MetroMayhem } from "@/scripts/Game";
import { createContext, useEffect, useRef, useState } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import type { GameSetupData, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import JoinGameLobby from "./lobby/JoinGame";
import CreateGameLobby from "./lobby/CreateGame";
import { LobbyClient } from "boardgame.io/client";
import { Center, Stack } from "@mantine/core";

export const GameContext = createContext({} as MetroGameBoardProps);

export default function ClientContainer(
	props: GameSetupData & { children: React.ReactNode }
) {
	const [playerData, setPlayerData] = useState<PlayerData>();
	const GameClient = Client({
		game: MetroMayhem(props.zonePolygons),
		board: AppAsBoardgame,
		debug: true,
		numPlayers: 10,
		multiplayer: SocketIO({
			server: "localhost:8000",
		}),
	}) as React.JSXElementConstructor<GameSetupData & Record<string, unknown>>
	
	if (playerData){
		return (
			<GameClient playerData={playerData} playerID={playerData.playerID} credentials = {playerData.playerCredentials} {...props} />
		)
	}
	
	const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });
	return (
	<Center>
		<Stack>
			<h1>Untitled City Game</h1>
			<JoinGameLobby setPlayerData={setPlayerData} lobbyClient={lobbyClient} gameSetupData={props.zonePolygons}/>
		</Stack>
	</Center>
	)
}

function AppAsBoardgame(props: MetroGameBoardProps) {
	const { children, playerData, playerID, moves, ...rest } = props;
	const triedConnect = useRef(false)
	useEffect(() => {
		if(!triedConnect.current && playerID && !props.G.AllPlayersData[playerID]){
			console.log("setting up player ", playerID, " on client");
			triedConnect.current = true;
			moves.playerSetup(playerData);
		}
	})
	return (
		<GameContext.Provider value={{ ...rest, moves, playerID }}>
			<div style={{position: "fixed"}} >
				<p>Hello I am the game board</p>
				<p>Player: {playerID}</p>
			</div>
			{children}
		</GameContext.Provider>
	);
}