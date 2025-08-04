import React from "react";
import { useDashboard } from "../context/DashboardContext";

const Legend: React.FC = () => {
	const { polygons } = useDashboard();
	if (!polygons.length) return null;
	// Show legend for the first polygon (or could be improved to show all)
	const rules = polygons[0].colorRule;
	return (
		<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 backdrop-blur-xl rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center border border-blue-200 animate-fade-in">
			<span className="font-bold text-blue-700">Legend:</span>
			{rules.map((rule: any, idx: number) => (
				<span key={idx} className="flex items-center gap-1 text-sm">
					<span
						className="inline-block w-4 h-4 rounded-full"
						style={{ background: rule.color, border: "1px solid #ccc" }}
					/>
					<span className="text-blue-700 font-semibold">
						{rule.op} {rule.value}
					</span>
				</span>
			))}
		</div>
	);
};

export default Legend;
