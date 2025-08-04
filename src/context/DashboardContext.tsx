import React, { createContext, useContext, useState, useEffect } from 'react';

interface Polygon {
  id: string;
  name: string;
  points: [number, number][];
  dataSource: string;
  colorRule: any;
}

interface DashboardContextProps {
  polygons: Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<Polygon[]>>;
  timeline: [number, number];
  setTimeline: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [polygons, setPolygons] = useState<Polygon[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('polygons');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [timeline, setTimeline] = useState<[number, number]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timeline');
      return saved ? JSON.parse(saved) : [0, 0];
    }
    return [0, 0];
  });

  useEffect(() => {
    localStorage.setItem('polygons', JSON.stringify(polygons));
  }, [polygons]);

  useEffect(() => {
    localStorage.setItem('timeline', JSON.stringify(timeline));
  }, [timeline]);

  return (
    <DashboardContext.Provider value={{ polygons, setPolygons, timeline, setTimeline }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
