import { LineData } from "@/app/types"
import { Polyline, Circle } from "@react-google-maps/api"

export default function MapLine({line, lineVisibility = false} : {line: LineData, lineVisibility: boolean}) {
	return(
		<>
			<Polyline 
			key = {line.featureName}
			path = {line.coords}
			visible = {lineVisibility}
			options = {{
				strokeColor: 'red',
				strokeOpacity: 0.8,
				strokeWeight: 6
			}}
			/>
			{/* Make a circle at each vertex of the polyline */}
			{line.coords.map((coord, index) => {
				return (<><Circle
					center = {coord}
					radius = {0}
					visible = {lineVisibility}
					key = {line.featureName + String(index)}
					options = {{
						strokeColor: 'red',
						strokeOpacity: 1,
						strokeWeight: 12,
						fillColor: 'red',
						fillOpacity: 1
					}}
				/>
				<Circle
					center = {coord}
					radius = {0}
					visible = {lineVisibility}
					key = {line.featureName + String(index) + "inner"}
					options = {{
						strokeColor: 'white',
						strokeOpacity: 1,
						strokeWeight: 6,
						zIndex: 1
					}}
				/>
				</>)
			})}
		</>
	)
}