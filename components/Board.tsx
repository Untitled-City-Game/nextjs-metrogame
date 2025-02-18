import type { BoardProps } from 'boardgame.io/react';
import type { MyGameState } from '../scripts/Game.js'

export const TicTacToeBoard : React.FunctionComponent<BoardProps<MyGameState>> = ({ G, ctx, moves }) => {
	const onClick = (id: number) => moves.clickCell(id);
	
	const winner = () => {
		if (ctx.gameover) {
		  return ctx.gameover.winner !== undefined ? (
			  <div id="winner">Winner: {ctx.gameover.winner}</div>
			) : (
			  <div id="winner">Draw!</div>
			);
		}
	  };
	  
	const cellStyle = {
	  border: '1px solid #555',
	  width: '50px',
	  height: '50px',
	  lineHeight: '50px',
	  textAlign: 'center' as const,
	};
  
	const tbody = [];
	for (let i = 0; i < 3; i++) {
	  const cells = [];
	  for (let j = 0; j < 3; j++) {
		const id = 3 * i + j;
		cells.push(
		  <td key={id}>
			{G.cells[id] ? (
			  <div style={cellStyle}>{G.cells[id]}</div>
			) : (
			  <button style={cellStyle} onClick={() => onClick(id)} />
			)}
		  </td>
		);
	  }
	  tbody.push(<tr key={i}>{cells}</tr>);
	}
  
	return (
	  <div>
		<table id="board">
		  <tbody>{tbody}</tbody>
		</table>
		{winner? winner() : null}
	  </div>
	);
  }