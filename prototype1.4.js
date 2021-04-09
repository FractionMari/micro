// Update on 9 April 2021:
// This version contains a better code for differing between motion frames, and is working on both iOS and Android.


// Tone.js parameters:

const gainNode = new Tone.Gain().toDestination();
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
var diatonicScale = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3"];
var pentaScale = ["C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4"];
// Function for shifting pitch
function pitchShift (pitch, instrument, scale) {
  const intervalChange = 30;
  const points = Math.floor(pitch / intervalChange);

  if (points >= 12)
  instrument.frequency.value = scale[11];
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


// orientation handling
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
    pitchShift(pitchWheel, synth2, diatonicScale);
    let harmonicity = pitchWheel / 180;
    updateFieldIfNotNull('harmonicity', harmonicity);
    //autoFilter.baseFrequency = filterWheel;
    synth.harmonicity.value = harmonicity;

  }


function incrementEventCount(){
let counterElement = document.getElementById("num-observed-events")
let eventCount = parseInt(counterElement.innerHTML)
counterElement.innerHTML = eventCount + 1;
//  updateFieldIfNotNull('eventcount', eventCount );
}

// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }




// variables for differing between frames:
let accXdiff = [];
let accYdiff = [];
let accZdiff = [];
var i = 0;

  function handleMotion(event) {

    i += 1;
    //console.log(event.acceleration.x);
    
    
    accXdiff.push(event.acceleration.x);
    let xFilter = accXdiff[i-2];
    
    accYdiff.push(event.acceleration.y);
    let yFilter = accYdiff[i-2];
    
    accYdiff.push(event.acceleration.y);
    let zFilter = accYdiff[i-2];
    
   // console.log(xFilter);
    
    const accl = event.acceleration; 
    
      let xValue = event.acceleration.x; 
      let yValue = event.acceleration.y; 
      let zValue = event.acceleration.z;
    
      let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
      let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));
      let diffAcc = (Math.abs(totAcc - totFilter)) * 10;
    
      updateFieldIfNotNull('test_x', accl.x );
    
      updateFieldIfNotNull('filter_x', xFilter);
    
      updateFieldIfNotNull('test_y', accl.y );
      updateFieldIfNotNull('filter_y', yFilter );
    
      updateFieldIfNotNull('test_z', accl.z );
      updateFieldIfNotNull('filter_z', zFilter );
    
      updateFieldIfNotNull('total_acc', totAcc );
      updateFieldIfNotNull('total_filter', totFilter );
      updateFieldIfNotNull('diff_acc', diffAcc );
    
    /* 
      updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
      updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
      updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);
    
      updateFieldIfNotNull('Accelerometer_x', event.acceleration.x);
      updateFieldIfNotNull('Accelerometer_y', event.acceleration.y);
      updateFieldIfNotNull('Accelerometer_z', event.acceleration.z);
    
      updateFieldIfNotNull('Accelerometer_i', event.interval, 2);
    
      updateFieldIfNotNull('Gyroscope_z', event.rotationRate.alpha);
      updateFieldIfNotNull('Gyroscope_x', event.rotationRate.beta);
      updateFieldIfNotNull('Gyroscope_y', event.rotationRate.gamma); */
      
      updateFieldIfNotNull('volume_acc', newAcc );
    //monitoring diffAcc
    console.log(diffAcc);



    var fn = generateScaleFunction(0, 4, 0.3, 0);
    newAcc = fn(diffAcc);
    newAcc = (clamp(0, 0.3, newAcc));
    console.log(newAcc);
    
    var fn2 = generateScaleFunction(1, 2, 0, 0.3);
    newAcc2 = fn2(diffAcc);
    newAcc2 = (clamp(0, 0.3, newAcc2));
    console.log(newAcc2);
    
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.2);
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.2);
      
      incrementEventCount();
    }
    



    let is_running = false;
    let demo_button = document.getElementById("start_demo");
/*     demo_button.onclick = function(e) {
      e.preventDefault();
      
      // Request permission for iOS 13+ devices
      if (
        DeviceMotionEvent &&
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        DeviceMotionEvent.requestPermission();
      }
      
      if (is_running){
        window.removeEventListener("devicemotion", handleMotion);
        window.removeEventListener("deviceorientation", handleOrientation);
        demo_button.innerHTML = "Start demo";
        demo_button.classList.add('btn-success');
        demo_button.classList.remove('btn-danger');
        is_running = false;
      }else{
        window.addEventListener("devicemotion", handleMotion);
        window.addEventListener("deviceorientation", handleOrientation);
        document.getElementById("start_demo").innerHTML = "Stop demo";
        demo_button.classList.remove('btn-success');
        demo_button.classList.add('btn-danger');
        is_running = true;
      }
    };
     */


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

  document.getElementById("button1").addEventListener("click", function(){

  //  e.preventDefault();
      
    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    
   
    
    if(this.className == 'is-playing'){
      this.className = "";
      this.innerHTML = "Synth: OFF"
      synth.triggerRelease();
    //  synth2.triggerRelease();

      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
/*       demo_button.innerHTML = "Start demo";
      demo_button.classList.add('btn-success');
      demo_button.classList.remove('btn-danger'); */
      is_running = false;
  
    }else{
      this.className = "is-playing";
      this.innerHTML = "Synth: ON";
      synth.triggerAttack("C4"); 

      window.addEventListener("devicemotion", handleMotion);
      window.addEventListener("deviceorientation", handleOrientation);
/*       document.getElementById("start_demo").innerHTML = "Stop demo";
      demo_button.classList.remove('btn-success');
      demo_button.classList.add('btn-danger'); */
      is_running = true;
      
  
    }}
    );