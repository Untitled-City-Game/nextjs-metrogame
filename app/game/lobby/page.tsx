import ChooseGame from "@/components/lobby/ChooseGame";
import JoinGameLobby from "@/components/lobby/JoinGame";
import { Button, Center, Stack } from "@mantine/core";
import { LobbyClient } from "boardgame.io/client";
import Link from "next/link";

export default async function Lobby({
	params,
  }: {
	params: Promise<{ slug: string }>
  }) {
	const matchID = (await params).slug;
	return (
		<Center>
		<Stack>
			<h1>Connect Four Lobby</h1>
			<Button component={Link} href="/game/lobby/create-game">Create New Game</Button>
			<h2>Join a game</h2>
			<ChooseGame />
		</Stack>
		</Center>
	);
}