"use client";

import { GameContext } from "@/components/ClientContainer";
import { Button } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext } from "react";
import { GameData } from "../../scripts/types";
import { useRouter } from "next/navigation";

export default function ClaimPage() {
	return (
		<Suspense>
			<ClaimPanel />
		</Suspense>
	);
}

function ClaimPanel() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const props: GameData = useContext(GameContext);
	const claimRegion = searchParams.get("zone");
	return (
		<>
			<h1>Claim {props.G.zones[Number(claimRegion)].name}</h1>
			<Button
				onClick={() => {
					props.moves.claimZone(claimRegion, "team1");
					router.push("/game");
				}}>
				Claim
			</Button>
		</>
	);
}
