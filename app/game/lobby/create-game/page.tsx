import CreateGame from "@/components/lobby/CreateGame";
import { Button, Center, Stack } from "@mantine/core";

export default function CreateGamePage() {
	return (
		<Center>
		<Stack>
			<h2>Create a new Game</h2>
			<CreateGame />
		</Stack>
		</Center>
	);
}