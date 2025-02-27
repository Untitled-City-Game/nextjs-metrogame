"use client";

import { GameContext } from "@/components/ClientContainer";
import {
	Button,
	Radio,
	Text,
	Paper,
	Group,
	Center,
	Stack,
	FileInput,
	Stepper,
	Image,
	Container,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useState } from "react";
import { MetroGameBoardProps } from "../../scripts/types";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturnType } from "@mantine/form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Form = UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>

export default function ClaimPage() {
	return (
		<Suspense>
			<ClaimPanel />
		</Suspense>
	);
}

function ClaimPanel() {
	const searchParams = useSearchParams();
	const props: MetroGameBoardProps = useContext(GameContext);
	const claimRegion = searchParams.get("zone");
	const steps = [ChooseChallenge, Evidence, ConfirmClaim];
	const [step, setStep] = useState(0);
	const claimForm = useForm({
		mode: "uncontrolled",
	});
	function nextStep() {
		setStep(step + 1);
		console.log("next step");
	}
	return (
		<Center>
			<Stack>
				<h1>Claiming {props.G.zoneData[Number(claimRegion)].name}</h1>
				<Stepper active={step}>
					<Stepper.Step>
						<ChooseChallenge props={props} claimForm={claimForm} />
					</Stepper.Step>
					<Stepper.Step>Upload evidence</Stepper.Step>
					<Stepper.Step>Confirm claim</Stepper.Step>
				</Stepper>
				<Group justify="center" mt="xl">
					<Button variant="default" onClick={() => setStep(step - 1)}>
						Back
					</Button>
					<Button onClick={() => setStep(step + 1)}>Next step</Button>
				</Group>
			</Stack>
		</Center>
	);
}

function ChooseChallenge(props: MetroGameBoardProps, claimForm: Form) {
	const { allTeamsData, allPlayersData } = props.G;
	const playerData = allPlayersData[props.initialPlayerData.playerID];
	const myTeam = playerData.teamColor;
	const challengeHand = allTeamsData[myTeam]?.challengeHand;
	if (!challengeHand) {
		return <h1>No challenges available</h1>;
	}
	const challengeCards = challengeHand.map((challenge, index) => {
		return (
			<Radio.Card value={challenge.title} key={index}>
				<Paper radius="md" p="md">
					<Group wrap="nowrap" align="center">
						<Radio.Indicator size="lg" />
						<div>
							<h3>{challenge.title}</h3>
							<Text>{challenge.description}</Text>
						</div>
					</Group>
				</Paper>
			</Radio.Card>
		);
	});
	return (
		<Container>
			<Radio.Group
				label="Choose a challenge"
				key={claimForm.key("challenge")}
				{...claimForm.getInputProps("challenge")}>
				{challengeCards}
			</Radio.Group>
		</Container>
	);
}

function Evidence(props: MetroGameBoardProps, claimForm: Form) {
	return (
			<FileInput
				label="Photo evidence"
				key={claimForm.key("evidence")}
				{...claimForm.getInputProps("evidence")}
			/>
	);
}

function ConfirmClaim(props: MetroGameBoardProps, claimForm: Form, claimRegion: string) {
	return (
		<>
			<Text>Claiming {props.G.zoneData[Number(claimRegion)].name} with challenge {claimForm.values.challenge}</Text>
			<Image src={claimForm.values.evidence} alt="evidence"/>
		</>
	);
}
