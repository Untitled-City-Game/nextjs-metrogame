"use client";
import { useContext } from "react";
import { GameContext } from "./ClientContainer";
import { Alert, Container, Stack, Text } from "@mantine/core";
import { MetroGameBoardProps } from "@/scripts/types";

export default function GameLog() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const dummyMessages = Array.from({ length: 15 }, () => "wheee");
	return (
		<div>
			<Container>
				<h1>Game Log</h1>
				<Stack>
					<Text>player props:</Text>
					{props.log
						.map((entry, index) => (
							<MessageBox key={index}>
								<Text>
									Team: {entry.action.payload.playerID}
								</Text>
								<Text>
									payload type: {entry.action.payload.type}
								</Text>
								<Text>
									payload args: {entry.action.payload.args}
								</Text>
								<Text>action type: {entry.action.type}</Text>
								<Text>metadata: {entry.metadata}</Text>
								<Text>stateid: {entry._stateID}</Text>
								<Text>turn: {entry.turn}</Text>
							</MessageBox>
						))
						.toReversed()}
					{/* Some dummy messages for testing */}
					{dummyMessages.map((message, index) => (
						<MessageBox key={index}>
							<Text>{message}</Text>
						</MessageBox>
					))}
				</Stack>
			</Container>
		</div>
	);
}

function MessageBox({ children }: { children: React.ReactNode }) {
	return (
		<Alert maw="max-content" miw="40%" title="Username">
			<Text>Red team</Text>
			{children}
		</Alert>
	);
}
