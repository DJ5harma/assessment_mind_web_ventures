import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDashboard } from "../context/DashboardContext";
import PolygonWithTooltip from "./PolygonWithTooltip";

interface DrawingPolygonProps {
	drawing: boolean;
	setDrawing: (v: boolean) => void;
}

const DrawingPolygon: React.FC<DrawingPolygonProps> = ({
	drawing,
	setDrawing,
}) => {
	const { polygons, setPolygons } = useDashboard();
	const [points, setPoints] = useState<[number, number][]>([]);
	const [setMap] = useState<any>(null);

	useMapEvents({
		click(e: { latlng: { lat: number; lng: number } }) {
			if (!drawing) return;
			if (points.length < 12) {
				setPoints([...points, [e.latlng.lat, e.latlng.lng]]);
			}
		},
		// No double click to complete
		load(e: { target: unknown }) {
			setMap(e.target);
		},
	});

	const completePolygon = () => {
		if (points.length >= 3) {
			const name =
				prompt("Polygon name?", `Polygon ${polygons.length + 1}`) ||
				`Polygon ${polygons.length + 1}`;
			setPolygons([
				...polygons,
				{
					id: Date.now().toString(),
					name,
					points,
					dataSource: "open-meteo",
					colorRule: [
						{ op: "<", value: 19, color: "red" },
						{ op: "<", value: 25, color: "blue" },
						{ op: ">=", value: 25, color: "green" },
					],
				},
			]);
			setPoints([]);
			setDrawing(false);
		}
	};

	return drawing ? (
		<>
			{points.length > 0 && (
				<Polygon
					positions={points}
					pathOptions={{ color: "#22d3ee", dashArray: "6", fillOpacity: 0.1 }}
				/>
			)}
			{/* Glowing points */}
			{points.map((pt, idx) => (
				<div
					key={idx}
					className="absolute z-[2000] animate-pulse pointer-events-none"
					style={{
						left: `calc(50% + ${(pt[1] - 13.41) * 200}px)`,
						top: `calc(50% - ${(pt[0] - 52.52) * 200}px)`,
					}}
				>
					<div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg border-2 border-cyan-200 neon-glow" />
				</div>
			))}
			<div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-[3000]">
				<button
					className={`px-6 py-3 rounded-xl font-bold text-lg shadow-xl border-2 border-cyan-400 bg-cyan-900/90 text-cyan-200 neon-glow transition-all duration-200 ${
						points.length < 3
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-cyan-800 hover:text-cyan-100"
					}`}
					onClick={completePolygon}
					disabled={points.length < 3}
				>
					Complete Polygon
				</button>
			</div>
		</>
	) : null;
};

const Map: React.FC = () => {
	const { polygons, setPolygons } = useDashboard();
	const [drawing, setDrawing] = useState(false);
	const [mapRef, setMapRef] = useState<any>(null);

	// Handler to reset map center
	const resetCenter = () => {
		if (mapRef) {
			mapRef.setView([52.52, 13.41], 15);
		}
	};

	return (
		<div className="h-full w-full relative">
			<button
				className={`absolute z-[1000] top-4 left-4 px-4 py-2 rounded bg-blue-600 text-white ${
					drawing ? "bg-red-600" : ""
				}`}
				onClick={() => {
					setDrawing(!drawing);
				}}
			>
				{drawing ? "Cancel Drawing" : "Draw Polygon"}
			</button>
			<button
				className="absolute z-[1000] top-4 left-44 px-4 py-2 rounded bg-cyan-700 text-white hover:bg-cyan-600 shadow-lg border border-cyan-400"
				onClick={resetCenter}
			>
				Reset Map Center
			</button>
			<MapContainer
				center={[52.52, 13.41]}
				zoom={15}
				style={{ height: "100%", width: "100%" }}
				scrollWheelZoom={false}
				dragging={true}
				doubleClickZoom={false}
				zoomControl={false}
				minZoom={15}
				maxZoom={15}
				whenReady={setMapRef as () => void}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<DrawingPolygon drawing={drawing} setDrawing={setDrawing} />
				{polygons.map((poly) => {
					// Calculate centroid
					const centroid = poly.points.reduce(
						(acc, p) => [
							acc[0] + p[0] / poly.points.length,
							acc[1] + p[1] / poly.points.length,
						],
						[0, 0]
					);
					return (
						<PolygonWithTooltip poly={poly} centroid={centroid} key={poly.id} />
					);
				})}
			</MapContainer>
		</div>
	);
};

export default Map;
