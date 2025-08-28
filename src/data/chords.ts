export interface ChordVoicing {
  name: string;
  type: 'open' | 'barre' | 'power' | 'octave';
  frets: string[];
  fingering?: string[];
  position?: number;
}

export interface Chord {
  name: string;
  voicings: ChordVoicing[];
}

export const chords: Chord[] = [
  {
    name: 'C Major',
    voicings: [
      {
        name: 'Open C',
        type: 'open',
        frets: ['x', '3', '2', '0', '1', '0'],
        fingering: ['x', '3', '2', 'x', '1', 'x']
      },
      {
        name: 'C Barre (8th fret)',
        type: 'barre',
        frets: ['8', '8', '10', '10', '9', '8'],
        fingering: ['1', '1', '3', '4', '2', '1'],
        position: 8
      },
      {
        name: 'C Power Chord',
        type: 'power',
        frets: ['x', '3', '5', '5', 'x', 'x'],
        fingering: ['x', '1', '3', '4', 'x', 'x']
      }
    ]
  },
  {
    name: 'G Major',
    voicings: [
      {
        name: 'Open G',
        type: 'open',
        frets: ['3', '2', '0', '0', '3', '3'],
        fingering: ['3', '1', 'x', 'x', '3', '4']
      },
      {
        name: 'G Barre (3rd fret)',
        type: 'barre',
        frets: ['3', '5', '5', '4', '3', '3'],
        fingering: ['1', '3', '4', '2', '1', '1'],
        position: 3
      },
      {
        name: 'G Power Chord',
        type: 'power',
        frets: ['3', '5', '5', 'x', 'x', 'x'],
        fingering: ['1', '3', '4', 'x', 'x', 'x']
      }
    ]
  },
  {
    name: 'A Minor',
    voicings: [
      {
        name: 'Open Am',
        type: 'open',
        frets: ['x', '0', '2', '2', '1', '0'],
        fingering: ['x', 'x', '2', '3', '1', 'x']
      },
      {
        name: 'Am Barre (5th fret)',
        type: 'barre',
        frets: ['5', '7', '7', '5', '5', '5'],
        fingering: ['1', '3', '4', '1', '1', '1'],
        position: 5
      },
      {
        name: 'Am Power Chord',
        type: 'power',
        frets: ['x', '0', '2', '2', 'x', 'x'],
        fingering: ['x', 'x', '1', '2', 'x', 'x']
      }
    ]
  },
  {
    name: 'F Major',
    voicings: [
      {
        name: 'F Barre (1st fret)',
        type: 'barre',
        frets: ['1', '3', '3', '2', '1', '1'],
        fingering: ['1', '3', '4', '2', '1', '1'],
        position: 1
      },
      {
        name: 'F Power Chord',
        type: 'power',
        frets: ['1', '3', '3', 'x', 'x', 'x'],
        fingering: ['1', '3', '4', 'x', 'x', 'x']
      },
      {
        name: 'Easy F',
        type: 'open',
        frets: ['1', 'x', '3', '2', '1', '1'],
        fingering: ['1', 'x', '4', '3', '1', '1']
      }
    ]
  },
  {
    name: 'D Major',
    voicings: [
      {
        name: 'Open D',
        type: 'open',
        frets: ['x', 'x', '0', '2', '3', '2'],
        fingering: ['x', 'x', 'x', '1', '3', '2']
      },
      {
        name: 'D Barre (10th fret)',
        type: 'barre',
        frets: ['10', '12', '12', '11', '10', '10'],
        fingering: ['1', '3', '4', '2', '1', '1'],
        position: 10
      },
      {
        name: 'D Power Chord',
        type: 'power',
        frets: ['x', 'x', '0', '2', '3', 'x'],
        fingering: ['x', 'x', 'x', '1', '2', 'x']
      }
    ]
  },
  {
    name: 'E Major',
    voicings: [
      {
        name: 'Open E',
        type: 'open',
        frets: ['0', '2', '2', '1', '0', '0'],
        fingering: ['x', '2', '3', '1', 'x', 'x']
      },
      {
        name: 'E Barre (12th fret)',
        type: 'barre',
        frets: ['12', '14', '14', '13', '12', '12'],
        fingering: ['1', '3', '4', '2', '1', '1'],
        position: 12
      },
      {
        name: 'E Power Chord',
        type: 'power',
        frets: ['0', '2', '2', 'x', 'x', 'x'],
        fingering: ['x', '1', '2', 'x', 'x', 'x']
      }
    ]
  }
];

// Add more chords as needed