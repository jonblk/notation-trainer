export class WebMidi {
  connection  = null;
  onSetInputs = null;
  onNoteEvent = null;

  /*
  constructor(onNoteEvent, onConnect=null) {
    this.onConnect = onConnect; 
    this.onNoteEvent  = onNoteEvent;
  }
  */

  connect() {
    if (!this.connection);
      this.requestAccess();
  }

  get isInputConnected() {
    return this.connection.inputs.length > 0
  }
  
  disconnect() {
    if (this.connection !== null) {
      console.log('disconnecting!!!');
      this.connection.inputs.forEach(port => {port.close()});
      this.onSetInputs([]);
    }
  }


  setupDevices(inputs) {
    inputs.forEach((entry) => { 
        entry.onmidimessage = (event) => this.onMIDIMessage(event); 
    });
  }

  onMIDISuccess(midiAccess) {
    this.connection = midiAccess; 
    this.setupDevices(midiAccess.inputs);

    midiAccess.onstatechange = (evt) => {
      console.log(evt);
    };

    this.onSetInputs(midiAccess.inputs);

    console.log("MIDI ready!");
  }

  onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`);
  }

  parseMidiMessage({data}) {
    const command = data[0] >> 4;
    const channel = data[0] & 0xf;
    const note    = data[1];
    const velocity = data[2] / 127;

    if ((command === 8 || command === 9) && channel === 0) {
      return { 
        note: note - 21, 
        velocity: command === 8 ? -velocity : velocity, // negative velocity === note off
      };
    } else {
      return null;
    }
  }

  onMIDIMessage(event) {
    const parsed = this.parseMidiMessage(event);
    if (parsed) {
      this.onNoteEvent(parsed.note, parsed.velocity > 0);
    }
  }

  async requestAccess() {
    let access = null;

    try {
      access = await navigator.requestMIDIAccess();
    } catch(e) {
      this.onMIDIFailure();
    }

    if (access) {
      this.onMIDISuccess(access)
    }
  }

  listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
      console.log(`Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`);
    }

    for (const entry of midiAccess.outputs) {
      const output = entry[1];
      console.log(`Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`);
    }
  }
}
