import React, { useState, useEffect } from 'react';
import { Guitar, Moon, Sun, Plus, Library, RefreshCw, Edit, Trash2, Download, Upload, Music } from 'lucide-react';
import { CustomChordBuilder } from './components/CustomChordBuilder';
import Fretboard from './components/Fretboard';
import guitarIcon from './guitar.jpg';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [capoFret, setCapoFret] = useState(0);

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
    { id: 'keys', name: 'Keys', icon: Music },
    { id: 'scales', name: 'Scales', icon: RefreshCw },
    { id: 'theory', name: 'Theory', icon: Music },
    { id: 'jam', name: 'Jam', icon: Guitar },
    { id: 'saved', name: 'Saved Jams', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-teal-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={guitarIcon} alt="Guitar" className="w-10 h-10 rounded" />
              <h1 className="text-xl font-bold text-teal-900 dark:text-teal-100">Corduroy</h1>
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

        {activeTab === 'scales' && (
          <div>
            <ScaleBrowser />
          </div>
        )}

        {activeTab === 'theory' && (
          <div>
            <TheoryTab />
          </div>
        )}

        {activeTab === 'jam' && (
          <div>
            <JamWorkspace capoFret={capoFret} setCapoFret={setCapoFret} />
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <SavedJamsTab />
          </div>
        )}
      </div>
    </div>
  );
}

