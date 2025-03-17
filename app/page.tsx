import { Button, Center, Stack } from "@mantine/core";
import Link from "next/link";

export default function Home() {
	return (
		<Center>
			<Stack>
			<div>
				<h1>Untitled Metro Game</h1>
				<Button component={Link} href="/game/lobby">Join Game</Button>
			</div>
			</Stack>
		</Center>
	)
}