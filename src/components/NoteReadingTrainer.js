import { getKeyIndex, getNoteName, getRandomNote, audioWrong, audioCorrect } from "./../utilities";
import { useState, useRef, useEffect } from 'react';
import Piano from './Piano';
import MusicScore from './MusicScore';
import { CSSTransition } from 'react-transition-group';

const TREBLE_CLEF  = 'treble';
const BASS_CLEF    = 'bass';
const OCTAVE_RANGE = { treble: [4,5], bass: [2,3] };

export default function NoteReadingTrainer() {
  const [clef, setClef] = useState(TREBLE_CLEF);
  const [onKeys, setOnKeys] = useState({}); // piano keys in the ON state
  const [noteToPlay, setNoteToPlay] = useState(getRandomNote(OCTAVE_RANGE[clef], null)); 
  const [onNote, setOnNote] = useState(null); // last note to be in ON state
  const [isEnter, setIsEnter] = useState(true); // for animation
  const [isCorrect, setIsCorrect] = useState(null); 

  const score = useRef(0);

  const nextClef = () => Math.random() > 0.5 ? TREBLE_CLEF : BASS_CLEF;

  const onNoteOn = index => {
    const is_correct = index === getKeyIndex(noteToPlay);
    setOnKeys((state, _props) => ({...state, ...{[index]: true}}));
    setIsCorrect(is_correct);
    setIsEnter(true);
    setOnNote(getNoteName(index, /[b]/.test(noteToPlay)));
    if(is_correct) {
      audioCorrect.currentTime = 0;
      audioCorrect.play(); 
    } else {
      //audioWrong.currentTime = 0;
      //audioWrong.play();
    }
  }

  const onNoteOff = index => {
    const is_correct = index === getKeyIndex(noteToPlay);
    setOnKeys((state, _props) => ({...state, ...{[index]: false}}));
    setIsEnter(false);  
    if (is_correct) {
      let next_clef = nextClef();
      let next_note = getRandomNote(OCTAVE_RANGE[next_clef], noteToPlay);
      setNoteToPlay(next_note);
      setClef(next_clef);
    }
  }

  const flexRow = {
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    height: '70vh', 
    alignItems: 'center', 
    justifyContent: 'center'
  }

  return(
    <div>
      <div style={flexRow}>
        <CSSTransition in={isEnter} timeout={isCorrect ? 2000 : 1000} appear={true} classNames={"fade"}>
          <p className={isCorrect ? 'success' : ''} style={{color: isCorrect ? `hsl(180 100% 50%)` : 'inherit', width: '0px', paddingTop: '60px', fontSize: '55px', fontWeight: '700'}}>
            {onNote}
          </p>
        </CSSTransition>

        <div ref={score}>
          <MusicScore clef={clef} note={noteToPlay} />
        </div>
      </div>

      <Piano onKeys={onKeys} onNoteOff={onNoteOff} onNoteOn={onNoteOn} currentNote={noteToPlay} />
    </div>
  );
}
