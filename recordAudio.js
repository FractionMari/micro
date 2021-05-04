console.clear();



// UPDATE: there is a problem in chrome with starting audio context
//  before a user gesture. This fixes it.
var started = false;
document.documentElement.addEventListener('mousedown', () => {
  if (started) return;
  started = true;
  const audio = document.querySelector('audio');
  const synth = new Tone.Synth();
  const actx  = Tone.context;
  const dest  = actx.createMediaStreamDestination();
  const recorder = new MediaRecorder(dest.stream);

  synth.connect(dest);
  synth.toMaster();

  const chunks = [];

  const notes = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3"];
  let note = 0;
  Tone.Transport.scheduleRepeat(time => {
    if (note === 0) recorder.start();
    if (note > notes.length) {
        document.getElementById("button1").addEventListener("click", function()
        {synth.triggerAttack();
        });
        
        synth.triggerRelease(time)

      recorder.stop();
      Tone.Transport.stop();
    } else synth.triggerAttack(notes[note], time);
    note++;
  }, '4n');

  recorder.ondataavailable = evt => chunks.push(evt.data);
  recorder.onstop = evt => {
    let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    audio.src = URL.createObjectURL(blob);
  };

  Tone.Transport.start();
});




const synth = new Tone.AMSynth().toDestination();

var slider = document.getElementById("myRange");

slider.oninput = function() {
  synth.frequency.value = this.value;

}

