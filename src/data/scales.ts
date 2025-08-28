export interface Scale {
  name: string;
  notes: string[];
  pattern: string;
  positions: {
    position: number;
    frets: string[][];
  }[];
}

export const scales: Scale[] = [
  {
    name: 'C Major Scale (Ionian)',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    pattern: 'W-W-H-W-W-W-H',
    positions: [
      {
        position: 1,
        frets: [
          ['0', '1', '3'],
          ['0', '1', '3'],
          ['0', '2', '3'],
          ['0', '2', '3'],
          ['1', '3'],
          ['0', '1', '3']
        ]
      },
      {
        position: 2,
        frets: [
          ['3', '5'],
          ['3', '5'],
          ['2', '3', '5'],
          ['2', '3', '5'],
          ['3', '5'],
          ['3', '5']
        ]
      }
    ]
  },
  {
    name: 'A Minor Scale (Natural Minor)',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    pattern: 'W-H-W-W-H-W-W',
    positions: [
      {
        position: 1,
        frets: [
          ['0', '3'],
          ['0', '1', '3'],
          ['0', '2', '3'],
          ['0', '2'],
          ['0', '1', '3'],
          ['0', '3']
        ]
      },
      {
        position: 2,
        frets: [
          ['5', '7', '8'],
          ['5', '7', '8'],
          ['5', '7'],
          ['5', '7'],
          ['5', '8'],
          ['5', '7', '8']
        ]
      }
    ]
  },
  {
    name: 'G Major Pentatonic',
    notes: ['G', 'A', 'B', 'D', 'E'],
    pattern: '3H-W-W-3H-W',
    positions: [
      {
        position: 1,
        frets: [
          ['3'],
          ['2', '5'],
          ['2', '4'],
          ['2', '4'],
          ['3', '5'],
          ['3']
        ]
      },
      {
        position: 2,
        frets: [
          ['7', '10'],
          ['7', '10'],
          ['7', '9'],
          ['7', '9'],
          ['7', '10'],
          ['7', '10']
        ]
      }
    ]
  },
  {
    name: 'E Minor Pentatonic',
    notes: ['E', 'G', 'A', 'B', 'D'],
    pattern: '3H-W-W-3H-W',
    positions: [
      {
        position: 1,
        frets: [
          ['0', '3'],
          ['0', '3'],
          ['0', '2'],
          ['0', '2'],
          ['0', '3'],
          ['0', '3']
        ]
      },
      {
        position: 2,
        frets: [
          ['12', '15'],
          ['12', '15'],
          ['12', '14'],
          ['12', '14'],
          ['12', '15'],
          ['12', '15']
        ]
      }
    ]
  },
  {
    name: 'C Major Pentatonic',
    notes: ['C', 'D', 'E', 'G', 'A'],
    pattern: 'W-W-3H-W-3H',
    positions: [
      {
        position: 1,
        frets: [
          ['0', '3'],
          ['0', '3'],
          ['0', '2'],
          ['0', '2'],
          ['1', '3'],
          ['0', '3']
        ]
      },
      {
        position: 2,
        frets: [
          ['8', '10'],
          ['8', '10'],
          ['7', '10'],
          ['7', '10'],
          ['8', '10'],
          ['8', '10']
        ]
      }
    ]
  },
  {
    name: 'A Blues Scale',
    notes: ['A', 'C', 'D', 'D#', 'E', 'G'],
    pattern: '3H-W-H-H-3H-W',
    positions: [
      {
        position: 1,
        frets: [
          ['0', '3'],
          ['0', '1', '3'],
          ['0', '1', '2', '3'],
          ['0', '2'],
          ['0', '1', '3'],
          ['0', '3']
        ]
      },
      {
        position: 2,
        frets: [
          ['5', '8'],
          ['5', '6', '8'],
          ['5', '6', '7', '8'],
          ['5', '7'],
          ['5', '6', '8'],
          ['5', '8']
        ]
      }
    ]
  }
];

// Legend: W = Whole step, H = Half step, 3H = Three half steps (minor third)