// Functioning prototype 1: Tone.js 15. February
// The oscillator version with new code + adding the Tone.js library.


/* /// output console log code

// Reference to an output container, use 'pre' styling for JSON output

var output = document.createElement('pre');
document.body.appendChild(output);
// Reference to native method(s)
var oldLog = console.log;

console.log = function( ...items ) {

    // Call native method first
    oldLog.apply(this,items);

    // Use JSON to transform objects, all others display normally
    items.forEach( (item,i)=>{
        items[i] = (typeof item === 'object' ? JSON.stringify(item,null,4) : item);
    });
    output.innerHTML += items.join(' ') + '<br />';

};

// Y1ou could even allow Javascript input...
function consoleInput( data ) {
    // Print it to console as typed
    
    console.log( data + '<br />' );
    try {
        console.log( eval( data ) );
    } catch (e) {
        console.log( e.stack );
    }
}
console.log("Hei igjen! :)")


//Getting access to accelerometer for iOs:
function getAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
      if (response == 'granted') {
          console.log("accelerometer permission granted");
          // Do stuff here
      }
  });
} */

// Tone.js parameters:

const gainNode = new Tone.Gain().toMaster();
const autoFilter = new Tone.AutoWah().connect(gainNode);
const synth = new Tone.DuoSynth().connect(gainNode);
const synth2 = new Tone.FMSynth().connect(gainNode);


let newAcc;
let newAcc2;
let inverse = true;

// With this function the values won't go below a threshold 
function clamp(min, max, val) {
  return Math.min(Math.max(min, +val), max);
}

//Scaling any incoming number
function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
var offset = newMin - prevMin,
    scale = (newMax - newMin) / (prevMax - prevMin);
  return function (x) {
      return offset + scale * x;
      };
};
// Scales
var harmonicScale = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3"];
var pentaScale = ["C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4"];
// Function for shifting pitch
function pitchShift (pitch, instrument, scale) {
  const intervalChange = 30;
  const points = Math.floor(pitch / intervalChange);

  if (points >= 12)
  instrument.frequency.value = scale[111];
  else if (points >= 11)
  instrument.frequency.value = scale[10];
  else if (points >= 10)
  instrument.frequency.value = scale[9];
  else if (points >= 9)
  instrument.frequency.value = scale[8];  
  else if (points >= 8)
  instrument.frequency.value = scale[7];
  else if (points >= 7)
  instrument.frequency.value = scale[6];
  else if (points >= 6)
  instrument.frequency.value = scale[5];
  else if (points >= 5)
  instrument.frequency.value = scale[4];
  else if (points >= 4)
  instrument.frequency.value = scale[3];
  else if (points >= 3)
  instrument.frequency.value = scale[2];
  else if (points >= 2)
  instrument.frequency.value = scale[1]; 
  else if (points >= 1)
  instrument.frequency.value = scale[0];
      
}

function handleOrientation(event) {

    updateFieldIfNotNull('Orientation_b', event.beta);
    updateFieldIfNotNull('Orientation_g', event.gamma);
    updateFieldIfNotNull('Orientation_a', event.alpha);

    // Rotation to control oscillator pitch
    let pitchWheel = event.beta;
    let filterWheel = event.gamma;
    let filterScale = generateScaleFunction(0, 90, 10, 300);
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel);
    //filterWheel = filterWheel + 50;
    //filterWheel = Math.abs(filterWheel * 6);
    pitchWheel = pitchWheel + 180;

    updateFieldIfNotNull('pitchwheel', pitchWheel);
    updateFieldIfNotNull('filterwheel', filterWheel);
    pitchShift(pitchWheel, synth, pentaScale);
    pitchShift(pitchWheel, synth2, harmonicScale);
    let harmonicity = pitchWheel / 180;
    updateFieldIfNotNull('harmonicity', harmonicity);
    //autoFilter.baseFrequency = filterWheel;
    synth.harmonicity.value = harmonicity;

 

  }

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

// LowPassFilterData(reading, bias) To be able to calcualte the difference between Accelerometer frames
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
  
  function incrementEventCount(){
    let counterElement = document.getElementById("num-observed-events")
    let eventCount = parseInt(counterElement.innerHTML)
    counterElement.innerHTML = eventCount + 1;
    updateFieldIfNotNull('eventcount', eventCount );
    if (eventCount > 200)
    synth.triggerRelease(),
    synth2.triggerAttack();


  }



  // The accelerometer
  const accl = new Accelerometer({ frequency: 10 });
                
  // Isolate gravity with low-pass filter.
  const filter = new LowPassFilterData(accl);

  accl.onreading = () => {

    let xValue = accl.x;
    let yValue = accl.y;
    let zValue = accl.z;
    let xFilter = filter.x;
    let yFilter = filter.y;
    let zFilter = filter.z;
    let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
    let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));
    let diffAcc = (Math.abs(totAcc - totFilter)) * 10;


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

    var fn = generateScaleFunction(0, 2, 0.3, 0);
    newAcc = fn(diffAcc);
    newAcc = (clamp(0, 0.3, newAcc));

    var fn2 = generateScaleFunction(1, 2, 0, 0.3);
    newAcc2 = fn2(diffAcc);
    newAcc2 = (clamp(0, 0.3, newAcc2));

if (inverse == false)
gainNode.gain.rampTo(newAcc2, 0.2);
else
// more smooth change of volume:
gainNode.gain.rampTo(newAcc, 0.2);
incrementEventCount();

}  

  accl.start();

  document.getElementById("button2").addEventListener("click", function(){
  
      
    if(this.className == 'is-playing'){
      this.className = "";
      this.innerHTML = "Inverse: ON"
      inverse = true;


  
    }else{
      this.className = "is-playing";
      this.innerHTML = "Inverse: OFF";
      inverse = false;
  
    }}
    ); 
/* // A button for playback of music track
document.querySelector("#button1").addEventListener('click', function() {
  synth.triggerAttack("C4");  
  });
      
  // stop button of the oscillator
  document.querySelector("#button2").addEventListener('click', function() {
  synth.triggerRelease();
  
  }); */

  document.getElementById("button1").addEventListener("click", function(){
   
    
    if(this.className == 'is-playing'){
      this.className = "";
      this.innerHTML = "Synth: OFF"
      synth.triggerRelease();
      synth2.triggerRelease();
  
    }else{
      this.className = "is-playing";
      this.innerHTML = "Synth: ON";
      synth.triggerAttack("C4"); 
      
  
    }}
    );
