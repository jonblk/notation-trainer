export const audioCorrect = new Audio('/correct.wav');
export const audioWrong = new Audio('/wrong.wav');

// input string: (F#/3, Fb/3, F/3 etc...) 
// output integer: 0-87 key index
export const getKeyIndex = (note) => {
  const pitch = note.charAt(0);
  let accidental = 0;

  if (note.includes('#')) {
    accidental = 1;
  } else if (note.includes('b')) {
    accidental = -1;
  }

  const octave = note.charAt(note.length - 1);
  const val = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
  
  if (val[pitch] === undefined) {
     throw new Error('Pitch not found');
  }

  if (octave === '0') {
    return((pitch === 'A' ? 0 : 1) + accidental);
  } else {
    return((octave*12 + accidental + val[pitch] - 9));
  }
}

// return a random note
// ouput string `${pitch}${accidental}/${octave}`;

export const getRandomNote = (octave_range, current_note) => {
  const generate = () => {
    const rnd         = (min,max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const pitches     = ['A','B','C','D','E','F','G'];
    const octaves     = octave_range;
    const accidentals = ['', '', 'b', '#'] 
    const pitch       = pitches[rnd(0, pitches.length-1)];
    const octave      = octaves[rnd(0, octaves.length-1)];
    let accidental    = accidentals[rnd(0, Math.random() * accidentals.length-1)];

    if ((pitch === 'F' || pitch === 'C') && accidental === 'b')
      accidental = '#'

    if ((pitch === 'E' || pitch === 'B') && accidental === '#')
      accidental = 'b'

    return `${pitch}${accidental}/${octave}`;
  }
        
  let output = current_note;

  // make sure that a different note is returned
  while (output === current_note) {
    output = generate();
  }

  return output;
}


