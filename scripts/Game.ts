import { GameState, PolyData, zoneStatus } from "@/app/types";
import type { FnContext, Game } from "boardgame.io";

// function functionMove({G, ctx, playerID}: FnContext<GameState>, claimId: number, teamID: zoneNames, ...args: unknown[]){
// 	G.zones[claimId] = teamID;
// 	console.log(playerID);
// 	return { ...G };
// }

function claimZone(
	{ G }: { G: GameState },
	zoneID: number,
	zoneStatus: zoneStatus
) {
	const claimedZone = G.zones[zoneID];
	claimedZone.status = zoneStatus;
	claimedZone.color = zoneStatus === "team1" ? "red" : "blue";
}

function startGame({ events }: FnContext<GameState>) {
	events.setActivePlayers({ all: "claim" });
}

export const MetroMayhem = (internalSetupData: PolyData[]): Game<GameState> => {
	return {
		name: "metro-mayhem",

		//set up game board using map json info
		setup: () => createBoardFromMapJson(internalSetupData),
		moves: {
			claimZone,
			startGame,
		},
		turn: {
			stages: {
				claim: {
					moves: {
						claimZone
					},
				},
			},
		},
	};

	function createBoardFromMapJson(internalSetupData: PolyData[]): GameState {
		return {
			zones: internalSetupData.map((zone, index) => {
				return {
					id: index,
					status: "empty",
					name: zone.featureName,
					color: "grey",
				};
			}),
		};
	}
};
