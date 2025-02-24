"use client";
import { MetroMayhem } from "@/scripts/Game";
import { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import {
	TextInput,
	Button,
	Stack,
	Center,
	Group,
	Radio,
	Text,
	Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Color, GameSetupData, MetroGameBoardProps, PlayerData } from "@/scripts/types";

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
			//persist: true,
			// storageKey: 'bgio'
		}),
	}) as React.JSXElementConstructor<GameSetupData & { playerID: string } & {playerData : PlayerData}>;
	return (
	playerData? <GameClient playerData={playerData} playerID={playerData.playerID} {...props} /> : <Lobby setPlayerData={setPlayerData} />
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
			<div>Hello I am the game board</div>
			<div>Player: {playerID}</div>
			{children}
		</GameContext.Provider>
	);
}

function Lobby({
	setPlayerData,
}: {
	setPlayerData: Dispatch<SetStateAction<PlayerData | undefined>>;
}) {
	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			teamID: "blue",
		},
	});
	const teamOptions = [
		{ label: "Red", value: "red", members: ["Leo", "Tristan"] },
		{ label: "Blue", value: "blue", members: ["Kyle", "Jules"] },
	];
	const teamCards = teamOptions.map((item) => (
		<Radio.Card radius="md" value={item.label} key={item.value}>
			<Paper radius="md" p="md">
			<Group wrap="nowrap" align="center">
				<Radio.Indicator color={item.label} size="lg" />
				<div>
					<Text>{item.label}</Text>
					<Text>Current members: {item.members.join(" ")}</Text>
				</div>
			</Group>
			</Paper>
		</Radio.Card>
	));

	return (
		<Center>
			<form
				onSubmit={joinGameForm.onSubmit((values) => {
					const playerData : PlayerData = {name: values.PlayerName, playerID: values.PlayerName as `${number}`, teamColor: values.teamID as Color};
					setPlayerData(playerData);
				})}>
				<Stack>
					<h1>Untitled City Game</h1>
					<TextInput
						label="Name"
						key={joinGameForm.key("PlayerName")}
						{...joinGameForm.getInputProps("PlayerName")}
					/>
					<Radio.Group label="Choose a team" key={joinGameForm.key("teamID")}
											{...joinGameForm.getInputProps("teamID")}
					>
						<Stack pt="md" gap="xs">
							{teamCards}
						</Stack>
					</Radio.Group>
					<Button type="submit">Join Game</Button>
				</Stack>
			</form>
		</Center>
	);
}
