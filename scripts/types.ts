import { LineString } from "geojson";
import { ReactElement } from "react";
import { BoardProps } from 'boardgame.io/react';
import { LogEntry } from "boardgame.io";

export type geospatialFeature = {
	featureName : string,
	coords: { lat: number; lng: number; }[]
};

export interface PolyData extends geospatialFeature {
	matchedLines : LineData[]
	matchedLineElements?: ReactElement[]
}

export interface LineData extends geospatialFeature {
	matchedPolygons : PolyData[]
}

export interface LineFeature extends GeoJSON.Feature {
			geometry: LineString;
			properties: GeoJSON.GeoJsonProperties & {Name: string};
		}
export interface PolygonFeature extends GeoJSON.Feature {
		geometry: GeoJSON.Polygon;
		properties: GeoJSON.GeoJsonProperties & {Name: string};
	}


export interface GameState {
	zones: zoneData[],
	active: boolean
  }

export type zoneStatus = "team1" | "team2" | "empty";

export type MetroGameProps = {
	zoneData: string
	zones: PolyData[];
	winningLines: LineData[];
	children?: React.ReactNode;
}

export type LogEntryWithTime = LogEntry & {time: Date};

export type GameData = BoardProps<GameState> & MetroGameProps;
export type ModifiedGameData = GameData & {logWithTime: LogEntryWithTime[]};

export type zoneData = {
	id: number;
	status: zoneStatus;
	name: string;
	color: Color;
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type namedColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "black" | "white"| "grey";

export type Color = RGB | RGBA | HEX | namedColor;