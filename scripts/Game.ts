import { GameState, AllPlayersData, PolyData, zoneData, zoneStatus, PlayerData } from "@/scripts/types";
import type { Ctx, FnContext, Game } from "boardgame.io";
import { LogAPI } from "boardgame.io/dist/types/src/plugins/plugin-log";
// function functionMove({G, ctx, playerID}: FnContext<GameState>, claimId: number, teamID: zoneNames, ...args: unknown[]){
// 	G.zones[claimId] = teamID;
// 	console.log(playerID);
// 	return { ...G };
// }

function claimZone(
	{ G, log, playerID }: { G: GameState, log : LogAPI , playerID: string },
	zoneID: number,
) {
	const claimedZone = G.zoneData[zoneID];
	claimedZone.color = G.AllPlayersData[playerID].teamColor;
	log.setMetadata(new Date())
}

function playerSetup(
	{ G, playerID }: { G: GameState , playerID: string },
	newPlayerData : PlayerData
){
	G.AllPlayersData[playerID] = newPlayerData
	console.log("added player data for ", playerID)
}

function startGame({ events, G }: FnContext<GameState>) {
	events.setActivePlayers({ all: "claim" });
	G.active = true;
}

export const MetroMayhem = (internalSetupData: PolyData[]): Game<GameState> => {
	console.log("running metromayhem function")
	return {
		name: "metro-mayhem",
		//set up game board using map json info
		setup: ({ctx}) => gameSetup(internalSetupData, ctx),
		moves: {
			claimZone,
			startGame,
			playerSetup,
		},
		turn: {
			onBegin: ({events}) => {events.setActivePlayers({all: "join"})},
			stages: {
				join: {
					moves: {
						playerSetup,
						startGame
					}
				},
				claim: {
					moves: {
						claimZone,
						playerSetup
					},
				},
			},
		},
	};
};

function gameSetup(internalSetupData: PolyData[], ctx: Ctx): GameState {
	console.log("Setting up game of metromayhem");
	console.log("players: ", ctx.numPlayers);
	console.log("currentplayer ", ctx.currentPlayer);
	return {
		zoneData: createBoardFromMapJson(internalSetupData),
		active: false,
		AllPlayersData : {} as AllPlayersData
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

