import { LineData } from "@/scripts/types";
import { Polyline, Circle } from "@react-google-maps/api";
import { Fragment } from "react";

export default function MapLine({
	line,
	lineVisibility = false,
}: {
	line: LineData;
	lineVisibility: boolean;
	index: number;
}) {
	return (
		<>
			<Polyline
				path={line.coords}
				visible={lineVisibility}
				options={{
					strokeColor: "red",
					strokeOpacity: 0.8,
					strokeWeight: 6,
				}}
			/>
			{/* Make a circle at each vertex of the polyline */}
			{line.coords.map((coord, index) => {
				return (
					<Fragment key={index}>
						<Circle
							center={coord}
							radius={0}
							visible={lineVisibility}
							key={"circle"+index}
							options={{
								strokeColor: "red",
								strokeOpacity: 1,
								strokeWeight: 12,
								fillColor: "red",
								fillOpacity: 1,
							}}
						/>
						<Circle
							center={coord}
							radius={0}
							visible={lineVisibility}
							key={"innercircle"+index}
							options={{
								strokeColor: "white",
								strokeOpacity: 1,
								strokeWeight: 6,
								zIndex: 1,
							}}
						/>
					</Fragment>
				);
			})}
		</>
	);
}
