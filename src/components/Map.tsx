import React, { useState } from "react";
import {
	MapContainer,
	TileLayer,
	Polygon,
	useMapEvents,
	MapContainerProps,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDashboard } from "../context/DashboardContext";
import PolygonWithTooltip from "./PolygonWithTooltip";
import type { LeafletMouseEvent, Map as LeafletMapInstance } from "leaflet";

// --- Types ---
type ColorRule = {
	op: string;
	value: number;
	color: string;
};

export type PolygonType = {
	id: string;
	name: string;
	points: [number, number][];
	dataSource: string;
	colorRule: ColorRule[];
};

interface DrawingPolygonProps {
	drawing: boolean;
	setDrawing: (v: boolean) => void;
}

const DrawingPolygon: React.FC<DrawingPolygonProps> = ({
	drawing,
	setDrawing,
}) => {
	const { polygons, setPolygons } = useDashboard() as {
		polygons: PolygonType[];
		setPolygons: React.Dispatch<React.SetStateAction<PolygonType[]>>;
	};

	const [points, setPoints] = useState<[number, number][]>([]);

	useMapEvents({
		click(e: LeafletMouseEvent) {
			if (!drawing) return;
			if (points.length < 12) {
				setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
			}
		},
	});

	const completePolygon = () => {
		if (points.length >= 3) {
			const name =
				prompt("Polygon name?", `Polygon ${polygons.length + 1}`) ||
				`Polygon ${polygons.length + 1}`;
			const newPolygon: PolygonType = {
				id: Date.now().toString(),
				name,
				points,
				dataSource: "open-meteo",
				colorRule: [
					{ op: "<", value: 19, color: "red" },
					{ op: "<", value: 25, color: "blue" },
					{ op: ">=", value: 25, color: "green" },
				],
			};
			setPolygons((prev) => [...prev, newPolygon]);
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
	const { polygons } = useDashboard() as {
		polygons: PolygonType[];
		setPolygons: React.Dispatch<React.SetStateAction<PolygonType[]>>;
	};

	const [drawing, setDrawing] = useState(false);
	const [mapRef, setMapRef] = useState<LeafletMapInstance | null>(null);

	const resetCenter = () => {
		if (mapRef) {
			mapRef.setView([52.52, 13.41], 15);
		}
	};

	// Explicitly define the whenReady handler
	const handleMapReady: MapContainerProps["whenReady"] = () => {
		// Delay access via setTimeout to ensure target is available
		setTimeout(() => {
			const container = document.querySelector(
				".leaflet-container"
			) as HTMLElement & {
				_leaflet_map?: LeafletMapInstance;
			};

			if (container?._leaflet_map) {
				setMapRef(container._leaflet_map);
			}
		}, 0);
	};

	return (
		<div className="h-full w-full relative">
			<button
				className={`absolute z-[1000] top-4 left-4 px-4 py-2 rounded text-white ${
					drawing ? "bg-red-600" : "bg-blue-600"
				}`}
				onClick={() => setDrawing((prev) => !prev)}
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
				whenReady={handleMapReady}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<DrawingPolygon drawing={drawing} setDrawing={setDrawing} />
				{polygons.map((poly) => {
					const centroid: [number, number] = poly.points.reduce(
						(acc, p) => [
							acc[0] + p[0] / poly.points.length,
							acc[1] + p[1] / poly.points.length,
						],
						[0, 0]
					);
					return (
						<PolygonWithTooltip key={poly.id} poly={poly} centroid={centroid} />
					);
				})}
			</MapContainer>
		</div>
	);
};

export default Map;
