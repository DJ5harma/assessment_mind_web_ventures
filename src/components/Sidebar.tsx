import React from "react";
import { useDashboard } from "../context/DashboardContext";

// Explicit type for color rules
type ColorRule = {
	op: string;
	value: number;
	color: string;
};

// Explicit type for a polygon
type Polygon = {
	id: string;
	name: string;
	points: [number, number][];
	dataSource: string;
	colorRule: ColorRule[];
};

const operators = ["<", "<=", ">", ">=", "="];

const Sidebar: React.FC = () => {
	// Type polygons and setPolygons explicitly
	const {
		polygons,
		setPolygons,
	}: {
		polygons: Polygon[];
		setPolygons: React.Dispatch<React.SetStateAction<Polygon[]>>;
	} = useDashboard();

	const updateRule = (
		polyId: string,
		idx: number,
		field: keyof ColorRule,
		value: number
	) => {
		setPolygons(
			polygons.map((p) =>
				p.id === polyId
					? {
							...p,
							colorRule: p.colorRule.map((r, i) =>
								i === idx ? { ...r, [field]: value } : r
							),
					  }
					: p
			)
		);
	};

	return (
		<aside className="w-72 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-r border-gray-800 h-full overflow-y-auto shadow-2xl backdrop-blur-2xl flex flex-col gap-6 text-white">
			<h2 className="text-2xl font-extrabold text-cyan-300 mb-2 tracking-tight flex items-center gap-2 neon-glow">
				<svg
					width="24"
					height="24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="text-cyan-400"
				>
					<circle cx="12" cy="12" r="10" />
				</svg>
				Data & Color Rules
			</h2>
			{polygons.length === 0 && (
				<div className="text-gray-500 italic">
					No polygons yet. Draw one on the map!
				</div>
			)}
			{polygons.map((poly) => (
				<div
					key={poly.id}
					className="mb-6 border-b border-cyan-900 pb-4 bg-gray-900/80 rounded-xl shadow-xl p-3 relative group"
				>
					<button
						className="absolute top-2 right-2 text-cyan-400 hover:text-red-500 transition-colors duration-200 opacity-70 group-hover:opacity-100"
						title="Delete polygon"
						onClick={() =>
							setPolygons(polygons.filter((p) => p.id !== poly.id))
						}
					>
						<svg
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<input
						className="font-semibold mb-1 border-b border-cyan-700 w-full bg-gray-800/80 focus:outline-none focus:border-cyan-400 text-lg px-1 text-cyan-200 placeholder-cyan-400"
						value={poly.name}
						onChange={(e) =>
							setPolygons(
								polygons.map((p) =>
									p.id === poly.id ? { ...p, name: e.target.value } : p
								)
							)
						}
						placeholder="Polygon name"
					/>
					<div className="mb-2 text-xs text-cyan-400">
						Data Source: {poly.dataSource}
					</div>
					<div>
						<div className="font-semibold text-xs mb-1 text-cyan-300">
							Color Rules
						</div>
						{poly.colorRule.map((rule, idx) => (
							<div key={idx} className="flex items-center gap-1 mb-1">
								<select
									value={rule.op}
									onChange={(e) =>
										updateRule(poly.id, idx, "op", parseFloat(e.target.value))
									}
									className="border border-cyan-700 rounded px-1 py-0.5 text-xs bg-gray-800 text-cyan-200 focus:border-cyan-400"
								>
									{operators.map((op) => (
										<option key={op} value={op}>
											{op}
										</option>
									))}
								</select>
								<input
									type="number"
									value={rule.value}
									onChange={(e) =>
										updateRule(poly.id, idx, "value", Number(e.target.value))
									}
									className="border border-cyan-700 rounded px-1 py-0.5 w-14 text-xs bg-gray-800 text-cyan-200 focus:border-cyan-400"
								/>
								<input
									type="text"
									value={rule.color}
									onChange={(e) =>
										updateRule(
											poly.id,
											idx,
											"color",
											parseFloat(e.target.value)
										)
									}
									className="border border-cyan-700 rounded px-1 py-0.5 w-14 text-xs bg-gray-800 text-cyan-200 focus:border-cyan-400"
								/>
							</div>
						))}
					</div>
				</div>
			))}
		</aside>
	);
};

export default Sidebar;
