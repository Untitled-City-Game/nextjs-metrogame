'use client';
import { MetroMayhem } from '@/scripts/Game';
import { MetroGameProps, GameState, GameData, LogEntryWithTime, ModifiedGameData } from '@/scripts/types';
import { createContext, useEffect, useState } from 'react';
import { BoardProps, Client } from 'boardgame.io/react';
import { LogEntry } from 'boardgame.io';
import { Local } from 'boardgame.io/multiplayer';
export const GameContext = createContext({} as ModifiedGameData);



export default function ClientContainer(props: MetroGameProps) {
const App = Client({
	game: MetroMayhem(props.zones),
	board: AppAsBoardgame,
	debug: true,
	multiplayer: Local({
		// persist: true,
		// storageKey: 'bgio'
	}),
}) as React.JSXElementConstructor<MetroGameProps & {playerID : string}>;
return <>
	<App playerID="0" {...props} />
	<App playerID="1" {...props} />
	</>;
}


function AppAsBoardgame(props: GameData) {
	const [logWithTime, setLog] = useState<LogEntryWithTime[]>([]);

	useEffect(() => {
		if (props.log && props.log.length > logWithTime.length) {
			const newEntries = logWithTime ? props.log.slice(logWithTime.length) : props.log;
			const time = new Date();
			const newEntriesWithTime = newEntries.map((entry) => {
				return {time, ...entry};
			});
			setLog([...logWithTime, ...newEntriesWithTime]);
		}
	}, [props.log, logWithTime]);

	const {children, ...rest} = props;
	return <GameContext.Provider value={{...rest, logWithTime }}>{children}</GameContext.Provider>;
}