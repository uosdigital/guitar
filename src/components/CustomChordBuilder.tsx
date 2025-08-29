import React, { useState } from 'react';
import Fretboard from './Fretboard';

interface CustomChord {
  id: string;
  name: string;
  rootNote: string;
  chordQuality: string;
  chordVoicing: string;
  frets: string[];
  fingering: string[];
  position: number;
}

export const CustomChordBuilder: React.FC = () => {
  const [chordName, setChordName] = useState('');
  const [rootNote, setRootNote] = useState('');
  const [chordQuality, setChordQuality] = useState('');
  const [chordVoicing, setChordVoicing] = useState('');
  const [startingFret, setStartingFret] = useState(1);
  const [selectedFrets, setSelectedFrets] = useState<string[]>(['x', 'x', 'x', 'x', 'x', 'x']);
  const [selectedFingering, setSelectedFingering] = useState<string[]>(['x', 'x', 'x', 'x', 'x', 'x']);

  const handleFretClick = (stringIndex: number, fretNumber: number) => {
    const newFrets = [...selectedFrets];
    const newFingering = [...selectedFingering];
    
    // If clicking on the same position, remove the dot
    if (newFrets[stringIndex] === fretNumber.toString()) {
      newFrets[stringIndex] = 'x';
      newFingering[stringIndex] = 'x';
    } else {
      // Add the dot
      newFrets[stringIndex] = fretNumber.toString();
      newFingering[stringIndex] = '1'; // Simple fingering
    }
    
    setSelectedFrets(newFrets);
    setSelectedFingering(newFingering);
  };

  const handleNutClick = (stringIndex: number) => {
    const newFrets = [...selectedFrets];
    const newFingering = [...selectedFingering];
    
    // Cycle through: muted -> open -> muted
    if (newFrets[stringIndex] === 'x') {
      // Currently muted, make it open
      newFrets[stringIndex] = '0';
      newFingering[stringIndex] = '0';
    } else if (newFrets[stringIndex] === '0') {
      // Currently open, make it muted
      newFrets[stringIndex] = 'x';
      newFingering[stringIndex] = 'x';
    } else {
      // Currently has a fret position, make it muted
      newFrets[stringIndex] = 'x';
      newFingering[stringIndex] = 'x';
    }
    
    setSelectedFrets(newFrets);
    setSelectedFingering(newFingering);
  };

    const saveChord = () => {
    if (!chordName.trim()) {
      alert('Please enter a display name');
      return;
    }

    if (!rootNote) {
      alert('Please select a root note');
      return;
    }

    if (!chordQuality) {
      alert('Please select a chord quality');
      return;
    }

    if (!chordVoicing) {
      alert('Please select a chord voicing');
      return;
    }

    const newChord: CustomChord = {
      id: Date.now().toString(),
      name: chordName.trim(),
      rootNote,
      chordQuality,
      chordVoicing,
      frets: [...selectedFrets],
      fingering: [...selectedFingering],
      position: startingFret
    };

    // Get existing chords
    const existingChords = JSON.parse(localStorage.getItem('customChords') || '[]');
    const updatedChords = [...existingChords, newChord];
    
    // Save to localStorage
    localStorage.setItem('customChords', JSON.stringify(updatedChords));
    
    // Reset form
    setChordName('');
    setRootNote('');
    setChordQuality('');
    setChordVoicing('');
    setStartingFret(1);
    setSelectedFrets(['x', 'x', 'x', 'x', 'x', 'x']);
    setSelectedFingering(['x', 'x', 'x', 'x', 'x', 'x']);
    
    alert('Chord saved successfully!');
  };

  const clearFretboard = () => {
    setSelectedFrets(['x', 'x', 'x', 'x', 'x', 'x']);
    setSelectedFingering(['x', 'x', 'x', 'x', 'x', 'x']);
  };





  const getNutClass = (stringIndex: number) => {
    if (selectedFrets[stringIndex] === '0') {
      return 'bg-green-500 text-white border-green-600 hover:bg-green-600';
    }
    if (selectedFrets[stringIndex] === 'x') {
      return 'bg-red-500 text-white border-red-600 hover:bg-red-600';
    }
    return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500';
  };

  const getFretClass = (stringIndex: number, fretNumber: number) => {
    if (selectedFrets[stringIndex] === fretNumber.toString()) {
      return 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600';
    }
    return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Add New Chord
              </h2>

              {/* Chord Builder */}
              <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                {/* Display Name at the top */}
                <div className="mb-6">
                  <label htmlFor="chord-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    id="chord-name"
                    type="text"
                    value={chordName}
                    onChange={(e) => setChordName(e.target.value)}
                    placeholder="e.g. My Custom C Major"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="root-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Root Note
                    </label>
                    <select
                      id="root-note"
                      value={rootNote}
                      onChange={(e) => setRootNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select root note</option>
                      {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                        <option key={note} value={note}>{note}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="chord-quality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chord Quality
                    </label>
                    <select
                      id="chord-quality"
                      value={chordQuality}
                      onChange={(e) => setChordQuality(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select quality</option>
                      {['Major', 'Minor', 'Maj7', 'Min7', 'Diminished', 'Augmented', 'Sus2', 'Sus4', '7', '9', '13', 'Power Chord', 'Custom'].map(quality => (
                        <option key={quality} value={quality}>{quality}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="chord-voicing" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chord Voicing
                    </label>
                    <select
                      id="chord-voicing"
                      value={chordVoicing}
                      onChange={(e) => setChordVoicing(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select voicing</option>
                      {['Open', 'Barre', 'Power', 'Triad', 'Custom'].map(voicing => (
                        <option key={voicing} value={voicing}>{voicing}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="starting-fret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Starting Fret
                    </label>
                    <select
                      id="starting-fret"
                      value={startingFret}
                      onChange={(e) => setStartingFret(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => (
                        <option key={fret} value={fret}>{fret}</option>
                      ))}
                    </select>
                  </div>
                </div>

        

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Interactive Fretboard</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click on strings and frets to place dots. Click the nut area to cycle through open (○) and muted (✕) strings.
          </p>
          
          {/* Legend */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-4 text-xs text-blue-800 dark:text-blue-200">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">○</div>
                <span>Open string</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✕</div>
                <span>Muted string</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">●</div>
                <span>Finger position</span>
              </div>
            </div>
          </div>
          
          {/* Interactive Fretboard - Matching Final Display Style */}
          <div className="inline-block">
            {/* String names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="w-6"></div> {/* Spacer for fret numbers */}
              {['E', 'A', 'D', 'G', 'B', 'e'].map((string, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-600 dark:text-gray-300">
                  {string}
                </div>
              ))}
            </div>

            {/* Fretboard */}
            <div className="border-2 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-800 shadow-lg">
              {/* Nut area */}
              <div className="grid grid-cols-7 gap-1 p-2 bg-gray-300 dark:bg-gray-500 border-b-2 border-gray-600 dark:border-gray-400">
                <div className="flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                  Nut
                </div>
                {[0, 1, 2, 3, 4, 5].map((stringIndex) => (
                  <button
                    key={stringIndex}
                    onClick={() => handleNutClick(stringIndex)}
                    className="relative flex items-center justify-center h-8"
                    title={`String ${stringIndex + 1}: Click to cycle through open/muted`}
                  >
                    {/* Vertical string line */}
                    <div className="absolute w-0.5 h-full bg-gray-600 dark:bg-gray-400" />
                    
                                                {/* Nut content */}
                            <div className="relative z-10 flex items-center justify-center w-6 h-6">
                              {selectedFrets[stringIndex] === '0' ? (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">○</div>
                              ) : selectedFrets[stringIndex] === 'x' ? (
                                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✕</div>
                              ) : (
                                <span></span>
                              )}
                            </div>
                  </button>
                ))}
              </div>

              {/* Fret positions */}
                                    {Array.from({ length: 5 }, (_, fretIndex) => {
                        const fretNumber = startingFret + fretIndex;
                return (
                  <div key={fretIndex} className="grid grid-cols-7 gap-1 p-2 border-b border-gray-400 dark:border-gray-500 last:border-b-0 relative">
                    {/* Horizontal fret line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600 dark:bg-gray-400" />
                    
                    {/* Fret number on the left */}
                    <div className="flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {fretNumber}
                    </div>
                    
                    {[0, 1, 2, 3, 4, 5].map((stringIndex) => {
                      const isFinger = selectedFrets[stringIndex] === fretNumber.toString();
                      
                      return (
                        <button
                          key={stringIndex}
                          onClick={() => handleFretClick(stringIndex, fretNumber)}
                          className="relative flex items-center justify-center h-10"
                          title={`String ${stringIndex + 1}, Fret ${fretNumber}: Click to place/remove dot`}
                        >
                          {/* Vertical string line */}
                          <div className="absolute w-0.5 h-full bg-gray-600 dark:bg-gray-400" />
                          
                          {/* Fret content */}
                          <div className="relative z-10 flex items-center justify-center w-8 h-8">
                            {isFinger ? (
                              <div className="w-7 h-7 rounded-full bg-teal-600 dark:bg-teal-500 shadow-lg transform hover:scale-110 transition-transform">
                              </div>
                            ) : (
                              <span></span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Chord Preview:</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div><strong>Name:</strong> {chordName || 'Unnamed'}</div>
                                <div><strong>Position:</strong> {startingFret}</div>
            <div><strong>Frets:</strong> [{selectedFrets.join(', ')}]</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={saveChord}
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            Save Chord
          </button>
          <button
            onClick={clearFretboard}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
