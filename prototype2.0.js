// This prototype is an app for android and iOs phones, which uses
// accelerometer and gyroscoe data to control a loop. 
// The prototype was developed by Mari Lesteberg 
// from Janury - June 2021, supported by RITMO / University of Oslo


// Functioning prototype 1: Tone.js 15. February
// The oscillator version with new code + adding the Tone.js library.


// 11. februar: including the Tone.js to improve sound quality
//1. og 2. mars: creating a loop function
//16. april: making it work for iOS

// 4. may
// visuals update and update with the new and better QOM

// 26. mai

 
// Tone.js parameters:
const gainNode = new Tone.Gain().toDestination();
const pingPong = new Tone.PingPongDelay().connect(gainNode);
const phaser = new Tone.Phaser().connect(pingPong);


const synth = new Tone.MonoSynth({
	oscillator: {
		type: "square"
	},
	envelope: {
		attack: 0.5,
		decay: 0.2,
		sustain: 1.0,
		release: 0.8
	}
}).connect(phaser);
const synth2 = new Tone.MonoSynth({
	oscillator: {
		type: "sine"
	},
	envelope: {
		attack: 0.5,
		decay: 0.2,
		sustain: 1.0,
		release: 0.8
	}
}).connect(phaser);

const synth3 = new Tone.PluckSynth().connect(phaser);

const pitchShift2 = new Tone.PitchShift().connect(gainNode);
const autoFilter = new Tone.PitchShift().connect(gainNode); // connect(pitchShift2);

gainNode.gain.value = 0.3;

