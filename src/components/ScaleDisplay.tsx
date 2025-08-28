import React from 'react';

interface Scale {
  name: string;
  notes: string[];
  pattern: string;
  positions: {
    position: number;
    frets: string[][];
  }[];
}

interface ScaleDisplayProps {
  scale: Scale;
}

const ScaleDisplay: React.FC<ScaleDisplayProps> = ({ scale }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-2xl font-bold text-amber-900 mb-4">{scale.name}</h3>
      
      <div className="mb-6">
        <h4 className="font-semibold text-amber-800 mb-2">Notes</h4>
        <div className="flex flex-wrap gap-2">
          {scale.notes.map((note, index) => (
            <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
              {note}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold text-amber-800 mb-2">Pattern</h4>
        <p className="text-gray-700 font-mono bg-amber-50 p-2 rounded">{scale.pattern}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-amber-800 mb-3">Fretboard Positions</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {scale.positions.map((position, index) => (
            <div key={index} className="border border-amber-200 rounded-lg p-4">
              <h5 className="font-medium text-amber-700 mb-2">Position {position.position}</h5>
              <div className="font-mono text-sm bg-amber-50 p-3 rounded">
                {position.frets.map((string, stringIndex) => (
                  <div key={stringIndex} className="flex justify-between items-center py-1">
                    <span className="w-4 text-gray-600">{['e', 'B', 'G', 'D', 'A', 'E'][stringIndex]}</span>
                    <span className="font-bold">{string.join('--')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScaleDisplay;