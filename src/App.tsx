import React, { useState } from 'react';
import { Search, Music, GitBranch, Settings } from 'lucide-react';
import ChordDisplay from './components/ChordDisplay';
import ScaleDisplay from './components/ScaleDisplay';
import ChordProgressionTransposer from './components/ChordProgressionTransposer';
import { chords } from './data/chords';
import { scales } from './data/scales';

function App() {
  const [activeTab, setActiveTab] = useState('chords');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicingType, setSelectedVoicingType] = useState('all');

  const filteredChords = chords.filter(chord =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(chord => ({
    ...chord,
    voicings: selectedVoicingType === 'all' 
      ? chord.voicings 
      : chord.voicings.filter(v => v.type === selectedVoicingType)
  })).filter(chord => chord.voicings.length > 0);

  const filteredScales = scales.filter(scale =>
    scale.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'chords', name: 'Chords', icon: Music },
    { id: 'scales', name: 'Scales', icon: GitBranch },
    { id: 'transpose', name: 'Transpose', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-600 p-2 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-amber-900">Guitar Reference</h1>
            </div>
            
            {/* Search Bar */}
            {activeTab !== 'transpose' && (
              <div className="flex items-center space-x-4 flex-1 max-w-md mx-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                {activeTab === 'chords' && (
                  <select
                    value={selectedVoicingType}
                    onChange={(e) => setSelectedVoicingType(e.target.value)}
                    className="px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Types</option>
                    <option value="open">Open</option>
                    <option value="barre">Barre</option>
                    <option value="power">Power</option>
                    <option value="octave">Octave</option>
                  </select>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'chords' && (
          <div>
            {filteredChords.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chords found</h3>
                <p className="text-gray-500">Try adjusting your search or filter settings.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredChords.map((chord, index) => (
                  <ChordDisplay key={index} chord={chord} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scales' && (
          <div>
            {filteredScales.length === 0 ? (
              <div className="text-center py-12">
                <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scales found</h3>
                <p className="text-gray-500">Try adjusting your search term.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredScales.map((scale, index) => (
                  <ScaleDisplay key={index} scale={scale} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'transpose' && (
          <div>
            <ChordProgressionTransposer />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;