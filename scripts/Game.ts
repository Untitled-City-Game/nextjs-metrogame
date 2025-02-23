import { GameState, PolyData, zoneData, zoneStatus } from "@/scripts/types";
import type { Ctx, FnContext, Game, LogEntry } from "boardgame.io";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
// function functionMove({G, ctx, playerID}: FnContext<GameState>, claimId: number, teamID: zoneNames, ...args: unknown[]){
// 	G.zones[claimId] = teamID;
// 	console.log(playerID);
// 	return { ...G };
// }

function claimZone(
	{ G, log }: { G: GameState, ctx: Ctx, log : LogAPI },
	zoneID: number,
	zoneStatus: zoneStatus
) {
	const claimedZone = G.zones[zoneID];
	claimedZone.status = zoneStatus;
	claimedZone.color = zoneStatus === "team1" ? "red" : "blue";
	log.setMetadata(new Date())
}

function startGame({ events, G }: FnContext<GameState>) {
	events.setActivePlayers({ all: "claim" });
	G.active = true;
}

export const MetroMayhem = (internalSetupData: PolyData[]): Game<GameState> => {
	return {
		name: "metro-mayhem",
		//set up game board using map json info
		setup: () => gameSetup(internalSetupData),
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
};

function gameSetup(internalSetupData: PolyData[]): GameState {
	return {
		zones: createBoardFromMapJson(internalSetupData),
		active: false,
	};
}

function createBoardFromMapJson(internalSetupData: PolyData[]): zoneData[] {
	return internalSetupData.map((zone, index) => {
		return {
			id: index,
			status: "empty",
			name: zone.featureName,
			color: "grey",
		};
	}
	);
}

