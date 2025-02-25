import { LineString } from "geojson";
import { ReactElement } from "react";
import { BoardProps } from 'boardgame.io/react';
import { LogEntry } from "boardgame.io";
import { PlayerAPI } from "boardgame.io/dist/types/src/plugins/plugin-player";

export type geospatialFeature = {
	featureName : string,
	coords: { lat: number; lng: number; }[]
};

export interface PolyData extends geospatialFeature {
	matchedLines : LineData[]
	matchedLineElements?: ReactElement[]
}

export interface LineData extends geospatialFeature {
	matchedPolygons : string[]
}

export interface LineFeature extends GeoJSON.Feature {
			geometry: LineString;
			properties: GeoJSON.GeoJsonProperties & {Name: string};
		}
export interface PolygonFeature extends GeoJSON.Feature {
		geometry: GeoJSON.Polygon;
		properties: GeoJSON.GeoJsonProperties & {Name: string};
	}

export type zoneData = {
	id: number;
	status: zoneStatus;
	name: string;
	color: Color;
}

export type PlayerData = {
	playerID: `${number}`;
	name: string;
	teamColor: Color;
	playerCredentials?: string;
}

export type AllPlayersData = {
	[key:string] : PlayerData
}

export interface GameState {
	zoneData: zoneData[],
	active: boolean,
	AllPlayersData : AllPlayersData,
  }

export type zoneStatus = Color | "empty";

export type GameSetupData = {
	zonePolygons: PolyData[];
	winningLines: LineData[];
}

export interface MetroGameBoardProps extends BoardProps<GameState> {
	zonePolygons: PolyData[];
	winningLines: LineData[];
	children?: React.ReactNode;
	playerData?: PlayerData;
}



type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type namedColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "black" | "white"| "grey";

export type Color = RGB | RGBA | HEX | namedColor;


