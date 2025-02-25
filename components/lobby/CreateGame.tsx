import { PlayerData, Color } from "@/scripts/types";
import { Radio, Paper, Group, Center, Stack, TextInput, Button, Text, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { Dispatch, SetStateAction } from "react";

export default function CreateGameLobby({
	setPlayerData, lobbyClient, gameSetupData
} : {
	setPlayerData: Dispatch<SetStateAction<PlayerData | undefined>>,
	lobbyClient : LobbyClient,
	gameSetupData : unknown
}){
	const createGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			numPlayers: 10,
			matchID: 'default',
		},
	});
	return(
		<Center>
			<form
				onSubmit={createGameForm.onSubmit(async (values) => {
					const res = await lobbyClient.createMatch('metro-mayhem', {
						numPlayers: values.numPlayers,
						setupData: gameSetupData
					})
					console.log("res" , res)
				})} >
				<Stack>
					<h2>Create Game</h2>
					<NumberInput
						label="Number of players"
						description="Set the maximum number of players who can join."
						key={createGameForm.key("numPlayers")}
						{...createGameForm.getInputProps("numPlayers")}
					/>
				</Stack>
			</form>

		</Center>
	)
}