import { getKeyIndex, getRandomNote, isValidNote, OCTAVE_ERROR, PITCH_ERROR } from "./../utilities";

describe('getRandomNote()', () => {
  it('returns a valid random note that does not equal previous note', () => {
    const previousNote = 'C#/1';
    const octaveRange = [2,2];
    const randomNote = getRandomNote(octaveRange, previousNote); 
    const result = randomNote !== previousNote;
    [...Array(1000)].forEach(() => expect(result).toBe(true));
  });

  it('returns a valid random note', () => {
    expect(isValidNote(getRandomNote([0,7]))).toBe(true);
  });
});

describe('getKeyIndex()', () => {
  it('returns correct value', () => {
    let keyIndexes = [
      [getKeyIndex('C#/1'), 4], 
      [getKeyIndex('A/0'), 0], 
      [getKeyIndex('C/7'), 75]
    ];

    keyIndexes.forEach((v)=> expect(v[0]).toBe(v[1]));
  }); 

  it('throws error if invalid pitch', () => {
    const invalidNote = '@#/1';
    expect(()=> getKeyIndex(invalidNote)).toThrowError(PITCH_ERROR);
  });

  it('throws error if invalid octave', () => {
    const invalidNote = 'C#/e';
    expect(()=> getKeyIndex(invalidNote)).toThrowError(OCTAVE_ERROR);
  });
});
