import React from 'react';

interface PolygonListProps {
  polygons: { id: string; name: string }[];
  onDelete: (id: string) => void;
}

const PolygonList: React.FC<PolygonListProps> = ({ polygons, onDelete }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Polygons</h3>
      <ul>
        {polygons.map((poly) => (
          <li key={poly.id} className="flex items-center justify-between mb-1">
            <span>{poly.name}</span>
            <button
              className="text-red-500 hover:underline"
              onClick={() => onDelete(poly.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PolygonList;