// Toast Component
const Toast: React.FC<{ message: string; isVisible: boolean; onClose: () => void }> = ({ message, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-teal-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-teal-100 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

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
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

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

  const getCapoChord = (chordName: string, capoFret: number) => {
    if (capoFret === 0) return chordName;
    
    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Extract the root note from the chord name
    let rootNote = '';
    let chordQuality = '';
    
    // Handle different chord naming patterns
    if (chordName.includes('maj') || chordName.includes('Maj')) {
      rootNote = chordName.replace('maj', '').replace('Maj', '');
      chordQuality = 'maj';
    } else if (chordName.includes('m') || chordName.includes('min')) {
      rootNote = chordName.replace('m', '').replace('min', '');
      chordQuality = 'm';
    } else if (chordName.includes('dim')) {
      rootNote = chordName.replace('dim', '');
      chordQuality = 'dim';
    } else if (chordName.includes('aug')) {
      rootNote = chordName.replace('aug', '');
      chordQuality = 'aug';
    } else if (chordName.includes('7')) {
      rootNote = chordName.replace('7', '');
      chordQuality = '7';
    } else {
      // Assume major chord if no quality specified
      rootNote = chordName;
      chordQuality = '';
    }
    
    // Find the root note index
    const rootIndex = NOTES.indexOf(rootNote);
    if (rootIndex === -1) return chordName; // Can't determine, return original
    
    // Calculate new root note with capo
    const newRootIndex = (rootIndex + capoFret) % 12;
    const newRootNote = NOTES[newRootIndex];
    
    // Reconstruct chord name
    return newRootNote + chordQuality;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRoot('');
    setFilterQuality('');
    setFilterVoicing('');
  };

  const addChordToJam = (chord: any) => {
    const existingJamChords = JSON.parse(localStorage.getItem('jamWorkspace') || '[]');
    
    // Check for duplicates based on name, frets, and position
    const isDuplicate = existingJamChords.some((existingChord: any) => 
      existingChord.name === chord.name &&
      JSON.stringify(existingChord.frets) === JSON.stringify(chord.frets) &&
      existingChord.position === chord.position
    );
    
    if (isDuplicate) {
      setToastMessage(`${chord.name} is already in your Jam workspace!`);
      setShowToast(true);
      return;
    }
    
    const newChord = { ...chord, id: `${chord.id}-${Date.now()}` };
    const updatedJamChords = [...existingJamChords, newChord];
    localStorage.setItem('jamWorkspace', JSON.stringify(updatedJamChords));
    
    // Show toast notification
    setToastMessage(`Added ${chord.name} to Jam workspace!`);
    setShowToast(true);
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
    <>
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
        </div>
        
        {customChords.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎸</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No custom chords yet</h4>
          <p className="text-gray-500 dark:text-gray-400">Create your first custom chord in the "Add Chord" tab!</p>
        </div>
      ) : (
        <>
          <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => addChordToJam(chord)}
                        className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 p-1 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        title="Add to Jam"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(chord)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Edit chord"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
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

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
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
        
        // Extract root note and quality from chord display name
        const chordRoot = chord.rootNote?.toLowerCase() || '';
        const chordQuality = chord.chordQuality?.toLowerCase() || '';
        
        // Extract root note and quality from target chord name
        let targetRoot = targetChordName;
        let targetQuality = '';
        
        if (targetChordName.endsWith('m')) {
          targetRoot = targetChordName.slice(0, -1);
          targetQuality = 'minor';
        } else if (targetChordName.endsWith('dim')) {
          targetRoot = targetChordName.slice(0, -3);
          targetQuality = 'diminished';
        } else {
          targetQuality = 'major';
        }
        
        // Match root note and quality
        if (chordRoot === targetRoot && chordQuality === targetQuality) {
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



// Saved Jams Tab Component
const SavedJamsTab: React.FC = () => {
  const [savedJams, setSavedJams] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    const jams = JSON.parse(localStorage.getItem('savedJams') || '[]');
    setSavedJams(jams);
  }, []);

  // Listen for changes to saved jams
  React.useEffect(() => {
    const handleStorageChange = () => {
      const jams = JSON.parse(localStorage.getItem('savedJams') || '[]');
      setSavedJams(jams);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadJam = (jam: any) => {
    // Load the jam into the jam workspace
    localStorage.setItem('jamWorkspace', JSON.stringify(jam.chords));
    
    // Also save the capo state to localStorage so the Jam tab can restore it
    if (jam.capoFret !== undefined) {
      localStorage.setItem('jamCapoFret', jam.capoFret.toString());
    } else {
      localStorage.removeItem('jamCapoFret');
    }
    
    setToastMessage(`Loaded jam "${jam.name}" into Jam workspace!`);
    setShowToast(true);
  };

  const deleteJam = (jamId: string) => {
    if (window.confirm('Are you sure you want to delete this jam? This action cannot be undone.')) {
      const updatedJams = savedJams.filter((jam: any) => jam.id !== jamId);
      localStorage.setItem('savedJams', JSON.stringify(updatedJams));
      setSavedJams(updatedJams);
      setToastMessage('Jam deleted successfully');
      setShowToast(true);
    }
  };

  const exportJams = () => {
    try {
      const jams = localStorage.getItem('savedJams') || '[]';
      const blob = new Blob([jams], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `corduroy-jams-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToastMessage('Jams exported successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Export failed:', error);
      setToastMessage('Failed to export jams. Please try again.');
      setShowToast(true);
    }
  };

  const importJams = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedJams = JSON.parse(content);

        if (!Array.isArray(importedJams)) {
          throw new Error('Invalid file format');
        }

        // Validate jam structure
        const validJams = importedJams.filter((jam: any) =>
          jam.id && jam.name && jam.chords && Array.isArray(jam.chords)
        );

        if (validJams.length === 0) {
          throw new Error('No valid jams found in file');
        }

        // Merge with existing jams (avoid duplicates by ID)
        const existingJams = JSON.parse(localStorage.getItem('savedJams') || '[]');
        const existingIds = new Set(existingJams.map((j: any) => j.id));
        const newJams = validJams.filter((jam: any) => !existingIds.has(jam.id));

        const mergedJams = [...existingJams, ...newJams];
        localStorage.setItem('savedJams', JSON.stringify(mergedJams));
        setSavedJams(mergedJams);

        setToastMessage(`Successfully imported ${newJams.length} new jams!`);
        setShowToast(true);
      } catch (error) {
        console.error('Import failed:', error);
        setToastMessage('Failed to import jams. Please check the file format.');
        setShowToast(true);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Saved Jams
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your saved chord progressions and jams.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportJams}
            className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors duration-200"
            title="Export jams to file"
          >
            <Download className="w-5 h-5" />
          </button>
          <label className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              accept=".json"
              onChange={importJams}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {savedJams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎼</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No saved jams yet</h4>
          <p className="text-gray-500 dark:text-gray-400">
            Create some jams in the Jam tab and save them to see them here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJams.map((jam) => (
            <div
              key={jam.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{jam.name}</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {jam.chords.length} chord{jam.chords.length !== 1 ? 's' : ''} • {new Date(jam.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadJam(jam)}
                    className="p-1 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                    title="Load jam"
                  >
                    ↻
                  </button>
                  <button
                    onClick={() => deleteJam(jam.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete jam"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {jam.chords.slice(0, 3).map((chord: any) => chord.name).join(' • ')}
                {jam.chords.length > 3 && ' • ...'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

// Scale Browser Component
const ScaleBrowser: React.FC = () => {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedScale, setSelectedScale] = useState('major');
  const [selectedPosition, setSelectedPosition] = useState(1);
  const [showAllPositions, setShowAllPositions] = useState(false);

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const SCALES = {
    major: {
      name: 'Major',
      intervals: [0, 2, 4, 5, 7, 9, 11],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 3', startFret: 4, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 4', startFret: 5, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 5', startFret: 7, pattern: [0, 2, 4, 5, 7, 9, 11] }
      ]
    },
    minor: {
      name: 'Natural Minor',
      intervals: [0, 2, 3, 5, 7, 8, 10],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 3', startFret: 3, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 4', startFret: 5, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 5', startFret: 7, pattern: [0, 2, 3, 5, 7, 8, 10] }
      ]
    },
    pentatonic: {
      name: 'Major Pentatonic',
      intervals: [0, 2, 4, 7, 9],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 3', startFret: 4, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 4', startFret: 7, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 5', startFret: 9, pattern: [0, 2, 4, 7, 9] }
      ]
    },
    pentatonicMinor: {
      name: 'Minor Pentatonic',
      intervals: [0, 3, 5, 7, 10],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 2', startFret: 3, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 3', startFret: 5, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 4', startFret: 7, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 5', startFret: 10, pattern: [0, 3, 5, 7, 10] }
      ]
    },
    dorian: {
      name: 'Dorian',
      intervals: [0, 2, 3, 5, 7, 9, 10],
      positions: [
        { name: 'Position 1', startFret: 0, pattern: [0, 2, 3, 5, 7, 9, 10] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 3, 5, 7, 9, 10] },
        { name: 'Position 3', startFret: 3, pattern: [0, 2, 3, 5, 7, 9, 10] },
        { name: 'Position 4', startFret: 5, pattern: [0, 2, 3, 5, 7, 9, 10] },
        { name: 'Position 5', startFret: 7, pattern: [0, 2, 3, 5, 7, 9, 10] }
      ]
    },
    mixolydian: {
      name: 'Mixolydian',
      intervals: [0, 2, 4, 5, 7, 9, 10],
      positions: [
        { name: 'Position 1', startFret: 0, pattern: [0, 2, 4, 5, 7, 9, 10] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 4, 5, 7, 9, 10] },
        { name: 'Position 3', startFret: 4, pattern: [0, 2, 4, 5, 7, 9, 10] },
        { name: 'Position 4', startFret: 5, pattern: [0, 2, 4, 5, 7, 9, 10] },
        { name: 'Position 5', startFret: 7, pattern: [0, 2, 4, 5, 7, 9, 10] }
      ]
    }
  };

  const getNoteIndex = (note: string) => {
    return NOTES.indexOf(note);
  };

  const getScaleNotes = (root: string, scaleType: string) => {
    const rootIndex = getNoteIndex(root);
    const scale = SCALES[scaleType as keyof typeof SCALES];
    if (!scale) return [];
    
    return scale.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTES[noteIndex];
    });
  };

  const getFretboardNotes = (root: string, scaleType: string, position: number) => {
    const scale = SCALES[scaleType as keyof typeof SCALES];
    if (!scale) return [];
    
    const positionData = scale.positions[position - 1];
    if (!positionData) return [];
    
    const rootIndex = getNoteIndex(root);
    const scaleNotes = getScaleNotes(root, scaleType);
    
    // Define string tunings (E, A, D, G, B, E)
    const stringTunings = ['E', 'A', 'D', 'G', 'B', 'E'];
    
    const fretboard = stringTunings.map((stringNote, stringIndex) => {
      const stringNoteIndex = getNoteIndex(stringNote);
      const frets = [];
      
      // Check each fret from 0 to 15
      for (let fret = 0; fret <= 15; fret++) {
        const noteIndex = (stringNoteIndex + fret) % 12;
        const note = NOTES[noteIndex];
        
        if (scaleNotes.includes(note)) {
          // Check if this note is in the current position
          const relativeToRoot = (noteIndex - rootIndex + 12) % 12;
          if (positionData.pattern.includes(relativeToRoot)) {
            frets.push({
              fret,
              note,
              isRoot: note === root,
              isInPosition: true
            });
          }
        }
      }
      
      return { string: stringIndex, frets };
    });
    
    return fretboard;
  };

  const renderFretboard = (root: string, scaleType: string, position: number) => {
    const fretboard = getFretboardNotes(root, scaleType, position);
    const scaleNotes = getScaleNotes(root, scaleType);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {root} {SCALES[scaleType as keyof typeof SCALES]?.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Notes: {scaleNotes.join(' - ')} • Frets 0-15
          </p>
        </div>
        
        <div className="relative overflow-x-auto">
          {/* Fretboard */}
          <div className="fretboard-grid border-2 border-gray-800 dark:border-gray-200 rounded-lg">
            {/* String labels */}
            <div className="flex flex-col">
              <div className="fretboard-cell text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                String
              </div>
              {['E', 'A', 'D', 'G', 'B', 'E'].map((note, i) => (
                <div key={i} className="fretboard-cell text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                  {note}
                </div>
              ))}
            </div>
            
            {/* Fret numbers and notes */}
            {Array.from({ length: 16 }, (_, fret) => (
              <div key={fret} className="flex flex-col">
                <div className="fretboard-cell text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                  {fret}
                </div>
                {fretboard.map((string, stringIndex) => {
                  const fretData = string.frets.find(f => f.fret === fret);
                  return (
                    <div
                      key={stringIndex}
                      className={`fretboard-cell text-xs relative ${
                        fretData ? 'bg-teal-100 dark:bg-teal-900' : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      {fretData && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                          fretData.isRoot 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200'
                        }`}>
                          {fretData.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Scale Browser
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore different scales and their positions on the guitar fretboard.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Root Note
          </label>
          <select
            value={selectedRoot}
            onChange={(e) => setSelectedRoot(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {NOTES.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Scale Type
          </label>
          <select
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Object.entries(SCALES).map(([key, scale]) => (
              <option key={key} value={key}>{scale.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position
          </label>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {SCALES[selectedScale as keyof typeof SCALES]?.positions.map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Position {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showAllPositions}
              onChange={(e) => setShowAllPositions(e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Show all positions
            </span>
          </label>
        </div>
      </div>

      {/* Scale Display */}
      {showAllPositions ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SCALES[selectedScale as keyof typeof SCALES]?.positions.map((_, index) => (
            <div key={index + 1}>
              {renderFretboard(selectedRoot, selectedScale, index + 1)}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {renderFretboard(selectedRoot, selectedScale, selectedPosition)}
        </div>
      )}
    </div>
  );
};

// Theory Tab Component
const TheoryTab: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedScale, setSelectedScale] = useState('major');
  const [selectedPosition, setSelectedPosition] = useState(1);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const [customChords, setCustomChords] = useState<any[]>([]);
  const [capoFret, setCapoFret] = useState(0);

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const SCALES = {
    major: {
      name: 'Major',
      intervals: [0, 2, 4, 5, 7, 9, 11],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 3', startFret: 4, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 4', startFret: 5, pattern: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Position 5', startFret: 7, pattern: [0, 2, 4, 5, 7, 9, 11] }
      ]
    },
    minor: {
      name: 'Natural Minor',
      intervals: [0, 2, 3, 5, 7, 8, 10],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 3', startFret: 3, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 4', startFret: 5, pattern: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Position 5', startFret: 7, pattern: [0, 2, 3, 5, 7, 8, 10] }
      ]
    },
    pentatonic: {
      name: 'Major Pentatonic',
      intervals: [0, 2, 4, 7, 9],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 2', startFret: 2, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 3', startFret: 4, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 4', startFret: 7, pattern: [0, 2, 4, 7, 9] },
        { name: 'Position 5', startFret: 9, pattern: [0, 2, 4, 7, 9] }
      ]
    },
    pentatonicMinor: {
      name: 'Minor Pentatonic',
      intervals: [0, 3, 5, 7, 10],
      positions: [
        { name: 'Position 1 (Open)', startFret: 0, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 2', startFret: 3, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 3', startFret: 5, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 4', startFret: 7, pattern: [0, 3, 5, 7, 10] },
        { name: 'Position 5', startFret: 10, pattern: [0, 3, 5, 7, 10] }
      ]
    }
  };

  const musicalKeys = {
    'C Major': ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
    'G Major': ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
    'D Major': ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
    'A Major': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
    'E Major': ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
    'B Major': ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
    'F# Major': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#dim'],
    'C# Major': ['C#', 'D#m', 'E#m', 'F#', 'G#', 'A#m', 'B#dim'],
    'F Major': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
    'Bb Major': ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
    'Eb Major': ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'],
    'Ab Major': ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'],
    'Db Major': ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'],
    'Gb Major': ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim'],
    'Cb Major': ['Cb', 'Dbm', 'Ebm', 'Fb', 'Gb', 'Abm', 'Bbdim'],
    'A Minor': ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'],
    'E Minor': ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D'],
    'B Minor': ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A'],
    'F# Minor': ['F#m', 'G#dim', 'A', 'Bm', 'C#m', 'D', 'E'],
    'C# Minor': ['C#m', 'D#dim', 'E', 'F#m', 'G#m', 'A', 'B'],
    'G# Minor': ['G#m', 'A#dim', 'B', 'C#m', 'D#m', 'E', 'F#'],
    'D# Minor': ['D#m', 'E#dim', 'F#', 'G#m', 'A#m', 'B', 'C#'],
    'A# Minor': ['A#m', 'B#dim', 'C#', 'D#m', 'E#m', 'F#', 'G#'],
    'D Minor': ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C'],
    'G Minor': ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
    'C Minor': ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
    'F Minor': ['Fm', 'Gdim', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
    'Bb Minor': ['Bbm', 'Cdim', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'],
    'Eb Minor': ['Ebm', 'Fdim', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db'],
    'Ab Minor': ['Abm', 'Bbdim', 'Cb', 'Dbm', 'Ebm', 'Fb', 'Gb']
  };

  React.useEffect(() => {
    const chords = JSON.parse(localStorage.getItem('customChords') || '[]');
    setCustomChords(chords);
  }, []);

  const getNoteIndex = (note: string) => {
    return NOTES.indexOf(note);
  };

  const getScaleNotes = (root: string, scaleType: string) => {
    const rootIndex = getNoteIndex(root);
    const scale = SCALES[scaleType as keyof typeof SCALES];
    if (!scale) return [];
    
    return scale.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTES[noteIndex];
    });
  };

  const getFretboardNotes = (root: string, scaleType: string, position: number) => {
    const scale = SCALES[scaleType as keyof typeof SCALES];
    if (!scale) return [];
    
    const positionData = scale.positions[position - 1];
    if (!positionData) return [];
    
    const rootIndex = getNoteIndex(root);
    const scaleNotes = getScaleNotes(root, scaleType);
    
    // Define string tunings (E, A, D, G, B, E)
    const stringTunings = ['E', 'A', 'D', 'G', 'B', 'E'];
    
    const fretboard = stringTunings.map((stringNote, stringIndex) => {
      const stringNoteIndex = getNoteIndex(stringNote);
      const frets = [];
      
      // Check each fret from 0 to 15
      for (let fret = 0; fret <= 15; fret++) {
        const noteIndex = (stringNoteIndex + fret) % 12;
        const note = NOTES[noteIndex];
        
        if (scaleNotes.includes(note)) {
          // Check if this note is in the current position
          const relativeToRoot = (noteIndex - rootIndex + 12) % 12;
          if (positionData.pattern.includes(relativeToRoot)) {
            frets.push({
              fret,
              note,
              isRoot: note === root,
              isInPosition: true
            });
          }
        }
      }
      
      return { string: stringIndex, frets };
    });
    
    return fretboard;
  };

  const getChordsInKey = (key: string) => {
    if (!key || !musicalKeys[key as keyof typeof musicalKeys]) return [];
    
    const keyChords = musicalKeys[key as keyof typeof musicalKeys];
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
        
        // Extract root note and quality from chord display name
        const chordRoot = chord.rootNote?.toLowerCase() || '';
        const chordQuality = chord.chordQuality?.toLowerCase() || '';
        
        // Extract root note and quality from target chord name
        let targetRoot = targetChordName;
        let targetQuality = '';
        
        if (targetChordName.endsWith('m')) {
          targetRoot = targetChordName.slice(0, -1);
          targetQuality = 'minor';
        } else if (targetChordName.endsWith('dim')) {
          targetRoot = targetChordName.slice(0, -3);
          targetQuality = 'diminished';
        } else {
          targetQuality = 'major';
        }
        
        // Match root note and quality
        if (chordRoot === targetRoot && chordQuality === targetQuality) {
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

    return chordsInKey;
  };

  const renderFretboard = (root: string, scaleType: string, position: number) => {
    const fretboard = getFretboardNotes(root, scaleType, position);
    const scaleNotes = getScaleNotes(root, scaleType);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {root} {SCALES[scaleType as keyof typeof SCALES]?.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Notes: {scaleNotes.join(' - ')} • Frets 0-15
          </p>
        </div>
        
        <div className="relative overflow-x-auto">
          {/* Fretboard */}
          <div className="fretboard-grid border-2 border-gray-800 dark:border-gray-200 rounded-lg">
            {/* String labels */}
            <div className="flex flex-col">
              <div className="fretboard-cell text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                String
              </div>
              {['E', 'A', 'D', 'G', 'B', 'E'].map((note, i) => (
                <div key={i} className="fretboard-cell text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                  {note}
                </div>
              ))}
            </div>
            
            {/* Fret numbers and notes */}
            {Array.from({ length: 16 }, (_, fret) => (
              <div key={fret} className="flex flex-col">
                <div className="fretboard-cell text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                  {fret}
                </div>
                {fretboard.map((string, stringIndex) => {
                  const fretData = string.frets.find(f => f.fret === fret);
                  return (
                    <div
                      key={stringIndex}
                      className={`fretboard-cell text-xs relative ${
                        fretData ? 'bg-teal-100 dark:bg-teal-900' : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      {fretData && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                          fretData.isRoot 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200'
                        }`}>
                          {fretData.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getKeyRoot = (keyName: string) => {
    return keyName.split(' ')[0];
  };

  const getKeyType = (keyName: string) => {
    return keyName.includes('Minor') ? 'minor' : 'major';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Music Theory
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore keys, scales, and chords together. Choose a key to see its scale and available chords.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Musical Key
          </label>
          <select
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value);
              if (e.target.value) {
                const keyRoot = getKeyRoot(e.target.value);
                const keyType = getKeyType(e.target.value);
                setSelectedScale(keyType);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select a key...</option>
            {Object.keys(musicalKeys).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Scale Type
          </label>
          <select
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
            disabled={!selectedKey}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
          >
            {Object.entries(SCALES).map(([key, scale]) => (
              <option key={key} value={key}>{scale.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position
          </label>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(Number(e.target.value))}
            disabled={!selectedKey}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
          >
            {SCALES[selectedScale as keyof typeof SCALES]?.positions.map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Position {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showAllPositions}
              onChange={(e) => setShowAllPositions(e.target.checked)}
              disabled={!selectedKey}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Show all positions
            </span>
          </label>
        </div>
      </div>

             {/* Scale Display */}
       {selectedKey && (
         <div className="mb-8">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
             Scale: {getKeyRoot(selectedKey)} {SCALES[selectedScale as keyof typeof SCALES]?.name}
           </h3>
           
           {/* Chord Progression */}
           <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
             <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chord Progression:</h4>
             <div className="flex flex-wrap gap-2">
               {musicalKeys[selectedKey as keyof typeof musicalKeys]?.map((chord, index) => {
                 const isMajor = selectedKey.includes('Major');
                 const romanNumerals = isMajor 
                   ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
                   : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
                 
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
          
          {showAllPositions ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SCALES[selectedScale as keyof typeof SCALES]?.positions.map((_, index) => (
                <div key={index + 1}>
                  {renderFretboard(getKeyRoot(selectedKey), selectedScale, index + 1)}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {renderFretboard(getKeyRoot(selectedKey), selectedScale, selectedPosition)}
            </div>
          )}
        </div>
      )}

      {/* Chords in Key */}
      {selectedKey && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Chords in {selectedKey}
          </h3>
          
          {(() => {
            const chordsInKey = getChordsInKey(selectedKey);
            return chordsInKey.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-3xl mb-2">🎵</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No chords found for {selectedKey}. Add some chords to your library!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {chordsInKey.map(chord => (
                  <div
                    key={chord.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{chord.name}</h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {chord.rootNote} {chord.chordQuality} • {chord.chordVoicing}
                        </div>
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
            );
          })()}
        </div>
      )}

      {!selectedKey && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎼</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Choose a musical key to get started
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Select a key from the dropdown above to explore its scale and available chords.
          </p>
        </div>
      )}
    </div>
  );
};

// Jam Workspace Component
const JamWorkspace: React.FC<{ capoFret: number; setCapoFret: (fret: number) => void }> = ({ capoFret, setCapoFret }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedChords, setSelectedChords] = useState<any[]>(() => {
    const saved = localStorage.getItem('jamWorkspace');
    return saved ? JSON.parse(saved) : [];
  });
  const [customChords, setCustomChords] = useState<any[]>(() => {
    const saved = localStorage.getItem('customChords');
    return saved ? JSON.parse(saved) : [];
  });
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [jamName, setJamName] = useState('');

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

  // Listen for changes to jam workspace and restore capo state if available
  React.useEffect(() => {
    const handleJamWorkspaceChange = () => {
      const savedCapo = localStorage.getItem('jamCapoFret');
      if (savedCapo !== null) {
        setCapoFret(parseInt(savedCapo));
        localStorage.removeItem('jamCapoFret'); // Clean up after restoring
      }
    };

    // Check for capo state when component mounts
    handleJamWorkspaceChange();

    // Listen for storage events
    window.addEventListener('storage', handleJamWorkspaceChange);
    return () => window.removeEventListener('storage', handleJamWorkspaceChange);
  }, [setCapoFret]);

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const QUALITIES = ['Major', 'Minor', 'Maj7', 'Min7', 'Diminished', 'Augmented', 'Sus2', 'Sus4', '7', '9', '13', 'Power Chord', 'Custom'];
  const VOICINGS = ['Open', 'Barre', 'Power', 'Triad', 'Custom'];

  // Filter chords based on search query
  const filteredChords = customChords.filter((chord) => {
    const matchesQuery = searchQuery.trim().length === 0 || 
      (chord.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chord.rootNote || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chord.chordQuality || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  const sortedChords = [...filteredChords].sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    
    // If both names start with the same letter, handle musical note ordering
    if (aName[0] === bName[0]) {
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

  const addChordToWorkspace = (chord: any) => {
    setSelectedChords(prev => {
      // Check for duplicates based on name, frets, and position
      const isDuplicate = prev.some((existingChord: any) => 
        existingChord.name === chord.name &&
        JSON.stringify(existingChord.frets) === JSON.stringify(chord.frets) &&
        existingChord.position === chord.position
      );
      
      if (isDuplicate) {
        setToastMessage(`${chord.name} is already in your workspace!`);
        setShowToast(true);
        return prev;
      }
      
      const newChords = [...prev, { ...chord, id: `${chord.id}-${Date.now()}` }];
      localStorage.setItem('jamWorkspace', JSON.stringify(newChords));
      return newChords;
    });
  };

  const removeChordFromWorkspace = (chordId: string) => {
    setSelectedChords(prev => {
      const newChords = prev.filter(chord => chord.id !== chordId);
      localStorage.setItem('jamWorkspace', JSON.stringify(newChords));
      return newChords;
    });
  };

  const clearWorkspace = () => {
    setSelectedChords([]);
    localStorage.removeItem('jamWorkspace');
    setCapoFret(0); // Reset capo to 0 (no capo)
  };

  const saveJam = () => {
    if (!jamName.trim()) {
      setToastMessage('Please enter a name for your jam');
      setShowToast(true);
      return;
    }

    if (selectedChords.length === 0) {
      setToastMessage('No chords to save');
      setShowToast(true);
      return;
    }

    const savedJams = JSON.parse(localStorage.getItem('savedJams') || '[]');
    const newJam = {
      id: Date.now().toString(),
      name: jamName.trim(),
      chords: selectedChords,
      capoFret: capoFret,
      createdAt: new Date().toISOString()
    };

    const updatedJams = [...savedJams, newJam];
    localStorage.setItem('savedJams', JSON.stringify(updatedJams));
    
    setToastMessage(`Jam "${jamName}" saved successfully!`);
    setShowToast(true);
    setShowSaveModal(false);
    setJamName('');
  };

  const loadJam = (jam: any) => {
    setSelectedChords(jam.chords);
    localStorage.setItem('jamWorkspace', JSON.stringify(jam.chords));
    
    // Restore capo state if it was saved with the jam
    if (jam.capoFret !== undefined) {
      setCapoFret(jam.capoFret);
    }
    
    setToastMessage(`Loaded jam "${jam.name}"`);
    setShowToast(true);
  };

  const deleteJam = (jamId: string) => {
    const savedJams = JSON.parse(localStorage.getItem('savedJams') || '[]');
    const updatedJams = savedJams.filter((jam: any) => jam.id !== jamId);
    localStorage.setItem('savedJams', JSON.stringify(updatedJams));
    setToastMessage('Jam deleted successfully');
    setShowToast(true);
  };

  const getCapoChord = (chordName: string, capoFret: number) => {
    if (capoFret === 0) return chordName;
    
    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Extract the root note from the chord name
    let rootNote = '';
    let chordQuality = '';
    
    // Handle different chord naming patterns
    if (chordName.includes('maj') || chordName.includes('Maj')) {
      rootNote = chordName.replace('maj', '').replace('Maj', '');
      chordQuality = 'maj';
    } else if (chordName.includes('m') || chordName.includes('min')) {
      rootNote = chordName.replace('m', '').replace('min', '');
      chordQuality = 'm';
    } else if (chordName.includes('dim')) {
      rootNote = chordName.replace('dim', '');
      chordQuality = 'dim';
    } else if (chordName.includes('aug')) {
      rootNote = chordName.replace('aug', '');
      chordQuality = 'aug';
    } else if (chordName.includes('7')) {
      rootNote = chordName.replace('7', '');
      chordQuality = '7';
    } else {
      // Assume major chord if no quality specified
      rootNote = chordName;
      chordQuality = '';
    }
    
    // Find the root note index
    const rootIndex = NOTES.indexOf(rootNote);
    if (rootIndex === -1) return chordName; // Can't determine, return original
    
    // Calculate new root note with capo
    const newRootIndex = (rootIndex + capoFret) % 12;
    const newRootNote = NOTES[newRootIndex];
    
    // Reconstruct chord name
    return newRootNote + chordQuality;
  };

  const moveChordInWorkspace = (fromIndex: number, toIndex: number) => {
    setSelectedChords(prev => {
      const newChords = [...prev];
      const [movedChord] = newChords.splice(fromIndex, 1);
      newChords.splice(toIndex, 0, movedChord);
      localStorage.setItem('jamWorkspace', JSON.stringify(newChords));
      return newChords;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Jam Workspace
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Search for chords and add them to your temporary workspace for jamming.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Capo Controls */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Capo:
            </label>
            <select
              value={capoFret}
              onChange={(e) => setCapoFret(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={0}>None</option>
              <option value={1}>1st fret</option>
              <option value={2}>2nd fret</option>
              <option value={3}>3rd fret</option>
              <option value={4}>4th fret</option>
              <option value={5}>5th fret</option>
              <option value={6}>6th fret</option>
              <option value={7}>7th fret</option>
              <option value={8}>8th fret</option>
              <option value={9}>9th fret</option>
              <option value={10}>10th fret</option>
              <option value={11}>11th fret</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={selectedChords.length === 0}
              className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Save Jam
            </button>
            <button
              onClick={clearWorkspace}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Clear All
            </button>
            <button
              onClick={refreshChords}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Refresh chords"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Tool */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Search & Add Chords
        </h3>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search chords by name, root note, or quality..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          
          {/* Autocomplete Dropdown */}
          {isSearchFocused && (searchQuery.trim().length > 0 || sortedChords.length > 0) && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-64 overflow-y-auto">
              {sortedChords.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No chords found matching your search.' : 'No chords in your library yet.'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedChords.map(chord => (
                    <div
                      key={chord.id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        addChordToWorkspace(chord);
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{chord.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {chord.rootNote && chord.chordQuality && chord.chordVoicing ? `${chord.rootNote} ${chord.chordQuality} (${chord.chordVoicing})` : 'Custom Chord'}
                        </div>
                      </div>
                      <div className="ml-3 px-2 py-1 bg-teal-600 text-white rounded text-xs">
                        Add
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Workspace Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Workspace ({selectedChords.length} chord{selectedChords.length !== 1 ? 's' : ''})
        </h3>
        
        {selectedChords.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="text-4xl mb-2">🎸</div>
            <p className="text-gray-500 dark:text-gray-400">Add some chords to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedChords.map((chord, index) => (
              <div
                key={chord.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {capoFret > 0 ? getCapoChord(chord.name, capoFret) : chord.name}
                        {capoFret > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            (capo {capoFret})
                          </span>
                        )}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {chord.rootNote && chord.chordQuality && chord.chordVoicing ? `${chord.rootNote} ${chord.chordQuality} (${chord.chordVoicing})` : 'Custom Chord'}
                        {capoFret > 0 && (
                          <span className="ml-2 text-teal-600 dark:text-teal-400">
                            → {getCapoChord(chord.rootNote + ' ' + chord.chordQuality, capoFret)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveChordInWorkspace(index, index - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < selectedChords.length - 1 && (
                      <button
                        onClick={() => moveChordInWorkspace(index, index + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => removeChordFromWorkspace(chord.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div>
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



      {/* Save Jam Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Save Jam
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam Name
              </label>
              <input
                type="text"
                value={jamName}
                onChange={(e) => setJamName(e.target.value)}
                placeholder="Enter a name for your jam..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && saveJam()}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={saveJam}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setJamName('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
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