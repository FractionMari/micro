// Tone.js parameters:
const gainNode = new Tone.Gain().toDestination();
const pingPong = new Tone.PingPongDelay().connect(gainNode);
const phaser = new Tone.Phaser().connect(gainNode);
const autoWah = new Tone.AutoWah(50, 6, -30).connect(gainNode);


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
}).connect(gainNode);
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
}).connect(gainNode);


//const synth = new Tone.FMSynth().connect(gainNode);
//const synth2 = new Tone.DuoSynth().connect(gainNode);

// Other Variables
let newAcc;
let newAcc2;
let inverse = true;
let is_running = false;
let demo_button = document.getElementById("start_demo");


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
var scaleSelect = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"];

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

    // variables for rotation, GUI monitoring and volume control
    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;
    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    let elem = document.getElementById("myAnimation"); 
    let filterWheel = event.accelerationIncludingGravity.x;
    let pitchWheel = event.accelerationIncludingGravity.y;
    
    // Updating values to HTML
    updateFieldIfNotNull('test_x', event.acceleration.x);
    updateFieldIfNotNull('test_y', event.acceleration.y);
    updateFieldIfNotNull('test_z', event.acceleration.z);
    updateFieldIfNotNull('total_acc', totAcc);

    updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
    updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
    updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);

    ///////////////////////////////////////////////
    /////////////// VOLUME VARIABLES //////////////
    ///////////////////////////////////////////////

    // Scaling values for inverted volume-control
    var fn = generateScaleFunction(0.3, 0.6, 0.7, 0);
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.7, newAcc));

    // Scaling values for non-inverted volume-control
    var fn2 = generateScaleFunction(0.3, 0.6, 0, 0.7);
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.7, newAcc2));

    updateFieldIfNotNull('volume_acc', newAcc);
    updateFieldIfNotNull('volume_acc2', newAcc2);
    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.2);
    //elem.style.opacity = newAcc2; //Uncomment to map the opacity of red dot to motion
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.2);
    //elem.style.opacity = newAcc; //Uncomment to map the opacity of red dot to motion
       
    ////////////////////////////////////////////
    ///////// Red Dot Monitoring in GUI ///////
    ///////////////////////////////////////////

    // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    // multiplying with 4 to get values from 0-80
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 4);
    elem.style.top = yDotValues + 'px'; 
    elem.style.left = xDotValues + 'px'; 

    updateFieldIfNotNull('x_dots', xDotValues);
    updateFieldIfNotNull('y_dots', yDotValues);

    ///////////////////////////////////////////////
    /////// Variables for effects and pitch ///////
    ///////////////////////////////////////////////
    // FX2: Filter

    // filter x axis a number between 0 and 8
    let filterXaxis = yDotValues / 8;
/*     var filterScale = generateScaleFunction(-10, 10, 0, 100);
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel); */
    // Gives a value between 0 and 6.5
    filterWheel = (filterWheel + 10) / 3;
    updateFieldIfNotNull('filterwheel', filterWheel);
    //autoWah.baseFrequency = filterWheel;
    autoWah.octaves = filterWheel;
    autoWah.Q.value = filterXaxis;

    // Pitch and scale functions
    // Will give a range from 0-20
    pitchWheel = (pitchWheel * -1) + 10;
    updateFieldIfNotNull('pitchwheel', pitchWheel);
    pitchShift(pitchWheel, synth, scaleSelect);
    pitchShift(pitchWheel, synth2, scaleSelect);

    // Effects
    
    
    //let harmonicity = pitchWheel / 10;
    //updateFieldIfNotNull('harmonicity', harmonicity);
    //synth2.harmonicity.value = harmonicity;
    phaser.baseFrequency.value = 100;
    phaser.frequency.value = xDotValues;
    phaser.octaves = (yDotValues / 10);

    


    // FX1: pingPong delay
    // for y axis effect, get a value between 0-1
    let pingPongYaxis = (yDotValues / 80);
    let pingPongXaxis = xDotValues / 100;
    //pingPong.delayTime.rampTo(pingPongXaxis,pingPongYaxis);
    //pingPong.delayTime.value = pingPongXaxis + "n";
    pingPong.feedback.value = pingPongYaxis;
    pingPong.wet.value = pingPongXaxis;
    //tremolo.frequency = yDotValues;

    }
    


// Buttons and interaction with GUI
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
      synth2.triggerRelease();
      window.removeEventListener("devicemotion", handleMotion);
      is_running = false;

  
    }else if (this.className == 'is-playing2')
        
    {

      this.className = "is-playing";
      this.innerHTML = "Synth 2: ON";

      synth.triggerRelease();
      synth2.triggerAttack("C4"); 
      window.addEventListener("devicemotion", handleMotion);
      is_running = true;  
  
    }else{



      this.className = "is-playing2";
      this.innerHTML = "Synth 1: ON";
      //const synth = new Tone.AMSynth().connect(gainNode);


      synth2.triggerRelease();
      synth.triggerAttack("C4"); 
      window.addEventListener("devicemotion", handleMotion);
      is_running = true;    
  
    }}
    );

let fx1on = false;
let fx2on = false;
let fx3on = false;

document.getElementById("effectButton1").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "FX1: OFF";
    synth.disconnect(pingPong);
    synth2.disconnect(pingPong);
    let fx1on = false;


  }else{
    this.className = "is-playing";
    this.innerHTML = "FX1: ON"
    synth.connect(pingPong);
    synth2.connect(pingPong);
    let fx1on = true;


}}
); 



document.getElementById("effectButton2").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "FX2: OFF";
    synth.disconnect(autoWah);
    synth2.disconnect(autoWah);
    let fx2on = false;


  }else{
    this.className = "is-playing";
    this.innerHTML = "FX2: ON"
    synth.connect(autoWah);
    synth2.connect(autoWah);
    let fx2on = true;



}}
); 

document.getElementById("effectButton3").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "FX3: OFF";
    synth.disconnect(phaser);
    synth2.disconnect(phaser);
    let fx3on = false;


  }else{
    this.className = "is-playing";
    this.innerHTML = "FX3: ON"
    synth.connect(phaser);
    synth2.connect(phaser);
    let fx3on = true;



}}
); 


document.getElementById("scaleButton1").addEventListener("click", function(){

    if (this.className == 'is-playing')
      
    {
      this.className = "is-playing2";
      this.innerHTML = "Penta Scale";
      scaleSelect = ["G1", "A1","C2", "D2", "F2", "G2", "A2","C3", "D3", "F3", "G3", "A3","C4", "D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5", "A5", "C6"];
  

    }else if (this.className == 'is-playing2')
        
    {
      this.className = "";
      this.innerHTML = "whole note Scale";
      scaleSelect = ["C2", "D2", "E2", "Gb2", "Ab2", "Bb2", "C3", "D3", "Gb3", "Ab3", "Bb3", "C4", "D4", "E4", "Gb4", "Ab4", "Bb4", "C5", "D5", "E5", "Gb5", "Ab5", "Bb5", "C6"];


  
    }else{
      this.className = "is-playing";
      this.innerHTML = "Major Scale"
      scaleSelect = ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5"];
  
  
  
  }}
  ); 