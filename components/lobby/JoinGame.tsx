import { PlayerData, Color } from "@/scripts/types";
import { Radio, Paper, Group, Center, Stack, TextInput, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function JoinGameLobby({
	setPlayerData, lobbyClient, gameSetupData
} : {
	setPlayerData: Dispatch<SetStateAction<PlayerData | undefined>>,
	lobbyClient : LobbyClient,
	gameSetupData : unknown
}) {
	const [matchData, setMatchData] = useState<LobbyAPI.Match>()
	const [teamMembers, setTeamMembers] = useState<Record<string, string[]>>()
	useEffect(() => {
		console.log('saving')
		lobbyClient.listMatches('metro-mayhem').then(res => {
			setMatchData(res.matches[0])
			setTeamMembers(sortTeamPlayers(res.matches[0]))
		}
		);
	}, [lobbyClient])
	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			teamID: "blue",
		},
	});
	const teamOptions = [
		{ label: "Red", value: "red", members: teamMembers?.red},
		{ label: "Blue", value: "blue", members: teamMembers?.blue },
	];
	const teamCards = teamOptions.map((item) => (
		<Radio.Card radius="md" value={item.value} key={item.value}>
			<Paper radius="md" p="md">
			<Group wrap="nowrap" align="center">
				<Radio.Indicator color={item.label} size="lg" />
				<div>
					<Text>{item.label}</Text>
					<Text>
						{ item.members?.length ? `Current members: ${item.members.join(" ")}` : 'Empty' }
					</Text>
				</div>
			</Group>
			</Paper>
		</Radio.Card>
	));

	return (
		<Center>
			<form
				onSubmit={joinGameForm.onSubmit(async (values) => {
					const { matches } = await lobbyClient.listMatches('metro-mayhem');
					let matchID = 'default';
					if(matches.length == 0){
						const res = await lobbyClient.createMatch('metro-mayhem', {
							numPlayers: 20,
							setupData: gameSetupData
						})
						matchID = res.matchID;
					} else {
						matchID = matches[0].matchID;
					}
					const res = await lobbyClient.joinMatch(
						'metro-mayhem',
						matchID,
						{
							playerName: values.PlayerName,
							data: {
								teamColor: values.teamID
							}
						}
					)
					console.log("res" , res)
					const playerData : PlayerData = {
						name: values.PlayerName, 
						playerID: res.playerID as `${number}`, 
						playerCredentials: res.playerCredentials,
						teamColor: values.teamID as Color,
					};
					setPlayerData(playerData);
				})}>
				<Stack>
					<h2>Join/Create a Game</h2>
					<TextInput
						label="Your name"
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


function sortTeamPlayers(matchData : LobbyAPI.Match | undefined){
	if(!matchData ){
		return undefined;
	}
	const teamsAndPlayers : Record<string, string[]>= {
		red: [],
		blue: []
	}
	matchData.players.forEach(player => {
		console.log('playerdata', player)
		if(player.name && player.data && typeof player.data.teamColor === 'string'){
			if (player.data.teamColor in teamsAndPlayers){
				teamsAndPlayers[player.data.teamColor].push(player.name)
			} else {
				teamsAndPlayers[player.data.teamColor] = [player.name]
			}
		}
	})
	return teamsAndPlayers;
}