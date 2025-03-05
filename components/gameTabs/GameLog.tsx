"use client";
import { useContext } from "react";
import { GameContext } from "../ClientContainer";
import { Alert, Container, Stack, Text, Image } from "@mantine/core";
import { LogMetadata, MetroGameBoardProps } from "@/scripts/types";
import Header from "../userInterface/Header";

export default function GameLog() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const dummyMessages = Array.from({ length: 15 }, () => "wheee");
	console.log("log", props.log);
	return (
		<>
			<Header>
				<h1>Game Log</h1>
			</Header>
			<Container mt="md" mb="md">
				<Stack>
					{props.log
						.map((entry, index) => (
							<MessageBox key={index}>
								<Text>
									Team: {entry.action.payload.playerID}
								</Text>
								<Text>
									payload type: {entry.action.payload.type}
								</Text>
								<Text>action type: {entry.action.type}</Text>
								<Text>metadata: {JSON.stringify(entry.metadata)}</Text>
								<MetadataRenderer metadata={entry.metadata} />
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
		</>
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

function MetadataRenderer({ metadata }: { metadata: LogMetadata}) {
	if (!metadata){
		return <Text>No metadata</Text>
		}
		return (
			<Stack>
				<Text>Date: {metadata.date.toLocaleString()}</Text>
				<Text>Team: {metadata.team}</Text>
				{metadata.challenge && <Text>Challenge: {metadata.challenge}</Text>}
				{metadata.zone && <Text>Zone: {metadata.zone}</Text>}
				{metadata.evidence && <Image src={metadata.evidence} alt="evidence" w={300} h={300} />}
				</Stack>
			)
}