import { getKeyIndex, getRandomNote, audioWrong, audioCorrect } from "./../utilities";
import { useState, useRef } from 'react';
import Piano from './Piano';
import MusicScore from './MusicScore';

export default function NoteReadingTrainer() {
  // treble, or bass
  const [clef, setClef] = useState('treble');

  const octaveRange = (clef) => clef === 'treble' ? [4,5] : [2,3];

  // the piano keys that are currently in the on state 
  const [onKeys, setOnKeys] = useState({});

  // the current note that the user must correctly identify
  const [currentNote, setCurrentNote] = useState(getRandomNote(octaveRange(clef), null));

  const score = useRef(0);

  // Callback for note on/off events 
  // keyIndex 0->87
  const onToggleKey = (keyIndex, isOn) => {
    if (isOn) {
      // correct note 
      if (getKeyIndex(currentNote) === keyIndex) {
        let next_clef = Math.random() > 0.5 ? 'treble' : 'bass';
        let next_note = getRandomNote(octaveRange(next_clef), currentNote);

        setCurrentNote(next_note);
        setClef(next_clef);

        score.current.classList.remove("shake")
        audioCorrect.currentTime = 0;
        audioCorrect.play();

      // wrong note
      } else {
        audioWrong.currentTime = 0;
        audioWrong.play();
      }
    } 
    
    setOnKeys((state, _props) => ({
      ...state, 
      ...{[keyIndex]: isOn}
    }));
  }

  //const isConnected = midiInputs.length === 0;

  return(
    <div>
      <div ref={score}>
        <MusicScore clef={clef} note={currentNote} />
      </div>
      <Piano onKeys={onKeys} onTogglePianoKey={onToggleKey} currentNote={currentNote} />
    </div>
  );
}
