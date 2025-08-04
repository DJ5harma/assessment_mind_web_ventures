"use client";
import dynamic from "next/dynamic";
import TimelineSlider from "../components/TimelineSlider";
import Sidebar from "../components/Sidebar";
import Legend from "../components/Legend";
import { DashboardProvider, useDashboard } from "../context/DashboardContext";
// ThemeProvider and useTheme removed for permanent dark mode

const Map = dynamic(() => import("../components/Map"), { ssr: false });

// ThemeToggle removed for permanent dark mode

function Dashboard() {
  const { timeline, setTimeline } = useDashboard();

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* ThemeToggle removed for permanent dark mode */}
      <Sidebar />
      <main className="flex-1 flex flex-col backdrop-blur-2xl shadow-2xl rounded-l-3xl overflow-hidden bg-gray-900/90">
        <div className="p-8 pb-2 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-2xl tracking-tight text-cyan-300 neon-glow">
            Weather Polygon Dashboard
          </h1>
        </div>
        <TimelineSlider
          min={-360}
          max={360}
          value={timeline}
          onChange={setTimeline}
        />
        <div className="flex-1 relative rounded-2xl overflow-hidden m-4 shadow-2xl">
          <Map />
          <Legend />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
