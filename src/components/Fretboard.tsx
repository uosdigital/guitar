import React from 'react';

interface FretboardProps {
  frets: string[];
  fingering?: string[];
  position?: number;
  className?: string;
}

const Fretboard: React.FC<FretboardProps> = ({ frets, fingering, position, className = '' }) => {
  const strings = ['E', 'A', 'D', 'G', 'B', 'e'];

  const getFretNumber = (fretIndex: number, startFret: number) => {
    return startFret + fretIndex;
  };

  const getFretDisplay = (fret: string, stringIndex: number) => {
    if (fret === 'x') return '✕';
    if (fret === '0') return ''; // Don't show anything for open strings
    return ''; // Don't show fret numbers, only finger positions
  };

  const getFretClass = (fret: string, stringIndex: number) => {
    if (fret === 'x') return 'text-gray-400 dark:text-gray-500';
    if (fret === '0') return 'text-green-600 dark:text-green-400';
    return 'text-blue-600 dark:text-blue-400 font-semibold';
  };

  const isFingerPosition = (fret: string, fretIndex: number, startFret: number) => {
    const fretNum = getFretNumber(fretIndex, startFret);
    return fret === fretNum.toString();
  };

  // Calculate the first fret that's actually played
  const getFirstPlayedFret = () => {
    let firstFret = Infinity;
    frets.forEach(fret => {
      if (fret !== 'x' && fret !== '0') {
        const fretNum = parseInt(fret);
        if (fretNum < firstFret) {
          firstFret = fretNum;
        }
      }
    });
    return firstFret === Infinity ? 0 : firstFret;
  };

  const firstPlayedFret = getFirstPlayedFret();
  const hasOpenStrings = frets.some(fret => fret === '0');
  const maxFrets = 5; // Show 5 frets for better visualization

  return (
    <div className={`inline-block ${className}`}>
      {/* String names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        <div className="w-6"></div> {/* Spacer for fret numbers */}
        {strings.map((string, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-600 dark:text-gray-300">
            {string}
          </div>
        ))}
      </div>

      {/* Fretboard */}
      <div className="border-2 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-800 shadow-lg">
        {/* Nut area - only show if there are open strings */}
        {hasOpenStrings && (
          <div className="grid grid-cols-7 gap-1 p-2 bg-gray-300 dark:bg-gray-500 border-b-2 border-gray-600 dark:border-gray-400">
            <div className="flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
              Nut
            </div>
            {strings.map((_, stringIndex) => {
              const fret = frets[stringIndex];
              return (
                <div key={stringIndex} className="relative flex items-center justify-center h-8">
                  {/* Vertical string line */}
                  <div className="absolute w-0.5 h-full bg-gray-600 dark:bg-gray-400" />
                  
                  {/* Open string content */}
                  <div className="relative z-10 flex items-center justify-center w-6 h-6">
                    {fret === '0' ? (
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">○</span>
                    ) : fret === 'x' ? (
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">✕</span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fret positions - starting from the first played fret */}
        {Array.from({ length: maxFrets }, (_, fretIndex) => {
          const currentFret = firstPlayedFret + fretIndex;
          return (
            <div key={fretIndex} className="grid grid-cols-7 gap-1 p-2 border-b border-gray-400 dark:border-gray-500 last:border-b-0 relative">
              {/* Horizontal fret line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600 dark:bg-gray-400" />
              
              {/* Fret number on the left */}
              <div className="flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                {currentFret}
              </div>
              
              {strings.map((_, stringIndex) => {
                const fret = frets[stringIndex];
                const isFinger = isFingerPosition(fret, fretIndex, firstPlayedFret);
                
                return (
                  <div key={stringIndex} className="relative flex items-center justify-center h-10">
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
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fretboard;
