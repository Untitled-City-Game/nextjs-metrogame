'use client';
import { Client } from 'boardgame.io/react';
import { TicTacToe } from '@/scripts/Game';
import { TicTacToeBoard } from 'components/Board';
import { SocketIO } from 'boardgame.io/multiplayer';

  const TicTacToeClient = Client({
	game: TicTacToe,
	board: TicTacToeBoard,
	multiplayer: SocketIO({ server: 'localhost:8000' }),
  }) as React.JSXElementConstructor<{ playerID: string }>;
  
  const App = () => (
	<div>
	  <TicTacToeClient playerID="0" />
	  <TicTacToeClient playerID="1" />
	</div>
  );
  
  export default App;