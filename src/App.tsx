import React, { useState, useEffect } from 'react';
import { Guitar, Moon, Sun, Plus, Library, RefreshCw, Edit, Trash2, Download, Upload, Music } from 'lucide-react';
import { CustomChordBuilder } from './components/CustomChordBuilder';
import Fretboard from './components/Fretboard';
import guitarIcon from './guitar.jpg';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('add');

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const tabs = [
    { id: 'add', name: 'Add Chord', icon: Plus },
    { id: 'library', name: 'Chord Library', icon: Library },
    { id: 'keys', name: 'Keys', icon: Music }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-teal-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={guitarIcon} alt="Guitar" className="w-10 h-10 rounded" />
              <h1 className="text-xl font-bold text-teal-900 dark:text-teal-100">Custom Chord Builder</h1>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'add' && (
          <div>
            <CustomChordBuilder />
          </div>
        )}
        
        {activeTab === 'library' && (
          <div>
            <ChordLibrary />
          </div>
        )}

        {activeTab === 'keys' && (
          <div>
            <KeySelector />
          </div>
        )}
      </div>
    </div>
  );
}

// Chord Library Component
const ChordLibrary: React.FC = () => {
  const [customChords, setCustomChords] = useState<any[]>(() => {
    const saved = localStorage.getItem('customChords');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingChord, setEditingChord] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoot, setFilterRoot] = useState('');
  const [filterQuality, setFilterQuality] = useState('');
  const [filterVoicing, setFilterVoicing] = useState('');

  // Refresh chords when localStorage changes
  const refreshChords = () => {
    const saved = localStorage.getItem('customChords');
    setCustomChords(saved ? JSON.parse(saved) : []);
  };

  // Listen for storage events (when chords are added from other tab)
  React.useEffect(() => {
    const handleStorageChange = () => {
      refreshChords();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const deleteChord = (id: string) => {
    const updatedChords = customChords.filter(chord => chord.id !== id);
    setCustomChords(updatedChords);
    localStorage.setItem('customChords', JSON.stringify(updatedChords));
  };

  const openEditModal = (chord: any) => {
    setEditingChord(chord);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingChord(null);
    setEditModalOpen(false);
  };

  const saveEditedChord = (editedChord: any) => {
    const updatedChords = customChords.map(chord => 
      chord.id === editedChord.id ? editedChord : chord
    );
    setCustomChords(updatedChords);
    localStorage.setItem('customChords', JSON.stringify(updatedChords));
    closeEditModal();
  };

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const QUALITIES = ['Major', 'Minor', 'Maj7', 'Min7', 'Diminished', 'Augmented', 'Sus2', 'Sus4', '7', '9', '13', 'Power Chord', 'Custom'];
  const VOICINGS = ['Open', 'Barre', 'Power', 'Triad', 'Custom'];

  const filteredChords = customChords.filter((chord) => {
    const matchesQuery = searchQuery.trim().length === 0 || (chord.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoot = !filterRoot || chord.rootNote === filterRoot;
    const matchesQuality = !filterQuality || chord.chordQuality === filterQuality;
    const matchesVoicing = !filterVoicing || chord.chordVoicing === filterVoicing;
    return matchesQuery && matchesRoot && matchesQuality && matchesVoicing;
  });

  const sortedChords = [...filteredChords].sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    
    // If both names start with the same letter, handle musical note ordering
    if (aName[0] === bName[0]) {
      // Check if one has a sharp (#) and the other doesn't
      const aHasSharp = aName.includes('#');
      const bHasSharp = bName.includes('#');
      
      if (aHasSharp && !bHasSharp) {
        return 1; // Natural note comes before sharp
      } else if (!aHasSharp && bHasSharp) {
        return -1; // Natural note comes before sharp
      }
    }
    
    return aName.localeCompare(bName);
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRoot('');
    setFilterQuality('');
    setFilterVoicing('');
  };

  const exportChords = () => {
    try {
      const chords = localStorage.getItem('customChords') || '[]';
      const blob = new Blob([chords], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guitar-chords-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Chords exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export chords. Please try again.');
    }
  };

  const importChords = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedChords = JSON.parse(content);
        
        if (!Array.isArray(importedChords)) {
          throw new Error('Invalid file format');
        }

        // Validate chord structure
        const validChords = importedChords.filter((chord: any) => 
          chord.id && chord.name && chord.frets && chord.frets.length === 6
        );

        if (validChords.length === 0) {
          throw new Error('No valid chords found in file');
        }

        // Merge with existing chords (avoid duplicates by ID)
        const existingChords = JSON.parse(localStorage.getItem('customChords') || '[]');
        const existingIds = new Set(existingChords.map((c: any) => c.id));
        const newChords = validChords.filter((chord: any) => !existingIds.has(chord.id));
        
        const mergedChords = [...existingChords, ...newChords];
        localStorage.setItem('customChords', JSON.stringify(mergedChords));
        setCustomChords(mergedChords);
        
        alert(`Successfully imported ${newChords.length} new chords!`);
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import chords. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chord Library
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {customChords.length} total chord{customChords.length !== 1 ? 's' : ''}
            {filteredChords.length !== customChords.length && (
              <span> • {filteredChords.length} filtered result{filteredChords.length !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportChords}
            className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors duration-200"
            title="Export chords to file"
          >
            <Download className="w-5 h-5" />
          </button>
          <label className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              accept=".json"
              onChange={importChords}
              className="hidden"
            />
          </label>
          <button
            onClick={refreshChords}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            title="Refresh chords"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {customChords.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎸</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No custom chords yet</h4>
          <p className="text-gray-500 dark:text-gray-400">Create your first custom chord in the "Add Chord" tab!</p>
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by display name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={filterRoot}
              onChange={(e) => setFilterRoot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All roots</option>
              {NOTES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={filterQuality}
              onChange={(e) => setFilterQuality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All qualities</option>
              {QUALITIES.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <div className="flex space-x-2">
              <select
                value={filterVoicing}
                onChange={(e) => setFilterVoicing(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All voicings</option>
                {VOICINGS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <button
                onClick={clearFilters}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>

          {sortedChords.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-300">No matching chords</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedChords.map(chord => (
                <div
                  key={chord.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{chord.name}</h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {chord.rootNote && chord.chordQuality && chord.chordVoicing ? `${chord.rootNote} ${chord.chordQuality} (${chord.chordVoicing})` : 'Custom Chord'}
                      </div>
                    </div>
                    <button
                      onClick={() => openEditModal(chord)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Edit chord"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <Fretboard 
                      frets={chord.frets}
                      fingering={chord.fingering}
                      position={chord.position}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && editingChord && (
        <EditChordModal
          chord={editingChord}
          onSave={saveEditedChord}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

// Key Selector Component
const KeySelector: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const [filterRoot, setFilterRoot] = useState('');
  const [filterQuality, setFilterQuality] = useState('');
  const [filterVoicing, setFilterVoicing] = useState('');
  const [customChords, setCustomChords] = useState<any[]>(() => {
    const saved = localStorage.getItem('customChords');
    return saved ? JSON.parse(saved) : [];
  });

  // Refresh chords when localStorage changes
  const refreshChords = () => {
    const saved = localStorage.getItem('customChords');
    setCustomChords(saved ? JSON.parse(saved) : []);
  };

  // Listen for storage events (when chords are added from other tab)
  React.useEffect(() => {
    const handleStorageChange = () => {
      refreshChords();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const QUALITIES = ['Major', 'Minor', 'Maj7', 'Min7', 'Diminished', 'Augmented', 'Sus2', 'Sus4', '7', '9', '13', 'Power Chord', 'Custom'];
  const VOICINGS = ['Open', 'Barre', 'Power', 'Triad', 'Custom'];

  // Define musical keys and their chord progressions
  const musicalKeys = {
    // Major Keys
    'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
    'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
    'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
    'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
    'E': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
    'B': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
    'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#dim'],
    'C#': ['C#', 'D#m', 'E#m', 'F#', 'G#', 'A#m', 'B#dim'],
    'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
    'Bb': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
    'Eb': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'],
    'Ab': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'],
    'Db': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'],
    'Gb': ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim'],
    'Cb': ['Cb', 'Dbm', 'Ebm', 'Fb', 'Gb', 'Abm', 'Bbdim'],
    
    // Minor Keys (Natural Minor)
    'Am': ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'],
    'Em': ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D'],
    'Bm': ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A'],
    'F#m': ['F#m', 'G#dim', 'A', 'Bm', 'C#m', 'D', 'E'],
    'C#m': ['C#m', 'D#dim', 'E', 'F#m', 'G#m', 'A', 'B'],
    'G#m': ['G#m', 'A#dim', 'B', 'C#m', 'D#m', 'E', 'F#'],
    'D#m': ['D#m', 'E#dim', 'F#', 'G#m', 'A#m', 'B', 'C#'],
    'A#m': ['A#m', 'B#dim', 'C#', 'D#m', 'E#m', 'F#', 'G#'],
    'Dm': ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C'],
    'Gm': ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
    'Cm': ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
    'Fm': ['Fm', 'Gdim', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
    'Bbm': ['Bbm', 'Cdim', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
    'Ebm': ['Ebm', 'Fdim', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    'Abm': ['Abm', 'Bbdim', 'Cb', 'Dbm', 'Ebm', 'Fb', 'Gb']
  };

  // Get chords that match the selected key
  const getChordsInKey = () => {
    if (!selectedKey || !musicalKeys[selectedKey as keyof typeof musicalKeys]) {
      return [];
    }

    const keyChords = musicalKeys[selectedKey as keyof typeof musicalKeys];
    const chordsInKey: any[] = [];

    keyChords.forEach(chordName => {
      // Find chords that match this chord name
      const matchingChords = customChords.filter(chord => {
        // Handle different naming conventions
        const chordDisplayName = chord.name.toLowerCase();
        const targetChordName = chordName.toLowerCase();
        
        // Direct match
        if (chordDisplayName === targetChordName) {
          return true;
        }
        
        // Handle sharps and flats
        const normalizedChordName = chordDisplayName
          .replace('c#', 'db')
          .replace('d#', 'eb')
          .replace('f#', 'gb')
          .replace('g#', 'ab')
          .replace('a#', 'bb');
        
        const normalizedTarget = targetChordName
          .replace('c#', 'db')
          .replace('d#', 'eb')
          .replace('f#', 'gb')
          .replace('g#', 'ab')
          .replace('a#', 'bb');
        
        return normalizedChordName === normalizedTarget;
      });
      
      chordsInKey.push(...matchingChords);
    });

    // Apply additional filters
    return chordsInKey.filter((chord) => {
      const matchesRoot = !filterRoot || chord.rootNote === filterRoot;
      const matchesQuality = !filterQuality || chord.chordQuality === filterQuality;
      const matchesVoicing = !filterVoicing || chord.chordVoicing === filterVoicing;
      return matchesRoot && matchesQuality && matchesVoicing;
    });
  };

  const chordsInKey = getChordsInKey();

  const clearFilters = () => {
    setFilterRoot('');
    setFilterQuality('');
    setFilterVoicing('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Key Selector
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose a musical key to see which chords from your library are available in that key.
          </p>
        </div>
        <button
          onClick={refreshChords}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          title="Refresh chords"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Key
        </label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Choose a key...</option>
          {Object.keys(musicalKeys).map(key => (
            <option key={key} value={key}>
              {key} {key.endsWith('m') ? 'Minor' : 'Major'}
            </option>
          ))}
        </select>
      </div>

      {selectedKey && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={filterRoot}
            onChange={(e) => setFilterRoot(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All roots</option>
            {NOTES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <select
            value={filterQuality}
            onChange={(e) => setFilterQuality(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All qualities</option>
            {QUALITIES.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <select
              value={filterVoicing}
              onChange={(e) => setFilterVoicing(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All voicings</option>
              {VOICINGS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {selectedKey && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chords in {selectedKey} {selectedKey.endsWith('m') ? 'Minor' : 'Major'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {chordsInKey.length} chord{chordsInKey.length !== 1 ? 's' : ''} available from your library
              {(filterRoot || filterQuality || filterVoicing) && (
                <span className="text-teal-600 dark:text-teal-400"> (filtered)</span>
              )}
            </p>
            
            {/* Show the chord progression */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chord Progression:</h4>
              <div className="flex flex-wrap gap-2">
                {musicalKeys[selectedKey as keyof typeof musicalKeys].map((chord, index) => {
                  const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
                  const hasChords = customChords.some(c => {
                    const chordDisplayName = c.name.toLowerCase();
                    const targetChordName = chord.toLowerCase();
                    return chordDisplayName === targetChordName || 
                           chordDisplayName.replace('c#', 'db').replace('d#', 'eb').replace('f#', 'gb').replace('g#', 'ab').replace('a#', 'bb') === 
                           targetChordName.replace('c#', 'db').replace('d#', 'eb').replace('f#', 'gb').replace('g#', 'ab').replace('a#', 'bb');
                  });
                  
                  return (
                    <div
                      key={chord}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        hasChords 
                          ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <div className="text-xs text-gray-500 dark:text-gray-400">{romanNumerals[index]}</div>
                      <div>{chord}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {chordsInKey.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {filterRoot || filterQuality || filterVoicing 
                  ? 'No chords match your filters' 
                  : `No chords found in ${selectedKey} ${selectedKey.endsWith('m') ? 'Minor' : 'Major'}`
                }
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                {filterRoot || filterQuality || filterVoicing 
                  ? 'Try adjusting your filters or add more chords to your library.'
                  : `Add some chords to your library that match the ${selectedKey} ${selectedKey.endsWith('m') ? 'Minor' : 'Major'} scale!`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chordsInKey.map(chord => (
                <div
                  key={chord.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{chord.name}</h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {chord.rootNote && chord.chordQuality && chord.chordVoicing ? `${chord.rootNote} ${chord.chordQuality} (${chord.chordVoicing})` : 'Custom Chord'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Fretboard 
                      frets={chord.frets}
                      fingering={chord.fingering}
                      position={chord.position}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedKey && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎼</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a key to get started</h4>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a musical key from the dropdown above to see which chords from your library are available in that key.
          </p>
        </div>
      )}
    </div>
  );
};

// Edit Chord Modal Component
interface EditChordModalProps {
  chord: any;
  onSave: (chord: any) => void;
  onClose: () => void;
}

const EditChordModal: React.FC<EditChordModalProps> = ({ chord, onSave, onClose }) => {
  const [editName, setEditName] = useState(chord.name);
  const [editRootNote, setEditRootNote] = useState(chord.rootNote || '');
  const [editChordQuality, setEditChordQuality] = useState(chord.chordQuality || '');
  const [editChordVoicing, setEditChordVoicing] = useState(chord.chordVoicing || '');
  const [editPosition, setEditPosition] = useState(chord.position);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!editName.trim()) {
      alert('Please enter a display name');
      return;
    }
    
    if (!editRootNote) {
      alert('Please select a root note');
      return;
    }
    
    if (!editChordQuality) {
      alert('Please select a chord quality');
      return;
    }
    
    if (!editChordVoicing) {
      alert('Please select a chord voicing');
      return;
    }

    const updatedChord = {
      ...chord,
      name: editName.trim(),
      rootNote: editRootNote,
      chordQuality: editChordQuality,
      chordVoicing: editChordVoicing,
      position: editPosition
    };

    onSave(updatedChord);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this chord? This action cannot be undone.')) {
      // Find the parent component's deleteChord function
      const customChords = JSON.parse(localStorage.getItem('customChords') || '[]');
      const updatedChords = customChords.filter((c: any) => c.id !== chord.id);
      localStorage.setItem('customChords', JSON.stringify(updatedChords));
      
      // Close modal and trigger a page refresh to update the chord library
      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Edit Chord
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Root Note
            </label>
            <select
              value={editRootNote}
              onChange={(e) => setEditRootNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select root note</option>
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chord Quality
            </label>
            <select
              value={editChordQuality}
              onChange={(e) => setEditChordQuality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select quality</option>
              {['Major', 'Minor', 'Maj7', 'Min7', 'Diminished', 'Augmented', 'Sus2', 'Sus4', '7', '9', '13', 'Power Chord', 'Custom'].map(quality => (
                <option key={quality} value={quality}>{quality}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chord Voicing
            </label>
            <select
              value={editChordVoicing}
              onChange={(e) => setEditChordVoicing(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select voicing</option>
              {['Open', 'Barre', 'Power', 'Triad', 'Custom'].map(voicing => (
                <option key={voicing} value={voicing}>{voicing}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Starting Position
            </label>
            <select
              value={editPosition}
              onChange={(e) => setEditPosition(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(fret => (
                <option key={fret} value={fret}>{fret}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;