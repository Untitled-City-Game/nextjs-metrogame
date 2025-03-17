import { MetroGameBoardProps } from "@/scripts/types";
import { useRef, useEffect, createContext, useState } from "react";
import { Text } from "@mantine/core";
import GameOver from "./lobby/GameOver";
export const GameContext = createContext({} as MetroGameBoardProps);
import { usePathname, useRouter } from "next/navigation";
import Waiting from "@components/gameScreens/Waiting";

export default function Board(props: MetroGameBoardProps) {
	console.log("attempting to render board");
	const { children, ...rest } = props;
	const { moves, playerID } = props;
	const playerData = props.playerData.data;
	useEffect(() => {
		if (playerID && !props.G.allPlayersData[playerID]) {
			console.log(
				"setting up player ",
				playerID,
				playerData,
				"on client"
			);
			moves.playerSetup(playerData);
		}
	}, [playerID, moves, playerData, props.G.allPlayersData]);

	if (props.G.gameOver) {
		return <GameOver />;
	}

	if (!props.G.active) {
		return (
			<GameContext.Provider value={{ ...rest }}>
				<Waiting />
			</GameContext.Provider>
		);
	}

	if (playerID && !props.G.allPlayersData[playerID]) {
		return <Text>Loading...</Text>;
	}

	console.log("rendering board with playerID", playerID);
	return (
		<GameContext.Provider value={{ ...rest }}>
			<p>Player ID: {playerID}</p>
			<p>
				Team: {playerID && props.G.allPlayersData[playerID].teamColor}
			</p>
			<p>Game state: {props.G.active ? "active" : "inactive"}</p>
			<p>Gameover: {props.G.gameOver ? "true" : "false"}</p>
			{children}
		</GameContext.Provider>
	);
}
