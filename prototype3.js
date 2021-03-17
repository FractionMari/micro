// Functioning prototype 1: Tone.js 15. February
// The oscillator version with new code + adding the Tone.js library.

// 11. februar: including the Tone.js to improve sound quality
//1. og 2. mars: creating a loop function

/// output console log code

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
console.log("Hey again Thomas2")


let pitchslider = document.getElementById("pitch");

const gainNode = new Tone.Gain().toMaster();

const pitchShift2 = new Tone.PitchShift().connect(gainNode);
const autoFilter = new Tone.AutoWah().connect(pitchShift2);

//instead of a Synth, there is some loops
// Pitch variables
pitchShift2.pitch = 0; // down one octave

var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
    // do something amazing
    var playerBuffers = new Tone.Buffers({
        "drums" : "loops/drums1_80bpm.wav",
        "bass" : "loops/bass1_80bpm.wav",
        "arp" : "loops/arp_80bpm.wav",
        "bass2" : "loops/bass2_80bpm.wav",
        "2drums" : "loops/2drums1.wav",
        "2bass" : "loops/2bass1.wav",
        "2arp" : "loops/2arp.wav",
        "2bass2" : "loops/2bass2.wav",
        "2piano" : "loops/2piano.wav"
    }, function(){
        //play one of the samples when they all load
        if (frontToBack > 5)
        player.buffer = playerBuffers.get("drums");
        else 
        player.buffer = playerBuffers.get("2drums");

        player.start();
      player2.buffer = playerBuffers.get("bass");
        player2.start();
      player3.buffer = playerBuffers.get("arp");
        player3.start();
      player4.buffer = playerBuffers.get("bass2");
        player4.start();
    });
    const player = new Tone.Player().connect(autoFilter);
    const player2 = new Tone.Player().connect(autoFilter);
    const player3 = new Tone.Player().connect(autoFilter);
    const player4 = new Tone.Player().connect(autoFilter);
    
    player.loop = true;
    player2.loop = true;
    player3.loop = true;
    player4.loop = true;
    
    player.autostart = true;
    player2.autostart = true;
    player3.autostart = true;
    player4.autostart = true;
    
    player.mute = true;
    player2.mute = true;
    player3.mute = true;
    player4.mute = true;
    console.log(frontToBack);
};

// Players



let newAcc;

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

//var result = [];

function handleOrientation(event) {

    updateFieldIfNotNull('Orientation_b', event.beta);
    updateFieldIfNotNull('Orientation_g', event.gamma);
    updateFieldIfNotNull('Orientation_a', event.alpha);

    // Rotation to control oscillator pitch
    //let pitchWheel = event.beta;
    let filterWheel = event.gamma;
    test = filterWheel;
    let filterScale = generateScaleFunction(0, 90, 10, 300);
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel);
    //filterWheel = filterWheel + 50;
    //filterWheel = Math.abs(filterWheel * 6);
    //pitchWheel = pitchWheel + 180;

   // updateFieldIfNotNull('pitchwheel', pitchWheel);
    updateFieldIfNotNull('filterwheel', filterWheel);
   // pitchShift(pitchWheel);
    //result.push(filterWheel);
    var rotateDegrees = event.alpha;
    // gamma: left to right
    var leftToRight = event.gamma;
    // beta: front back motion
    var frontToBack = event.beta;
    //return event.beta;
    handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);

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


  var fn = generateScaleFunction(0, 3, 0.5, 0);
  newAcc = fn(diffAcc);
  newAcc = (clamp(0, 0.5, newAcc));


// more smooth change of volume:
  gainNode.gain.rampTo(newAcc, 0.2);

}  

  accl.start();


  

  document.getElementById("looper1").addEventListener("click", function(){
    
    
  if(this.className == 'is-playing'){
    this.className = "";
    this.innerHTML = "1: OFF"
    player.mute = true;

  }else{
    this.className = "is-playing";
    this.innerHTML = "1: ON";

    player.mute = false;

  }}
  );


  document.getElementById("looper2").addEventListener("click", function(){

    
  if(this.className == 'is-playing'){
    this.className = "";
    this.innerHTML = "2: OFF"
    player2.mute = true;

  }else{
    this.className = "is-playing";
    this.innerHTML = "2: ON";

    player2.mute = false;

  }}
  );

  document.getElementById("looper3").addEventListener("click", function(){
   
    
  if(this.className == 'is-playing'){
    this.className = "";
    this.innerHTML = "3: OFF"
    player3.mute = true;

  }else{
    this.className = "is-playing";
    this.innerHTML = "3: ON";

    player3.mute = false;

  }}
  );
  document.getElementById("looper4").addEventListener("click", function(){

    
  if(this.className == 'is-playing'){
    this.className = "";
    this.innerHTML = "4: OFF"
    player4.mute = true;

  }else{
    this.className = "is-playing";
    this.innerHTML = "4: ON";

    player4.mute = false;

  }}
  );
