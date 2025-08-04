import React from 'react';
import { Range, getTrackBackground } from 'react-range';

interface TimelineSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const STEP = 1;
const COLORS = ['#0ff', '#222', '#0ff'];

const hoursToDate = (offset: number) => {
  const d = new Date();
  d.setHours(d.getHours() + offset);
  return d.toLocaleString();
};

const TimelineSlider: React.FC<TimelineSliderProps> = ({ min, max, value, onChange }) => {
  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 rounded-2xl shadow-2xl flex flex-col gap-2 backdrop-blur-2xl border border-cyan-900">
      <div className="mb-2 flex justify-between text-xs text-cyan-300 font-semibold">
        <span>{hoursToDate(min)}</span>
        <span>{hoursToDate(max)}</span>
      </div>
      <div className="flex items-center h-12">
        <Range
          values={value}
          step={STEP}
          min={min}
          max={max}
          onChange={vals => onChange([vals[0], vals[1]])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '8px',
                width: '100%',
                background: getTrackBackground({
                  values: value,
                  colors: [COLORS[0], COLORS[1], COLORS[2]],
                  min,
                  max,
                }),
                borderRadius: '8px',
                boxShadow: '0 0 8px #0ff8',
              }}
              className="transition-all duration-300"
            >
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '32px',
                width: '32px',
                borderRadius: '50%',
                background: index === 0 ? '#06b6d4' : '#0ea5e9',
                border: '4px solid #222',
                boxShadow: '0 0 16px #0ff8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
              }}
            >
              <span className="text-cyan-200 font-bold text-xs select-none">
                {index === 0 ? 'Start' : 'End'}
              </span>
            </div>
          )}
        />
      </div>
      <div className="mt-2 text-center text-lg font-bold text-cyan-300 drop-shadow">
        {hoursToDate(value[0])} <span className="mx-2 text-cyan-400">→</span> {hoursToDate(value[1])}
      </div>
    </div>
  );
};

export default TimelineSlider;
