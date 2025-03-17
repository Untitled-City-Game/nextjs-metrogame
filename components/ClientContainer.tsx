"use client";
import { ConnectFour } from "@server/connect_four";
import { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import type { ClientSetupData, GameSetupData, MapData, MetroGameBoardProps, PlayerData } from "@scripts/types";
import { Center, Stack, Text } from "@mantine/core";
import { LobbyClient } from "boardgame.io/client";
import Board from "@components/Board";



export default function ClientContainer(
	props: { children: React.ReactNode }
) {
	console.log("rendering client container")
	const [playerData, setPlayerData] = useState<PlayerData>();
	const [gameSetupData, setGameSetupData] = useState<GameSetupData>();
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.NEXT_PUBLIC_GAME_SERVER }), []);
	//Check if session is already part of a game
	useEffect(() => {
		if (!playerData){
			const sessionPlayerData = sessionStorage.getItem("sessionPlayerData");
			if (sessionPlayerData){
				const loadedPlayerData = JSON.parse(sessionPlayerData) as PlayerData;
				console.log("setting player data from session storage", sessionPlayerData);
				setPlayerData(loadedPlayerData);
			}
		}
	}, [playerData]);
	
	//get map data if needed
	useEffect(() => {
		if(!gameSetupData && playerData?.matchID){
			lobbyClient.getMatch("connect-four", playerData.matchID).then(async res => {
				const cityName = res.setupData.city;
				console.log("city", cityName);
				const mapDataRes = await fetch(process.env.NEXT_PUBLIC_GAME_SERVER + "/map-data/" + cityName)
				const mapDataResJSON = await mapDataRes.json() as MapData;
				setGameSetupData({
					...mapDataResJSON,
					city: cityName
				});
				}
			);
		}
	}, [gameSetupData, lobbyClient, playerData]);
	
	//Render game
	if (playerData && gameSetupData){
		console.log("rendering game client")
		const GameClient = Client({
			game: ConnectFour,
			board: Board,
			debug: {
				collapseOnLoad: true,
			},
			multiplayer: SocketIO({
				server: process.env.NEXT_PUBLIC_GAME_SERVER,
			}),
		}) as React.JSXElementConstructor<ClientSetupData>
		return (
			<GameClient matchID={playerData.matchID || "default"} playerData={{data: playerData, setter: setPlayerData}} playerID={playerData.playerID} credentials = {playerData.playerCredentials} {...gameSetupData} {...props} />
		)
	} else {
		return <Text>Game loading...</Text>
	}
}
