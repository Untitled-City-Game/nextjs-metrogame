'use client'
import { Radio, Paper, Group, Text, Button, Center, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LobbyAPI } from "boardgame.io";
import { LobbyClient } from "boardgame.io/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

export default function ChooseGame() {
	const lobbyClient = useMemo(() => new LobbyClient({ server: process.env.NEXT_PUBLIC_GAME_SERVER }), []);

	//Get all matches
	const [matches, setMatches] = useState<LobbyAPI.Match[]>([]);
	const router = useRouter();

	useEffect(() => {
		lobbyClient.listMatches('connect-four').then(res => {
			console.log("matches", res.matches);
			const activeMatches = res.matches.filter(match => !match.gameover);
			setMatches(activeMatches);
		}
		);
	},
	[lobbyClient])

	//Setup mantine form
	const joinGameForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			MatchID: "",
		},
	});

	//Render radio cards for matches
	const matchCards = matches.map((match) => (
		<Radio.Card radius="md" value={match.matchID} key={match.matchID}>
			<Paper radius="md" p="md">
			<Group wrap="nowrap" align="center">
				<Radio.Indicator size="lg" color="orange" />
				<div>
					<Text>City: {match.setupData.city}</Text>
					<Text>Gameover: {match.setupData.gameover}</Text>
					<Text>
						{ match.players?.length ? `Current players: ${match.players.map(player => player.name).filter(name => name).join(", ")}` : 'Empty' }
					</Text>
				</div>
			</Group>
			</Paper>
		</Radio.Card>
	));

	//Handle radio card selection
	const handleJoinGame = async (values : Record<string, string>) => {
		console.log(values)
		router.push('/game/lobby/join-match/' + values.MatchID);
	}

	return (
		<Center>
			<form
				onSubmit={joinGameForm.onSubmit(handleJoinGame)}>
					<Stack>
						<h2>Choose a Match</h2>
						<Radio.Group
							label="Choose a match"
							key={joinGameForm.key("MatchID")}
							{...joinGameForm.getInputProps("MatchID")}
						>
						{matchCards}
						</Radio.Group>
						<Button type="submit">Join</Button>
					</Stack>
				</form>
		</Center>
		);
}