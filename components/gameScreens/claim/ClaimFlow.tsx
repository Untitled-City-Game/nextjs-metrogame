"use client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/scripts/firebase";
import { Button, Group, Center, Stack, Stepper, Modal } from "@mantine/core";
import { useContext, useState } from "react";
import { MetroGameBoardProps, ZoneData } from "@/scripts/types";
import { useForm, UseFormReturnType } from "@mantine/form";
import { ClaimStateMoves } from "@/server/connect_four";
import Header from "@/components/userInterface/Header";
import { GameContext } from "@/components/Board";
import { Evidence } from "@components/gameScreens/claim/Evidence";
import { ChooseChallenge } from "@components/gameScreens/claim/ChooseChallenge";
import ConfirmClaim from "@components/gameScreens/claim/ConfirmClaim";

export type Form = UseFormReturnType<
	{
		challenge: string;
		evidence: string;
	},
	(values: { challenge: string; evidence: string }) => {
		challenge: string;
		evidence: string;
	}
>;

export default function ClaimFlow({
	open,
	close,
	claimedZone,
}: {
	open: boolean;
	close: () => void;
	claimedZone?: ZoneData;
}) {
	const props: MetroGameBoardProps = useContext(GameContext);
	const moves = props.moves as ClaimStateMoves;
	const [step, setStep] = useState(0);
	const claimForm = useForm({
		mode: "uncontrolled",
		initialValues: {
			challenge: "None",
			evidence: "",
		},
	});
	const zoneName = claimedZone?.name;
	async function claimZone(zone: number, challenge: string, evidence: File) {
		console.log("claiming zone on client", zone, challenge, evidence);
		const imageRef = ref(
			storage,
			`images/zone${zone}player${props.playerID}${Date.now()}.jpg`
		);
		try {
			const uploadTask = await uploadBytes(imageRef, evidence);
			console.log("Uploaded bytes to: ", uploadTask.metadata.fullPath);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
		const evidenceURL = await getDownloadURL(imageRef);

		moves.completeChallengeAndClaim(zone, challenge, evidenceURL);
		close();
	}

	return claimedZone ? (
		<Modal
			opened={open}
			onClose={() => {
				close();
				setStep(0);
			}}
			size="xl"
			title={`Claim ${zoneName}`}
			fullScreen
			radius={0}>
			<Header>
				<h1>Claiming {zoneName}</h1>
			</Header>
			<Center>
				<Stack pb="md">
					<Stepper
						active={step}
						styles={{
							steps: { display: "none" },
						}}>
						<Stepper.Step>
							<ChooseChallenge
								props={props}
								claimForm={claimForm}
							/>
						</Stepper.Step>
						<Stepper.Step>
							<Evidence props={props} claimForm={claimForm} />
						</Stepper.Step>
						<Stepper.Completed>
							<ConfirmClaim
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
								{step === 0 ? (
									<Button onClick={close}>Back</Button>
								) : (
									<Button onClick={() => setStep(step - 1)}>
										Back
									</Button>
								)}
							</>
						) : (
							<Button
								onClick={() =>
									claimZone(
										claimedZone.id,
										claimForm.getValues().challenge,
										claimForm.getValues()
											.evidence as unknown as File
									)
								}>
								Claim
							</Button>
						)}
					</Group>
				</Stack>
			</Center>
		</Modal>
	) : (
		"no zone selected"
	);
}
