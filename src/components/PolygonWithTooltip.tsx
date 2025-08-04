import React, { useState, useEffect } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import { fetchTemperature } from "../utils/openMeteo";
import { useDashboard } from "../context/DashboardContext";

interface PolygonWithTooltipProps {
	poly: any;
	centroid: [number, number];
}

const PolygonWithTooltip: React.FC<PolygonWithTooltipProps> = ({
	poly,
	centroid,
}) => {
	const [color, setColor] = useState("gray");
	const [temp, setTemp] = useState<number | null>(null);
	const { timeline } = useDashboard();

	useEffect(() => {
		const now = new Date();
		const start = new Date(now.getTime() + timeline[0] * 60 * 60 * 1000);
		const end = new Date(now.getTime() + timeline[1] * 60 * 60 * 1000);
		const startStr = start.toISOString().slice(0, 10);
		const endStr = end.toISOString().slice(0, 10);
		fetchTemperature(centroid[0], centroid[1], startStr, endStr)
			.then((temps) => {
				let value = 0;
				if (temps.length > 0) {
					value =
						temps.reduce((a: number, b: number) => a + b, 0) / temps.length;
				}
				setTemp(value);
				let ruleColor = "gray";
				for (const rule of poly.colorRule) {
					if (
						(rule.op === "<" && value < rule.value) ||
						(rule.op === "<=" && value <= rule.value) ||
						(rule.op === ">" && value > rule.value) ||
						(rule.op === ">=" && value >= rule.value) ||
						(rule.op === "=" && value === rule.value)
					) {
						ruleColor = rule.color;
						break;
					}
				}
				setColor(ruleColor);
			})
			.catch(() => {
				setColor("gray");
				setTemp(null);
			});
	}, [centroid[0], centroid[1], timeline, poly.colorRule]);

	return (
		<>
			<Polygon
				positions={poly.points}
				pathOptions={{ color, fillColor: color, fillOpacity: 0.5 }}
			>
				{temp !== null && (
					<Tooltip
						permanent
						direction="top"
						offset={[0, -8]}
						opacity={1}
						className="!bg-gray-900/90 !text-cyan-200 !font-bold !px-4 !py-2 !rounded-xl !shadow-lg !border !border-cyan-400 neon-glow"
					>
						{poly.name}: {temp.toFixed(1)}°C
					</Tooltip>
				)}
			</Polygon>
		</>
	);
};

export default PolygonWithTooltip;
