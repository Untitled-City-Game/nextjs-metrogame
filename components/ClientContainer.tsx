"use client";
import { MetroMayhem } from "@/scripts/Game";
import { createContext, useEffect, useRef, useState } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import type { ClientSetupData, GameSetupData, MetroGameBoardProps, PlayerData } from "@/scripts/types";
import JoinGameLobby from "./lobby/JoinGame";
import { LobbyClient } from "boardgame.io/client";
import { Center, Stack, Text } from "@mantine/core";

export const GameContext = createContext({} as MetroGameBoardProps);

export default function ClientContainer(
	props: GameSetupData & { children: React.ReactNode }
) {
	const [initialPlayerData, setPlayerData] = useState<PlayerData>();
	const [busy, setBusy] = useState(true);
	
	useEffect(() => {
		const sessionPlayerData = sessionStorage.getItem("sessionPlayerData");
		if (sessionPlayerData){
			const loadedPlayerData = JSON.parse(sessionPlayerData) as PlayerData;
			console.log("setting player data from session storage", sessionPlayerData);
			setPlayerData(loadedPlayerData);
		}
		setBusy(false);
	}, []);

	const GameClient = Client({
		game: MetroMayhem(props.zonePolygons),
		board: AppAsBoardgame,
		debug: {
			collapseOnLoad: true,
		},
		numPlayers: 10,
		multiplayer: SocketIO({
			server: "localhost:8000",
		}),
	}) as React.JSXElementConstructor<ClientSetupData>
	
	if (busy){
		return (
			<Center>
				<Stack>
					<h1>Untitled City Game</h1>
					<p>Loading...</p>
				</Stack>
			</Center>
		)
	}

	if (initialPlayerData){
		return (
			<GameClient initialPlayerData={initialPlayerData} playerID={initialPlayerData.playerID} credentials = {initialPlayerData.playerCredentials} {...props} />
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
	const { children, ...rest } = props;
	const { moves, playerID, initialPlayerData } = props;
	sessionStorage.setItem("sessionPlayerData", JSON.stringify(initialPlayerData));
	const triedConnect = useRef(false)
	useEffect(() => {
		if(!triedConnect.current && playerID && !props.G.allPlayersData[playerID]){
			console.log("setting up player ", playerID, initialPlayerData, " on client");
			triedConnect.current = true;
			moves.playerSetup(initialPlayerData);
		}
	})
	console.log("rendering app as boardgame", playerID, props.G.allPlayersData);
	if(playerID &&!props.G.allPlayersData[playerID]){
		return <Text>Loading...</Text>
	}
	return (
		<GameContext.Provider value={{ ...rest }}>
			{children}
		</GameContext.Provider>
	);
}