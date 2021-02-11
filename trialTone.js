// The oscillator version with new code + adding the Tone.js library.

// 11. februar: including the Tone.js to improve sound quality


////////////

function handleOrientation(event) {
    updateFieldIfNotNull('Orientation_b', event.beta);
    updateFieldIfNotNull('Orientation_g', event.gamma);
    updateFieldIfNotNull('Orientation_a', event.alpha);

    // Rotation to control oscillator pitch
    let pitchWheel = event.gamma;
    pitchWheel = pitchWheel + 280;
  // oscillator.frequency.value = pitchWheel;
  //  oscillator2.frequency.value = pitchWheel /2;
  }

// Introducing Tone.js
const gainNode = new Tone.Gain().toMaster();
const synth = new Tone.Synth().connect(gainNode).toMaster();

///////////

    // Preparing the audio variables
/*     var AudioContext = window.AudioContext || window.webkitAudioContext;  
    var volume;
    var newAcc;
    var context;
    var biquadAcc;
    var biquadFilter;
    var oscillator;
    var oscillator2;   */


    // A button for playback of music track
    document.querySelector("#button1").addEventListener('click', function() {

    synth.triggerAttack("C4");

/*     context = new AudioContext();
// oscillator variables
    oscillator = context.createOscillator();
    oscillator2 = context.createOscillator();
    oscillator.frequency.value = 380;
    oscillator2.frequency.value = 157;
 //   oscillator2.type = "square";
    oscillator.start();
    oscillator2.start();

    volume = context.createGain();
    volume.gain.value = 0.5;
    biquadFilter = context.createBiquadFilter();
    
    // Manipulate the Biquad filter

    biquadFilter.type = "bandpass";
    biquadFilter.frequency.value = 1000;
    biquadFilter.Q.value = 1;
    biquadFilter.detune.value = 100;

    //// testing of biquad vlaues
    var biquad_detune_slider = document.getElementById("biquad_detune");
    var biquad_gain_slider = document.getElementById("biquad_gain");
    var biquad_freq_slider = document.getElementById("biquad_freq");

    biquad_detune_slider.oninput = function() {
        biquadFilter.detune.value = this.value;
    }  
    biquad_gain_slider.oninput = function() {
        biquadFilter.Q.value = this.value;
    }  
    biquad_freq_slider.oninput = function() {
        biquadFilter.frequency.value = this.value;
    }  


    oscillator.connect(biquadFilter); 
    oscillator2.connect(biquadFilter); 

    biquadFilter.connect(volume)    
    volume.connect(context.destination);   */


    });
    
    // stop button of the oscillator
    
    document.querySelector("#button2").addEventListener('click', function() {
/*         oscillator.stop();
        oscillator2.stop(); */
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
  
  const accl = new Accelerometer({ frequency: 50 });


  
                
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
  
/*     let totAcc = Math.sqrt(Math.abs(xValue^2) + Math.abs(yValue^2) + Math.abs(zValue^2));
    let totFilter = Math.sqrt(Math.abs(xFilter^2) + Math.abs(yFilter^2) + Math.abs(zFilter^2)); */

    let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
    let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));

    let diffAcc = Math.abs(totAcc - totFilter);

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
    updateFieldIfNotNull('biquad', biquadAcc );


  //Scaling the incoming number
   function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
    var offset = newMin - prevMin,
        scale = (newMax - newMin) / (prevMax - prevMin);
    return function (x) {
        return offset + scale * x;
    };

    
  };

  function clamp(min, max, val) {
    return Math.min(Math.max(min, +val), max);
  }
  var fn = generateScaleFunction(0, 0.6, 1, 0);

  newAcc = fn(diffAcc);

  var fn_biquad = generateScaleFunction(0, 10, 0, 5000);
  biquadAcc = Math.abs(zValue);
  biquadAcc = fn_biquad(biquadAcc);



newAcc = (clamp(0.1, 0.5, newAcc));
biquadFilter.frequency.value = biquadAcc;




// more smooth change of volume:
//volume.gain.value = newAcc;
gainNode.gain.value = newAcc;
volume.gain.cancelScheduledValues(context.currentTime);
volume.gain.setValueAtTime(volume.gain.value, context.currentTime);
volume.gain.exponentialRampToValueAtTime(newAcc, context.currentTime + 2);


}  


  accl.start();


