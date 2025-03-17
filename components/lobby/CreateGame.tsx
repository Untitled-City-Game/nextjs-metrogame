'use client'
import { GameSetupData, PlayerData, MapData } from "@/scripts/types";
import { Button, Center, Group, NumberInput, Paper, Radio, Select, Stack, Text, TextInput } from "@mantine/core";
import { hasLength, useForm, UseFormReturnType } from "@mantine/form";
import { LobbyClient } from "boardgame.io/client";
import { useContext, useMemo } from "react";
import { cities, numPlayers } from "@/scripts/consts";
import { useRouter } from "next/navigation";
import { joinMatch } from '@/scripts/joinMatch';

export default function CreateGame() {
	
	const router = useRouter();

	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.NEXT_PUBLIC_GAME_SERVER }), []);
	
	const teamOptions = [
		{ label: "Red", value: "red"},
		{ label: "Blue", value: "blue" },
	];

	const teamCards = teamOptions.map((item) => (
		<Radio.Card radius="md" value={item.value} key={item.value}>
			<Paper radius="md" p="md">
			<Group wrap="nowrap" align="center">
				<Radio.Indicator color={item.label} size="lg" />
				<div>
					<Text>{item.label}</Text>
				</div>
			</Group>
			</Paper>
		</Radio.Card>
	));

	//Setup mantine form
	const createGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			PlayerName: "",
			city: "melbourne",
			teamID: "blue",
			numPlayers: numPlayers,
		},
		validate : {
			PlayerName: hasLength({min: 2, max: 20}, "Player name must be between 2 and 20 characters"),
			city: city => cities.includes(city) ? null : "Invalid city",
			teamID: teamID => teamOptions.map(option => option.value).includes(teamID) ? null: "Invalid team",
			numPlayers: numPlayers => numPlayers > 2 && numPlayers < 100 ? null: "Invalid number of players"
		}
	});

	type FormValues = { 
		PlayerName: string; 
		city: string; 
		teamID: string; 
		numPlayers: number; 
	};
	const handleCreateGame = async (values : FormValues) => {
		console.log("creating game", values);
		//get map data
		const mapDataRes = await fetch(process.env.NEXT_PUBLIC_GAME_SERVER + "/map-data/" + values.city)
		const mapDataResJSON = await mapDataRes.json();

		//handle errors
		if(mapDataResJSON.error){
			console.log("error fetching map data", mapDataResJSON.error);
			return;
		}
		if(!mapDataResJSON){
			console.log("no map data found for city", values.city);
			return;
		}

		//match setup
		const setupData : GameSetupData = {
			city: values.city,
			...mapDataResJSON as MapData
		}

		//create match
		const { matchID } = await lobbyClient.createMatch('connect-four', {
			numPlayers: Number(values.numPlayers),
			setupData: setupData
		});

		//join match
		const playerData: PlayerData = await joinMatch(lobbyClient, matchID, values.PlayerName, values.teamID);
		sessionStorage.setItem("sessionPlayerData", JSON.stringify(playerData));
		router.push('/game/match');
	}

	return (
		<Center>
			<form
				onSubmit={createGameForm.onSubmit(handleCreateGame)}>
				<Stack>
					<h2>Create a Game</h2>
					<Select
						label="Choose a city"
						placeholder="melbourne"
						data={cities}
						key={createGameForm.key("city")}
						{...createGameForm.getInputProps("city")}
					/>
					<NumberInput
						label="Max players"
						defaultValue={numPlayers}
						max = {100}
						min={2}
						key={createGameForm.key("numPlayers")}
						{...createGameForm.getInputProps("numPlayers")}
					/>
					<TextInput
						label="Your name"
						key={createGameForm.key("PlayerName")}
						{...createGameForm.getInputProps("PlayerName")}
					/>
					<Radio.Group 
						label="Choose a team" 
						key={createGameForm.key("teamID")}
						{...createGameForm.getInputProps("teamID")}
					>
						<Stack pt="md" gap="xs">
							{teamCards}
						</Stack>
					</Radio.Group>
					<Button type="submit">Create and Join</Button>
				</Stack>
			</form>
		</Center>
	);
	
}


