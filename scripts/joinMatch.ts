import { LobbyClient } from 'boardgame.io/dist/types/packages/client';
import { PlayerData, Color } from './types';

export async function joinMatch(
	lobbyClient: LobbyClient, 
	matchID: string, 
	PlayerName: string,
	teamID: string
 	) {
	const res = await lobbyClient.joinMatch(
		'connect-four',
		matchID,
		{
			playerName: PlayerName,
			data: {
				teamColor: teamID
			}
		}
	);

	//set player data
	const playerData: PlayerData = {
		name: PlayerName,
		playerID: res.playerID as `${number}`,
		matchID: matchID,
		playerCredentials: res.playerCredentials,
		teamColor: teamID as Color,
	};
	return playerData;
}
