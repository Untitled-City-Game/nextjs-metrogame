'use client';
import { MetroMayhem } from '@/scripts/Game';
import { MetroGameProps, GameState, GameData } from '@/app/types';
import { createContext } from 'react';
import { BoardProps, Client } from 'boardgame.io/react';
export const GameContext = createContext({} as MetroGameProps & BoardProps<GameState>);

export default function ClientContainer(props: MetroGameProps) {
const App = Client({
	game: MetroMayhem(props.zones),
	board: AppAsBoardgame,
	debug: true,
}) as React.JSXElementConstructor<MetroGameProps>;
return <App {...props} />;
}


function AppAsBoardgame(props: GameData) {
	const {children, ...rest} = props;
	return <GameContext.Provider value={rest}>{children}</GameContext.Provider>;
}
