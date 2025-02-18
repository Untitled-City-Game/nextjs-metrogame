import type { Game } from "boardgame.io";

export interface MyGameState {
	cells: (string | null)[];
  }

export const TicTacToe : Game = {
	setup: () => ({ cells: Array(9).fill(null) }),
	moves: {
	  clickCell: ({ G, playerID }, id) => {
		G.cells[id] = playerID;
	  },
	},
  };