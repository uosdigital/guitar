import React from 'react';

interface ChordVoicing {
  name: string;
  type: 'open' | 'barre' | 'power' | 'octave';
  frets: string[];
  fingering?: string[];
  position?: number;
}

interface ChordDisplayProps {
  chord: {
    name: string;
    voicings: ChordVoicing[];
  };
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  const getVoicingTypeColor = (type: string) => {
    switch (type) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'barre': return 'bg-blue-100 text-blue-800';
      case 'power': return 'bg-red-100 text-red-800';
      case 'octave': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-2xl font-bold text-amber-900 mb-4">{chord.name}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chord.voicings.map((voicing, index) => (
          <div key={index} className="border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-amber-800">{voicing.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVoicingTypeColor(voicing.type)}`}>
                {voicing.type}
              </span>
            </div>
            
            {/* Tab notation */}
            <div className="font-mono text-sm bg-amber-50 p-3 rounded border">
              <div className="grid grid-cols-6 gap-1 mb-1 text-xs text-gray-600">
                <div>E</div><div>A</div><div>D</div><div>G</div><div>B</div><div>e</div>
              </div>
              <div className="grid grid-cols-6 gap-1 font-bold">
                {voicing.frets.map((fret, i) => (
                  <div key={i} className="text-center">{fret}</div>
                ))}
              </div>
            </div>
            
            {voicing.fingering && (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">Fingering:</span> {voicing.fingering.join('-')}
              </div>
            )}
            
            {voicing.position && (
              <div className="mt-1 text-xs text-gray-600">
                <span className="font-medium">Position:</span> {voicing.position}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordDisplay;