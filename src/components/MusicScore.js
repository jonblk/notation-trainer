import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import { useEffect, useRef } from 'react';

const DEFAULT_COLOR = '#1d373d';

const drawScore = (ref, currentNote, clef) => {
  const renderer = new Renderer(ref, Renderer.Backends.SVG);

  // Configure the rendering context.
  renderer.resize(400, 340);

  const context = renderer.getContext();

  context.setFillStyle(DEFAULT_COLOR);
  context.setStrokeStyle(DEFAULT_COLOR);
  context.setFont('Arial', 46);
  context.scale(2.33,2.33); // NOTE - these values center it horizontally, is there a better way?

  // Create a stave of width 70 at position 10, 10.
  const stave = new Stave(35, 30, 100, {fill_style: DEFAULT_COLOR});

  // Add a clef and time signature.
  stave.addClef(clef)

  // Connect it to the rendering context and draw!
  stave.setContext(context).draw();

  const note = new StaveNote(
    {
      clef,
      keys: [currentNote],  
      duration: 'q'
    }
  )

  if (currentNote.includes('#')) {
    note.addModifier(new Accidental('#')) 
  }

  if (currentNote.includes('b')) {
    note.addModifier(new Accidental('b')) 
  }

  var voice = new Voice({num_beats:1,  beat_value: 4});
  voice.addTickable(note);
  new Formatter().joinVoices([voice]).format([voice], 100);
  voice.draw(context, stave);
}

const MusicScore = ({note, clef}) => {
  const score = useRef(null);

  useEffect(() => {
    const ref = score.current;
    drawScore(ref, note, clef);

    return(() => {
       while (ref.firstChild) {
         ref.removeChild(ref.firstChild);
       }
    });
  }, [note, clef]);

  return(<div ref={score}  id="score"></div>);
}

export default MusicScore;
