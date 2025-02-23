'use client';
import { MetroMayhem } from '@/scripts/Game';
import { MetroGameProps, GameState, GameData, LogEntryWithTime, ModifiedGameData } from '@/scripts/types';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BoardProps, Client } from 'boardgame.io/react';
import { LogEntry } from 'boardgame.io';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { TextInput, Container, Button, Stack, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
export const GameContext = createContext({} as GameData);



export default function ClientContainer(props: MetroGameProps) {
	const [playerID, setPlayerID] = useState<string>("");
	const GameClient = Client({
		game: MetroMayhem(props.zones),
		board: AppAsBoardgame,
		debug: true,
		multiplayer: SocketIO({
			server: 'localhost:8000',
			//persist: true,
			// storageKey: 'bgio'
		}),
	}) as React.JSXElementConstructor<MetroGameProps & {playerID : string}>;
	return (
		playerID ? <GameClient playerID={playerID} {...props} /> : <Lobby setPlayerID={setPlayerID} />
		//<GameClient playerID={"0"} {...props} />
	);
	}


function AppAsBoardgame(props: GameData) {

	const {children, ...rest} = props;
	return <GameContext.Provider value={{...rest }}>{children}</GameContext.Provider>;
}

function Lobby({setPlayerID} : {setPlayerID: Dispatch<SetStateAction<string>>}) {
	const joinGameForm = useForm({
		mode: 'uncontrolled',
		initialValues: {
			playerID: '',
			teamID: ''
		}
	});
	return (
		<Center>
			<form onSubmit={joinGameForm.onSubmit((values) => {
				console.log("Joining game with playerID", values.playerID, values);
				setPlayerID(values.playerID);
				})}>
				<Stack>
					<h1>Untitled City Game</h1>
					<TextInput label="Player ID" key={joinGameForm.key('playerID')} {...joinGameForm.getInputProps('playerID')}
					/>
					<TextInput label="Team ID" key={joinGameForm.key('teamID')} {...joinGameForm.getInputProps('teamID')}/>
					<Button type="submit">Join Game</Button>
				</Stack>
			</form>
		</Center>
	);
}