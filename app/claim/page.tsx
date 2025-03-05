"use client";
import { GameContext } from "@/components/ClientContainer";
import { getDownloadURL, ref, uploadBytes} from "firebase/storage";
import { storage } from "@/scripts/firebase";
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
	Container,
	Image,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useState } from "react";
import { MetroGameBoardProps } from "../../scripts/types";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturnType } from "@mantine/form";
import { ClaimStateMoves } from "@/scripts/Game";
import Header from "@/components/userInterface/Header";
import Link from "next/link";


type Form = UseFormReturnType<
	{
		challenge: string;
		evidence: string;
	},
	(values: { challenge: string; evidence: string; }) => {
		challenge: string;
		evidence: string;
	}
>;

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
	const moves = props.moves as ClaimStateMoves;
	const claimedZone = searchParams.get("zone");
	const [step, setStep] = useState(0);
	const router = useRouter();
	const claimForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			challenge: "None",
			evidence: "",
		},
	});
	if (!claimedZone) {
		return <h1>No zone selected</h1>;
	}
	async function claimZone(zone : string, challenge : string, evidence : File) {
		console.log("claiming zone on client", zone, challenge, evidence);
		const imageRef = ref(storage, `images/zone${zone}player${props.playerID}${Date.now()}.jpg`);
		try {
            const uploadTask = await uploadBytes(imageRef, evidence);
            console.log("Uploaded bytes to: ", uploadTask.metadata.fullPath);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
		const evidenceURL = await getDownloadURL(imageRef)

		moves.completeChallengeAndClaim(Number(zone), challenge, evidenceURL);
		router.push("/game");
	}
	return (
		<>
		<Header>
			<h1>Claiming {props.G.zoneData[Number(claimedZone)].name}</h1>
		</Header>
		<Center>
			<Stack pb="md">
				<Stepper active={step}
					styles={{
						steps : {display: 'none'}
					}}
				>
					<Stepper.Step>
						<ChooseChallenge props={props} claimForm={claimForm} />
					</Stepper.Step>
					<Stepper.Step>
						<Evidence props={props} claimForm={claimForm} />
					</Stepper.Step>
					<Stepper.Completed>
						<ConfirmClaim
							props={props}
							claimForm={claimForm}
							claimedZone={claimedZone}
						/>
					</Stepper.Completed>
				</Stepper>
				<Group justify="center" mt="xl">
					{step !== 2 ? (
						<>
							<Button onClick={() => setStep(step + 1)}>
								Next step
							</Button>
							{step === 0 ? 
								<Button component={Link} href="/game">Back</Button>: <Button variant="default"onClick={() => setStep(step - 1)}>Back</Button>
							}
						</>
					): <Button onClick={() => claimZone(claimedZone, claimForm.getValues().challenge, claimForm.getValues().evidence as unknown as File)}>Claim</Button>
					}
				</Group>
			</Stack>
		</Center>
		</>
	);
}

function ChooseChallenge({
	props,
	claimForm,
}: {
	props: MetroGameBoardProps;
	claimForm: Form;
}) {
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
							<Text fz="lg" fw="bold">{challenge.title}</Text>
							{/* <Text>{challenge.description}</Text> */}
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
				<Group>
				{challengeCards}
				</Group>
			</Radio.Group>
		</Container>
	);
}

function Evidence({
	claimForm,
}: {
	props: MetroGameBoardProps;
	claimForm: Form;
}) {
	return (
		<FileInput
			label="Photo evidence"
			key={claimForm.key("evidence")}
			{...claimForm.getInputProps("evidence")}
		/>
	);
}

function ConfirmClaim({
	props,
	claimForm,
	claimedZone: claimZone,
}: {
	props: MetroGameBoardProps;
	claimForm: Form;
	claimedZone: string;
}) {
	return (
		<Container>
			<Text>
				Claiming {props.G.zoneData[Number(claimZone)].name} with
				challenge {claimForm.getValues().challenge}
			</Text>
			{claimForm.getValues().evidence && (
			<Image
				h={300}
				src={URL.createObjectURL(
					claimForm.getValues().evidence as unknown as File
				)}
				alt="evidence"
			/>
			)}
		</Container>
	);
}
