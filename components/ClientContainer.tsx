"use client";
import { MetroMayhem } from "@/scripts/Game";
import { createContext, Dispatch, SetStateAction, useState } from "react";
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
import type { GameSetupData, MetroGameBoardProps } from "@/scripts/types";

export const GameContext = createContext({} as MetroGameBoardProps);

export default function ClientContainer(
	props: GameSetupData & { children: React.ReactNode }
) {
	const [playerID, setPlayerID] = useState<string>("");
	const GameClient = Client({
		game: MetroMayhem(props.zonePolygons),
		board: AppAsBoardgame,
		debug: true,
		numPlayers: 3,
		multiplayer: SocketIO({
			server: "localhost:8000",
			//persist: true,
			// storageKey: 'bgio'
		}),
	}) as React.JSXElementConstructor<GameSetupData & { playerID: string }>;
	return playerID ? (
		<GameClient playerID={"0"} {...props} />
	) : (
		<Lobby setPlayerID={setPlayerID} />
	);
	//<GameClient playerID={"0"} {...props} />
}

function AppAsBoardgame(props: MetroGameBoardProps) {
	const { children, ...rest } = props;
	return (
		<GameContext.Provider value={{ ...rest }}>
			{children}
		</GameContext.Provider>
	);
}

function Lobby({
	setPlayerID,
}: {
	setPlayerID: Dispatch<SetStateAction<string>>;
}) {
	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			teamID: "",
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
					const playerID = values.PlayerName + "_" + values.teamID;
					setPlayerID(playerID);
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
