import { Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

export default function LocationMarker({initialPosition = {lat: 0, lng: 0}} : {initialPosition: google.maps.LatLngLiteral}) {
	const [position, setPosition] = useState(initialPosition);
	//Location marker

	//Track user location
	useEffect(() => {
		console.log("useEffect");
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition((position) => {
				setPosition({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}),
					console.log("pos not found");
			});
		} else {
			console.log("location not found");
		}
	}, []);
	return <Marker position={position} title="You are here" />;
}
