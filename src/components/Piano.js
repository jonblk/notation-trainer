import { useState, memo } from 'react';

const PianoKey = ({isBlack, index, xOffset, isPressed, onTogglePianoKey}) => {
  const [isHovered, setIsHovered] = useState(false);
  let color = isBlack ? '#1d373d' : '#abc4c4';
  let style= {};

  if (isHovered) {
    color = '#578994';
  }

  if (isPressed) {
    color = 'orange';
  }

  if (isBlack) {
    // black key style - use absolute positioning 
    style = { 
      position: 'absolute', 
      left:     `${xOffset*100}%`,  
      width:    `${1/52 * 0.5 * 100}%`, 
      height:     '50%', 
      background: color 
    };
  } else {
    // white key style - use flexbox
    style = {
      width:      `inherit`, 
      height:     '100%', 
      background: color
    };
  }

  return(
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      onMouseOut  ={() => isPressed ? onTogglePianoKey(index, false) : null } 
      onMouseDown ={() => onTogglePianoKey(index, true)} 
      onMouseUp   ={() => onTogglePianoKey(index, false)} 
      style={style}>
    </div>
  );
}

const propsEquality = (prev, next) =>  
  prev.isPressed  === next.isPressed && 
  prev.currentNote === next.currentNote 

const MemoizedPianoKey = memo(PianoKey, propsEquality);

const Piano = ({onKeys, onTogglePianoKey, currentNote}) => {
  let whiteKeys = [];
  let blackKeys = [];

  const whiteKeyCount = 52; 
  let whiteKeyIndex = 0; 
  let keyIndex = 0; 
  let octave = 0;
  const pitch = ['A','B','C','D','E','F','G'];

  while(whiteKeyIndex < whiteKeyCount) {
    let currentPitch = pitch[whiteKeyIndex % 7];
    if (currentPitch === 'C') { octave++ }
    let note = `${currentPitch}/${octave}`;

    // add white key
    whiteKeys.push(
      <MemoizedPianoKey 
        isBlack={false}
        isPressed={onKeys[keyIndex]} 
        onTogglePianoKey={onTogglePianoKey} 
        key={note} 
        index={keyIndex} 
        currentNote={currentNote}
      />
    );

    whiteKeyIndex++;
    keyIndex++;

    // add a black key (sharp) if pitch is not b or e
    if (currentPitch !== 'B' && currentPitch !== 'E' && keyIndex !== 88) {
      note = `${currentPitch}#/${octave}`;

      blackKeys.push(
        <MemoizedPianoKey 
          isBlack={true}
          isPressed={onKeys[keyIndex]} 
          onTogglePianoKey={onTogglePianoKey}
          xOffset={(whiteKeyIndex/whiteKeyCount) + ((1/52)*0.3) - 1/52*0.5} 
          key={note}
          index={keyIndex} 
          currentNote={currentNote}
        />
      );

      keyIndex++;
    }
  }

  const pianoContainerStyle = {
    opacity: '100%', 
    height: '17vh', 
    position: 'fixed', 
    left: '0', 
    bottom: '0', 
    width: '100%',
  };

  const whiteKeysContainerStyle = {
    gap: '1px', 
    height: '100%', 
    width: '100%', 
    justifyContent: 'center',
    display: 'flex',
  };

  return (
    <div data-pianoid="piano" style={pianoContainerStyle} >
        { blackKeys } 
      <div style={whiteKeysContainerStyle}> 
        { whiteKeys } 
      </div>
    </div>
  )
};

export default Piano;