// Other Variables
let newAcc;
let newAcc2;
let inverse = true;
let is_running = false;
let demo_button = document.getElementById("start_demo");
Tone.Transport.bpm.value = 20;



  // Random tone generator 
  const freq = note => 2 ** (note / 12) * 440; // 440 is the frequency of A4
  // the bitwise Or does the same as Math.floor
  const notes = [ -15, -14, -13, -12, -11, -10, -9, -8, -7,  -6, -5, -4, -3 ,-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Close to your 100, 400, 1600 and 6300

  let randomArray = [];
  let randomArray2 = [];
  let randomArray3 = [];
  function createRandomness() {
    for (var i = 0; i < 100; i += 1) {

      const randomNote = () => notes[Math.random() * notes.length | 0]; // the bitwise Or does the same as Math.floor
  
      let random = freq(randomNote());
      randomArray.push(random);
  
  
      const randomNote2 = () => notes[Math.random() * notes.length | 0]; // the bitwise Or does the same as Math.floor
     let random2 = freq(randomNote2());
     randomArray2.push(random2);
  
     const randomNote3 = () => notes[Math.random() * notes.length | 0]; // the bitwise Or does the same as Math.floor
     let random3 = freq(randomNote3());
     randomArray3.push(random3);



  };
  }


var pattern = new Tone.Pattern(function(time, note){
	synth.triggerAttackRelease(note, 0.5);
}, randomArray);
var pattern2 = new Tone.Pattern(function(time, note){
	synth2.triggerAttackRelease(note, 0.5);
}, randomArray2);
var pattern3 = new Tone.Pattern(function(time, note){
	synth3.triggerAttackRelease(note, 0.5);
}, randomArray3);

pattern.start();
pattern2.start();
pattern3.start();
pattern.mute = false;
pattern2.mute = true;
pattern3.mute = true;


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

// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }


  function handleMotion(event) {

    
// variables for rotation, GUI monitoring and volume control
    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;
    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    let elem = document.getElementById("myAnimation3"); 
    let filterWheel = event.accelerationIncludingGravity.x;
    let pitchWheel = event.accelerationIncludingGravity.y;
    //let zWheel = event.accelerationIncludingGravity.z;
    // Updating values to HTML
    updateFieldIfNotNull('test_x', event.acceleration.x);
    updateFieldIfNotNull('test_y', event.acceleration.y);
    updateFieldIfNotNull('test_z', event.acceleration.z);
    updateFieldIfNotNull('total_acc', totAcc);
    updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
    updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
    updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);
    
    updateFieldIfNotNull('filterwheel', filterWheel);
    updateFieldIfNotNull('pitchwheel', pitchWheel);

    ///////////////////////////////////////////////
    /////////////// VOLUME VARIABLES //////////////
    ///////////////////////////////////////////////

    // Scaling values for inverted volume-control
    var fn = generateScaleFunction(0.3, 3, 0.9, 0);
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.9, newAcc));
    let tempo = Math.floor(newAcc * 100);

    // Scaling values for non-inverted volume-control
    var fn2 = generateScaleFunction(0.3, 3, 0, 0.9);
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.9, newAcc2));
    let tempo2 = Math.floor(newAcc2 * 100);

    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI
    if (inverse == false)
    //gainNode.gain.rampTo(newAcc2, 0.1),
    Tone.Transport.bpm.rampTo(tempo2, 0.5);
    //elem.style.opacity = newAcc2; //Uncomment to map the opacity of red dot to motion
    else
    // more smooth change of volume:
    //gainNode.gain.rampTo(newAcc, 0.1),
    Tone.Transport.bpm.rampTo(tempo, 0.5);
    //elem.style.opacity = newAcc;//Uncomment to map the opacity of red dot to motion

    updateFieldIfNotNull('volume_acc', newAcc);
    updateFieldIfNotNull('volume_acc2', newAcc2);
     
    ////////////////////////////////////////////
    ///////// Red Dot Monitoring in GUI ///////
    ///////////////////////////////////////////


        // multiplying with 6 to get values from 0-120
        let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 6);
        // multiplying with 3 to get values from 0-60
        let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 3);
    elem.style.top = yDotValues + 'px'; 
    elem.style.left = xDotValues + 'px'; 

    updateFieldIfNotNull('x_dots', xDotValues);
    updateFieldIfNotNull('y_dots', yDotValues);
      

    ///////////////////////////////////////////////
    /////// Variables for effects and pitch ///////
    ///////////////////////////////////////////////
    // Filter
    var filterScale = generateScaleFunction(-10, 10, 10, 300);
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel);
    autoFilter.baseFrequency = filterWheel;

        
           updateFieldIfNotNull('filterwheel', filterWheel);
           updateFieldIfNotNull('pitchwheel', pitchWheel);
    

        // Effects
        
        
        //let harmonicity = pitchWheel / 10;
        //updateFieldIfNotNull('harmonicity', harmonicity);
        //synth.harmonicity.value = harmonicity;
        phaser.baseFrequency.value = 100;
        phaser.frequency.value = xDotValues;
        phaser.octaves = (yDotValues / 10);
        pingPong.feedback.value = (xDotValues / 200);
        
        // On and off Pattern1
        if ((yDotValues < 30) && (xDotValues < 30))
        pattern.mute = false;

        else if ((yDotValues > 40) && (xDotValues > 80))
        pattern.mute = true;

        // On and off Pattern2
        if ((yDotValues < 30) && (xDotValues > 80))
        pattern2.mute = false;

        else if ((yDotValues > 40) && (xDotValues < 30))
        pattern2.mute = true;

    
        // On and off Pattern3
        if (yDotValues < 3)
        pattern3.mute = false;

        else if (yDotValues > 45)
        pattern3.mute = true;

        
    }
 

    document.getElementById("looper1").addEventListener("click", function() {

                   // Request permission for iOS 13+ devices
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
      

      if(this.className == 'is-playing'){
      this.className = "";
      this.innerHTML = "Press to START"
      gainNode.gain.value = 0;
      window.removeEventListener("devicemotion", handleMotion);

      }else{
      this.className = "is-playing";
      this.innerHTML = "Press to STOP";
      gainNode.gain.value = 0.3;
      Tone.Transport.start();
      Tone.start();
      window.addEventListener("devicemotion", handleMotion);

      }
	


  });


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


