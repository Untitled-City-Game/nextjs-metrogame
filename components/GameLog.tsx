"use client";
import { useContext } from "react";
import { GameContext } from "./ClientContainer";
import { Alert, Container, Stack, Text } from "@mantine/core";
import { LogMetadata, MetroGameBoardProps } from "@/scripts/types";
import Image from "next/image";

export default function GameLog() {
	const props: MetroGameBoardProps = useContext(GameContext);
	const dummyMessages = Array.from({ length: 15 }, () => "wheee");
	console.log("log", props.log);
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

function MetadataRenderer({ metadata }: { metadata: LogMetadata}) {
	if (!metadata){
		return <Text>No metadata</Text>
		}
		let evidenceURL = "";
		if (metadata.evidence){
			// Convert ArrayBuffer to a Blob
			const blob = new Blob([metadata.evidence]);

			// Optionally convert to an Object URL for display
			evidenceURL = URL.createObjectURL(blob);
			
		}
		return (
			<Stack>
				<Text>Date: {metadata.date.toLocaleString()}</Text>
				<Text>Team: {metadata.team}</Text>
				{metadata.challenge && <Text>Challenge: {metadata.challenge}</Text>}
				{metadata.zone && <Text>Zone: {metadata.zone}</Text>}
				{metadata.evidence && <Image src={evidenceURL} alt="evidence" width={300} height={300} />}
				</Stack>
			)
}