"use client";
import { MetroMayhem } from "@server/connect_four";
import { createContext, useEffect, useRef, useState } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import type { ClientSetupData, GameSetupData, MetroGameBoardProps, PlayerData } from "@scripts/types";
import JoinGameLobby from "@/components/lobby/JoinGame";
import { LobbyClient } from "boardgame.io/client";
import { Center, Stack, Text } from "@mantine/core";
import GameOver from "@/components/lobby/GameOver";
export const GameContext = createContext({} as MetroGameBoardProps);

export default function ClientContainer(
	props: { children: React.ReactNode }
) {
	const [initialPlayerData, setPlayerData] = useState<PlayerData>();
	const [busy, setBusy] = useState(true);
	const [gameSetupData, setGameSetupData] = useState<GameSetupData>();

	useEffect(() => {
		const sessionPlayerData = sessionStorage.getItem("sessionPlayerData");
		if (sessionPlayerData){
			const loadedPlayerData = JSON.parse(sessionPlayerData) as PlayerData;
			console.log("setting player data from session storage", sessionPlayerData);
			setPlayerData(loadedPlayerData);
		}
		setBusy(false);
	}, []);

	useEffect(() => {
		async function fetchData(){
			if (gameSetupData === undefined){
				const res = await fetch(process.env.NEXT_PUBLIC_GAME_SERVER + "/map-data")
				res.json().then(data => {
					setGameSetupData(data);
				});
				return;
			}
		}
		fetchData();
	}, [gameSetupData]);
			
	if (busy || !gameSetupData){
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
		const GameClient = Client({
			game: MetroMayhem(gameSetupData.zonePolygons),
			board: AppAsBoardgame,
			debug: {
				collapseOnLoad: true,
			},
			multiplayer: SocketIO({
				server: process.env.NEXT_PUBLIC_GAME_SERVER,
			}),
		}) as React.JSXElementConstructor<ClientSetupData>
		return (
			<GameClient matchID={initialPlayerData.matchID || "default"} playerData={{data: initialPlayerData, setter: setPlayerData}} playerID={initialPlayerData.playerID} credentials = {initialPlayerData.playerCredentials} {...gameSetupData} {...props} />
		)
	}
	
	const lobbyClient = new LobbyClient({ server: process.env.NEXT_PUBLIC_GAME_SERVER });
	return (
	<Center>
		<Stack>
			<h1>Untitled City Game</h1>
			<JoinGameLobby setPlayerData={setPlayerData} lobbyClient={lobbyClient} gameSetupData={gameSetupData.zonePolygons}/>
		</Stack>
	</Center>
	)
}

function AppAsBoardgame(props: MetroGameBoardProps) {
	const { children, ...rest } = props;
	const { moves, playerID} = props;
	const initialPlayerData = props.playerData.data;
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
	if(props.G.gameOver){
		return <GameOver setter={props.playerData.setter}/>
	}
	return (
		<GameContext.Provider value={{ ...rest }}>
			<p>Player ID: {playerID}</p>
			<p>Team: {playerID && props.G.allPlayersData[playerID].teamColor}</p>
			<p>Game state: {props.G.active ? "active" : "inactive"}</p>
			<p>Gameover: {props.G.gameOver ? "true" : "false"}</p>
			{children}
		</GameContext.Provider>
	);
}