'use client'
import { MetroGameBoardProps } from "@/scripts/types";
import { useContext } from "react";
import { GameContext } from "./ClientContainer";

export default function Challenges(){
	const props: MetroGameBoardProps = useContext(GameContext);
	console.log("player data", props.initialPlayerData)
	return(
		<h1>Challenges</h1>
	)
}