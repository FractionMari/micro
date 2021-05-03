// Update on 9 April 2021:
// This version contains a better code for differing between motion frames, and is working on both iOS and Android.

// Update 2. may 2021:
// Two major changes: Going to use only accelerometer data, no orientation and gyroscope
// Use only event.acceleration to decide QOM
// event.accelerationIncludingGravity will do the tilting. Looks more stable.

// 3. may:
// Will try to use an easier way to detect QOM

// Tone.js parameters:

const gainNode = new Tone.Gain().toDestination();
const pingPong = new Tone.PingPongDelay("4n", 0.2).connect(gainNode);
const tremolo = new Tone.Tremolo(9, 0.75).connect(gainNode);
const phaser = new Tone.Phaser({
	frequency: 15,
	octaves: 5,
	baseFrequency: 1000
}).connect(gainNode);

const autoFilter = new Tone.AutoWah().connect(gainNode);
const synth = new Tone.FMSynth().connect(autoFilter);


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
var pentaScale = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"];

// Function for shifting pitch
function pitchShift (pitch, instrument, scale) {
  // const intervalChange = 1;
//   const points = Math.floor(pitch / intervalChange);
const points = pitch;

  if (points >= 20)
  instrument.frequency.value = scale[19];
  else if (points >= 19)
  instrument.frequency.value = scale[18];
  else if (points >= 18)
  instrument.frequency.value = scale[17];
  else if (points >= 17)
  instrument.frequency.value = scale[16];
  else if (points >= 16)
  instrument.frequency.value = scale[15];
  else if (points >= 15)
  instrument.frequency.value = scale[14];
  else if (points >= 14)
  instrument.frequency.value = scale[13];
  else if (points >= 13)
  instrument.frequency.value = scale[12];
  else if (points >= 12)
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


// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

// Function for handling motion
  function handleMotion(event) {


    const accl = event.acceleration; 
    
    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;

    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    

    updateFieldIfNotNull('test_x', accl.x );

    updateFieldIfNotNull('test_y', accl.y );

    updateFieldIfNotNull('test_z', accl.z );

    updateFieldIfNotNull('total_acc', totAcc );

       

    let elem = document.getElementById("myAnimation");   
    

   var fn = generateScaleFunction(0.3, 1, 0.9, 0);
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.9, newAcc));

    updateFieldIfNotNull('volume_acc', newAcc );

    var fn2 = generateScaleFunction(11, 0.3, 0, 0.9);
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.9, newAcc2));

    
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.1),
    elem.style.opacity = newAcc2;
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.1),
    elem.style.opacity = newAcc;
       


          // Rotation to control oscillator pitch
    let filterWheel = event.accelerationIncludingGravity.x;
    let pitchWheel = event.accelerationIncludingGravity.y;

      
      updateFieldIfNotNull('filterwheel', filterWheel);

      // The x and y axis have a range from -10  - 10
      updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
      updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
      updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);




    // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
// multiplying with 4 to get values from 0-80
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 4);
    elem.style.top = yDotValues + 'px'; 
    elem.style.left = xDotValues + 'px'; 

    updateFieldIfNotNull('x_dots', xDotValues);
    updateFieldIfNotNull('y_dots', yDotValues);



    
    let filterScale = generateScaleFunction(-10, 10, 10, 300);

    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel);
    //filterWheel = filterWheel + 50;
    //filterWheel = Math.abs(filterWheel * 6);

    // Will give a range from 0-20
    pitchWheel = (pitchWheel * -1) + 10;
    updateFieldIfNotNull('pitchwheel', pitchWheel);

    pitchShift(pitchWheel, synth, pentaScale);
    //pitchShift(pitchWheel, synth2, diatonicScale);
    let harmonicity = pitchWheel / 10;
    updateFieldIfNotNull('harmonicity', harmonicity);
    autoFilter.baseFrequency = filterWheel;
    synth.harmonicity.value = harmonicity;
    phaser.frequency = harmonicity;
    pingPong.wet.value = xDotValues;
    //console.log(event.alpha / 360);

/*     if (Math.abs(event.gamma) > 20)
      synth3.triggerAttackRelease();
      console.log(Math.abs(event.gamma));
      pitchShift(Math.abs(event.gamma), synth3, diatonicScale); */

      
    }
    



    let is_running = false;
    let demo_button = document.getElementById("start_demo");



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
    //   window.removeEventListener("deviceorientation", handleOrientation);
/*       demo_button.innerHTML = "Start demo";
      demo_button.classList.add('btn-success');
      demo_button.classList.remove('btn-danger'); */
      is_running = false;
  
    }else{
      this.className = "is-playing";
      this.innerHTML = "Synth: ON";
      synth.triggerAttack("C4"); 

      window.addEventListener("devicemotion", handleMotion);
    //   window.addEventListener("deviceorientation", handleOrientation);
/*       document.getElementById("start_demo").innerHTML = "Stop demo";
      demo_button.classList.remove('btn-success');
      demo_button.classList.add('btn-danger'); */
      is_running = true;
      
  
    }}
    );


document.getElementById("effectButton1").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "OFF";
    synth.disconnect(pingPong);


  }else{
    this.className = "is-playing";
    this.innerHTML = "ON"
    synth.connect(pingPong);



}}
); 



document.getElementById("effectButton2").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "OFF";
    synth.disconnect(tremolo);


  }else{
    this.className = "is-playing";
    this.innerHTML = "ON"
    synth.connect(tremolo);



}}
); 

document.getElementById("effectButton3").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "OFF";
    synth.disconnect(phaser);


  }else{
    this.className = "is-playing";
    this.innerHTML = "ON"
    synth.connect(phaser);



}}
); 