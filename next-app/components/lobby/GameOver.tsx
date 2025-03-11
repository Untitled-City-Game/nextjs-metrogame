import { PlayerData } from "@/scripts/types";
import { Dispatch, SetStateAction } from "react";

export default function GameOver({setter} : {setter: Dispatch<SetStateAction<PlayerData | undefined>>}){
	setter(undefined);
	return <h1>Game Over</h1>
}