// The oscillator version with new code + adding the Tone.js library.

// 11. februar: including the Tone.js to improve sound quality

//algoritme som lager tall imellom
// Idé: bruke tutorial-koden om farsgrense til å lage skala på xaksen
////////////

const gainNode = new Tone.Gain().toMaster();
//const freeverb = new Tone.Freeverb().toMaster();

const crusher = new Tone.BitCrusher().connect(gainNode);
const synth = new Tone.AMSynth().connect(crusher);

var newAcc;



function crushShift (crushValue) {
// 360 / 8 = 45
  const crushIntervalChange = 45;
  const crushPoints = Math.floor(crushValue/ crushIntervalChange);


  if (crushValue >= 8)
    crusher.bits = 8;
  else if (rushValue >= 7)
    crusher.bits = 7;
  else if (crushValue >= 6)
    crusher.bits = 6;
  else if (crushValue >= 5)
    crusher.bits = 5;
  else if (crushValue >= 4)
    crusher.bits = 4;
  else if (crushValue >= 3)
    crusher.bits = 3;
  else if (crushValue >= 2)
    crusher.bits = 2;
  else if (crushValue >= 1)
    crusher.bits = 1;
      
  }


function pitchShift (pitch) {
  //const pitchLimit = 1;
  const intervalChange = 30;
  const points = Math.floor(pitch / intervalChange);

  if (points >= 12)
    synth.frequency.value = "C4";
  else if (points >= 11)
    synth.frequency.value = "B3";
  else if (points >= 10)
    synth.frequency.value = "A3";
  else if (points >= 9)
    synth.frequency.value = "G3";  
  else if (points >= 8)
    synth.frequency.value = "F3";
  else if (points >= 7)
    synth.frequency.value = "E3";
  else if (points >= 6)
    synth.frequency.value = "D3";
  else if (points >= 5)
    synth.frequency.value = "C3";
  else if (points >= 4)
    synth.frequency.value = "B2";
  else if (points >= 3)
    synth.frequency.value = "A2";
  else if (points >= 2)
    synth.frequency.value = "G2"; 
  else if (points >= 1)
    synth.frequency.value = "F2";
      
}

function handleOrientation(event) {
    // updateFieldIfNotNull('Orientation_b', pitchWheel);
    updateFieldIfNotNull('Orientation_b', event.beta);
    updateFieldIfNotNull('Orientation_g', event.gamma);
    updateFieldIfNotNull('Orientation_a', event.alpha);

    // Rotation to control oscillator pitch
    let pitchWheel = event.beta;
    let crushWheel = event.gamma;
    pitchWheel = pitchWheel + 180;

    updateFieldIfNotNull('pitchwheel', pitchWheel);
    pitchShift(pitchWheel);
    crushShift(crushWheel);
  }

/////////////////////////
// Introducing Tone.js //
// A button for playback of music track
document.querySelector("#button1").addEventListener('click', function() {
synth.triggerAttack("C4");

});
    
// stop button of the oscillator

document.querySelector("#button2").addEventListener('click', function() {
synth.triggerRelease();

});

if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
    ) {
    DeviceMotionEvent.requestPermission();
    }

window.addEventListener("deviceorientation", handleOrientation);


// function for updating values for sensor data

function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

// LowPassFilterData(reading, bias)

class LowPassFilterData {
  constructor(reading) {
    Object.assign(this, { x: reading.x, y: reading.y, z: reading.z });
  }
  
    update(reading) {
      this.x = reading.x;
      this.y = reading.y;
      this.z = reading.z;
    }
  };
  
  // The accelerometer
  const accl = new Accelerometer({ frequency: 60 });
                
  // Isolate gravity with low-pass filter.
  const filter = new LowPassFilterData(accl);

  accl.onreading = () => {

    // trying to avoid the "clicks" when changing volume
    //volume.gain.setTargetAtTime(0, context.currentTime, 0.015)

    let xValue = accl.x;
    let yValue = accl.y;
    let zValue = accl.z;
    let xFilter = filter.x;
    let yFilter = filter.y;
    let zFilter = filter.z;
    let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
    let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));
    let diffAcc = (Math.abs(totAcc - totFilter)) * 10;

      // With this function it won't go below a threshold 
  function clamp(min, max, val) {
    return Math.min(Math.max(min, +val), max);
  }
  diffAcc = (clamp(0, 12, diffAcc));

 
    filter.update(accl); // Pass latest values through filter.
    updateFieldIfNotNull('test_x', accl.x );
    updateFieldIfNotNull('filter_x', filter.x );

    updateFieldIfNotNull('test_y', accl.y );
    updateFieldIfNotNull('filter_y', filter.y );

    updateFieldIfNotNull('test_z', accl.z );
    updateFieldIfNotNull('filter_z', filter.z );

    updateFieldIfNotNull('total_acc', totAcc );
    updateFieldIfNotNull('total_filter', totFilter );
    updateFieldIfNotNull('diff_acc', diffAcc );
    updateFieldIfNotNull('volume_acc', newAcc );

 
  //Scaling the incoming number
   function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
    var offset = newMin - prevMin,
        scale = (newMax - newMin) / (prevMax - prevMin);
    return function (x) {
        return offset + scale * x;
    };
    
  };


  var fn = generateScaleFunction(0, 12, -0.5, -1);
  newAcc = fn(diffAcc);
  newAcc = (clamp(-1, -0.5, newAcc));





// more smooth change of volume:

  gainNode.gain.rampTo(newAcc, 0.2);


}  


  accl.start();


