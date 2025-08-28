import React, { useState } from 'react';

const ChordProgressionTransposer: React.FC = () => {
  const [progression, setProgression] = useState('C Am F G');
  const [capoPosition, setCapoPosition] = useState(0);
  const [originalKey, setOriginalKey] = useState('C');

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const chordMap: { [key: string]: string } = {
    'C': 'C', 'C#': 'C#', 'Db': 'C#', 'D': 'D', 'D#': 'D#', 'Eb': 'D#',
    'E': 'E', 'F': 'F', 'F#': 'F#', 'Gb': 'F#', 'G': 'G', 'G#': 'G#',
    'Ab': 'G#', 'A': 'A', 'A#': 'A#', 'Bb': 'A#', 'B': 'B'
  };

  const transposeChord = (chord: string, semitones: number): string => {
    // Handle chord modifiers (m, 7, maj7, etc.)
    const baseChordMatch = chord.match(/^([A-G][#b]?)/);
    if (!baseChordMatch) return chord;
    
    const baseChord = baseChordMatch[1];
    const modifier = chord.replace(baseChord, '');
    
    const normalizedChord = chordMap[baseChord] || baseChord;
    const currentIndex = notes.indexOf(normalizedChord);
    
    if (currentIndex === -1) return chord;
    
    const newIndex = (currentIndex + semitones + 12) % 12;
    return notes[newIndex] + modifier;
  };

  const transposeProgression = (prog: string, semitones: number): string => {
    return prog.split(/\s+/).map(chord => 
      chord ? transposeChord(chord, semitones) : ''
    ).join(' ');
  };

  const transposedProgression = transposeProgression(progression, capoPosition);
  
  // Show what chords to play with capo
  const actualChords = transposeProgression(progression, -capoPosition);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-amber-900 mb-6">Chord Progression Transposer</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-2">
            Chord Progression
          </label>
          <input
            type="text"
            value={progression}
            onChange={(e) => setProgression(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="e.g., C Am F G"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Capo Position
            </label>
            <select
              value={capoPosition}
              onChange={(e) => setCapoPosition(Number(e.target.value))}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? 'No Capo' : `Fret ${i}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Original Key
            </label>
            <select
              value={originalKey}
              onChange={(e) => setOriginalKey(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {notes.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">Original Progression</h4>
          <p className="text-lg font-mono text-amber-900">{progression}</p>
          <p className="text-sm text-gray-600 mt-1">Key: {originalKey}</p>
        </div>
        
        {capoPosition > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              Play These Chords (Capo {capoPosition})
            </h4>
            <p className="text-lg font-mono text-green-900">{actualChords}</p>
            <p className="text-sm text-gray-600 mt-1">Sounds like: {transposedProgression}</p>
          </div>
        )}
        
        {capoPosition > 0 && (
          <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Result</h4>
            <p className="text-gray-700">
              With capo on fret {capoPosition}, play <strong>{actualChords}</strong> to sound like <strong>{transposedProgression}</strong>
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Quick Reference</h4>
        <p className="text-sm text-gray-600">
          Enter your chord progression above, set your capo position, and see what chords to play. 
          This is perfect for transposing songs to match your vocal range or to use easier chord shapes.
        </p>
      </div>
    </div>
  );
};

export default ChordProgressionTransposer;