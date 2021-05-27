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

// Tone.js parameters


// Tone.js parameters:
const gainNode = new Tone.Gain().toDestination();
const pingPong = new Tone.PingPongDelay("4n", 0.2).connect(gainNode);
const phaser = new Tone.Phaser().connect(gainNode);
const synth = new Tone.FMSynth().connect(gainNode);
const pitchShift2 = new Tone.PitchShift().connect(gainNode);
const autoFilter = new Tone.PitchShift().connect(gainNode); // connect(pitchShift2);


// Other Variables
let newAcc;
let newAcc2;
let inverse = true;
let is_running = false;
let demo_button = document.getElementById("start_demo");

// Pitch variables
pitchShift2.pitch = 0; // down one octave

// Players
const player = new Tone.Player().connect(gainNode);
const player2 = new Tone.Player().connect(gainNode);
const player3 = new Tone.Player().connect(gainNode);
const player4 = new Tone.Player().connect(gainNode);
const player5 = undefined; 
const player1_2 = new Tone.Player().connect(gainNode);
const player2_2 = new Tone.Player().connect(gainNode);
const player3_2 = new Tone.Player().connect(gainNode);
const player4_2 = new Tone.Player().connect(gainNode);
const player5_2 = new Tone.Player().connect(gainNode);


player.loop = true;
player2.loop = true;
player3.loop = true;
player4.loop = true;
player1_2.loop = true;
player2_2.loop = true;
player3_2.loop = true;
player4_2.loop = true;
player5_2.loop = true;

player.autostart = true;
player2.autostart = true;
player3.autostart = true;
player4.autostart = true;
player1_2.autostart = true;
player2_2.autostart = true;
player3_2.autostart = true;
player4_2.autostart = true;
player5_2.autostart = true;

player.mute = true;
player2.mute = true;
player3.mute = true;
player4.mute = true;
player1_2.mute = true;
player2_2.mute = true;
player3_2.mute = true;
player4_2.mute = true;
player5_2.mute = true;


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
/* 
function handleOrientation(event) {

    updateFieldIfNotNull('Orientation_b', event.beta);
    updateFieldIfNotNull('Orientation_g', event.gamma);
    updateFieldIfNotNull('Orientation_a', event.alpha);

    // Rotation to control oscillator pitch
    //let pitchWheel = event.beta;
    let filterWheel = event.gamma;
    let betaWheel = event.beta;

    let filterScale = generateScaleFunction(0, 90, 10, 300);
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel);

function loopActivate(players1, players2, value) {

  if (betaWheel < value)
  players1.mute = true,
  players2.mute = true;

  else if ((filterWheel > 80) && (betaWheel > value))
  players2.mute = false,
  players1.mute = true;

  else
  players2.mute = true,
  players1.mute = false;

};

loopActivate(player, player1_2, 20);
loopActivate(player2, player2_2, 40);
loopActivate(player3, player3_2, 60);
loopActivate(player4, player4_2, 80);
//loopActivate(player5, player5_2, 80);


 
    updateFieldIfNotNull('filterwheel', filterWheel);
    updateFieldIfNotNull('betawheel', betaWheel);

  }

 */
// function for updating values for sensor data
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }



/* // variables for differing between frames:
let accXdiff = [];
let accYdiff = [];
let accZdiff = [];
var i = 0;
 */
  function handleMotion(event) {
/* 
    i += 1;
    //console.log(event.acceleration.x);
    
    
    accXdiff.push(event.acceleration.x);
    let xFilter = accXdiff[i-2];
    
    accYdiff.push(event.acceleration.y);
    let yFilter = accYdiff[i-2];
    
    accYdiff.push(event.acceleration.y);
    let zFilter = accYdiff[i-2];
    
   // console.log(xFilter);
    
    const accl = event.acceleration;  */



    
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
    var fn = generateScaleFunction(0.3, 11, 0.9, 0);
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.9, newAcc));

    // Scaling values for non-inverted volume-control
    var fn2 = generateScaleFunction(0.3, 11, 0, 0.9);
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.9, newAcc2));

    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.1),
    elem.style.opacity = newAcc2;
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.1),
    elem.style.opacity = newAcc;

    updateFieldIfNotNull('volume_acc', newAcc);
    updateFieldIfNotNull('volume_acc2', newAcc2);
     
    ////////////////////////////////////////////
    ///////// Red Dot Monitoring in GUI ///////
    ///////////////////////////////////////////

/*     // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    // multiplying with 4 to get values from 0-50
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 2.5); */
        // multiplying with 5 to get values from 0-120
        let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 6);
        // multiplying with 4 to get values from 0-60
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
    autoFilter.pitch = xDotValues / 3;

       
       function loopActivate(players1, players2, value) {
       
         if (yDotValues < value)
         players1.mute = true,
         players2.mute = true;
       
         else if ((xDotValues > 50) && (yDotValues > value))
         players2.mute = false,
         players1.mute = true;
       
         else
         players2.mute = true,
         players1.mute = false;
       
       };
       
       loopActivate(player, player1_2, 0);
       loopActivate(player2, player2_2, 10);
       loopActivate(player3, player3_2, 30);
       loopActivate(player4, player4_2, 50);
       //loopActivate(player5, player5_2, 80);
       
       
        
           updateFieldIfNotNull('filterwheel', filterWheel);
           updateFieldIfNotNull('pitchwheel', pitchWheel);
    

        // Effects
        
        
        //let harmonicity = pitchWheel / 10;
        //updateFieldIfNotNull('harmonicity', harmonicity);
        //synth.harmonicity.value = harmonicity;
        phaser.baseFrequency.value = 100;
        phaser.frequency.value = xDotValues;
        phaser.octaves = (yDotValues / 10);
        pingPong.wet.value = xDotValues;
        

    }
 

    var playerBuffers = new Tone.Buffers({
        "drums" : "loops/RolegSong_trommer.mp3",
        "bass" : "loops/RolegSong_bass.mp3",
        "arp" : "loops/RolegSong_orgel1.mp3",
        "bass2" : "loops/RolegSong_piano.mp3",
        "2drums" : "loops/2RolegSong_trommer.mp3",
        "2bass" : "loops/2RolegSong_bass.mp3",
        "2arp" : "loops/2RolegSong_orgel1.mp3",
        "2bass2" : "loops/2RolegSong_piano.mp3",
        "2piano" : "loops/2RolegSong_orgel2.mp3"
    }, 
    function(){
        //play one of the samples when they all load
    
  
    player.buffer = playerBuffers.get("drums");
      player.start();
    player2.buffer = playerBuffers.get("bass");
      player2.start();
    player3.buffer = playerBuffers.get("arp");
      player3.start();
    player4.buffer = playerBuffers.get("bass2");
      player4.start();
  
    player1_2.buffer = playerBuffers.get("2drums");
      player1_2.start();
    player2_2.buffer = playerBuffers.get("2bass");
      player2_2.start();
    player3_2.buffer = playerBuffers.get("2arp");
      player3_2.start();
    player4_2.buffer = playerBuffers.get("2bass2");
      player4_2.start();
    player5_2.buffer = playerBuffers.get("2piano");
      player5_2.start();
  });


    document.getElementById("looper1").addEventListener("click", function(){

        // Request permission for iOS 13+ devices
        if (
            DeviceMotionEvent &&
            typeof DeviceMotionEvent.requestPermission === "function"
          ) {
            DeviceMotionEvent.requestPermission();
          }

          Tone.start();
          window.addEventListener("devicemotion", handleMotion);
          
    
        if (this.className == 'is-playing')
        
        {
          this.className = "is-playing2";
          this.innerHTML = "Loop 2 ON"
          var playerBuffers = new Tone.Buffers({
            "drums" : "loops/drums1_80bpm.mp3",
            "bass" : "loops/bass1_80bpm.mp3",
            "arp" : "loops/arp_80bpm.mp3",
            "bass2" : "loops/bass2_80bpm.mp3",
            "2drums" : "loops/2drums1.mp3",
            "2bass" : "loops/2bass1.mp3",
            "2arp" : "loops/2arp.mp3",
            "2bass2" : "loops/2bass2.mp3",
            "2piano" : "loops/2piano.mp3"
        }, function(){ 
      
          player.buffer = playerBuffers.get("drums");
          player.start();
        player2.buffer = playerBuffers.get("bass");
          player2.start();
        player3.buffer = playerBuffers.get("arp");
          player3.start();
        player4.buffer = playerBuffers.get("bass2");
          player4.start();
      
        player1_2.buffer = playerBuffers.get("2drums");
          player1_2.start();
        player2_2.buffer = playerBuffers.get("2bass");
          player2_2.start();
        player3_2.buffer = playerBuffers.get("2arp");
          player3_2.start();
        player4_2.buffer = playerBuffers.get("2bass2");
          player4_2.start();
        player5_2.buffer = playerBuffers.get("2piano");
          player5_2.start();
      });
      
        }else if (this.className == 'is-playing2')
        
        {
          this.className = "is-playing3";
          this.innerHTML = "Loop 3 ON";
      
          var playerBuffers = new Tone.Buffers({
            "drums" : "loops/RolegSong_trommer.mp3",
            "bass" : "loops/RolegSong_bass.mp3",
            "arp" : "loops/RolegSong_orgel1.mp3",
            "bass2" : "loops/RolegSong_piano.mp3",
            "2drums" : "loops/2RolegSong_trommer.mp3",
            "2bass" : "loops/2RolegSong_bass.mp3",
            "2arp" : "loops/2RolegSong_orgel1.mp3",
            "2bass2" : "loops/2RolegSong_piano.mp3",
            "2piano" : "loops/2RolegSong_orgel2.mp3"
        }, 
        function(){
            //play one of the samples when they all load
        
      
        player.buffer = playerBuffers.get("drums");
          player.start();
        player2.buffer = playerBuffers.get("bass");
          player2.start();
        player3.buffer = playerBuffers.get("arp");
          player3.start();
        player4.buffer = playerBuffers.get("bass2");
          player4.start();
      
        player1_2.buffer = playerBuffers.get("2drums");
          player1_2.start();
        player2_2.buffer = playerBuffers.get("2bass");
          player2_2.start();
        player3_2.buffer = playerBuffers.get("2arp");
          player3_2.start();
        player4_2.buffer = playerBuffers.get("2bass2");
          player4_2.start();
        player5_2.buffer = playerBuffers.get("2piano");
          player5_2.start();
      });
      
    }else if (this.className == 'is-playing3')
        
    {
      this.className = "";
      this.innerHTML = "Loops: OFF";
  

      player.stop();
      player2.stop();
      player3.stop();
      player4.stop();
  
      player1_2.stop();
      player2_2.stop();
      player3_2.stop();
      player4_2.stop();
      player5_2.stop();



      }else{
          this.className = "is-playing";
          this.innerHTML = "Loop 1 ON";
      
          var playerBuffers = new Tone.Buffers({
            "drums" : "loops/jazzloop_drums.mp3",
            "bass" : "loops/jazzloop_bass.mp3",
            "arp" : "loops/jazzloop_piano.mp3",
            "bass2" : "loops/jazzloop_synth.mp3",
            "2drums" : "loops/2jazzloop_drums.mp3",
            "2bass" : "loops/2jazzloop_bass.mp3",
            "2arp" : "loops/2jazzloop_piano.mp3",
            "2bass2" : "loops/2jazzloop_synth.mp3",
            "2piano" : "loops/2jazzloop_cosmic.mp3"
        }, 
        function(){
            //play one of the samples when they all load
        
      
        player.buffer = playerBuffers.get("drums");
          player.start();
        player2.buffer = playerBuffers.get("bass");
          player2.start();
        player3.buffer = playerBuffers.get("arp");
          player3.start();
        player4.buffer = playerBuffers.get("bass2");
          player4.start();
      
        player1_2.buffer = playerBuffers.get("2drums");
          player1_2.start();
        player2_2.buffer = playerBuffers.get("2bass");
          player2_2.start();
        player3_2.buffer = playerBuffers.get("2arp");
          player3_2.start();
        player4_2.buffer = playerBuffers.get("2bass2");
          player4_2.start();
        player5_2.buffer = playerBuffers.get("2piano");
          player5_2.start();
      });
      
        }}
        );



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




    document.getElementById("effectButton1").addEventListener("click", function(){

      if (this.className == 'is-playing')
        
      {
        this.className = "";
        this.innerHTML = "FX1: OFF"
        player.disconnect(pingPong);
        player2.disconnect(pingPong);
        player3.disconnect(pingPong);
        player4.disconnect(pingPong);
        //player5.connect(pingPong);
        player1_2.disconnect(pingPong);
        player2_2.disconnect(pingPong);
        player3_2.disconnect(pingPong);
        player4_2.disconnect(pingPong);
        player5_2.disconnect(pingPong);
      


}else{
  this.className = "is-playing";
  this.innerHTML = "FX1: ON";

  player.connect(pingPong);
  player2.connect(pingPong);
  player3.connect(pingPong);
  player4.connect(pingPong);
  //player5.connect(pingPong);
  player1_2.connect(pingPong);
  player2_2.connect(pingPong);
  player3_2.connect(pingPong);
  player4_2.connect(pingPong);
  player5_2.connect(pingPong);


}}
); 



document.getElementById("effectButton2").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "FX2: OFF"
    player.disconnect(phaser);
    player2.disconnect(phaser);
    player3.disconnect(phaser);
    player4.disconnect(phaser);
    //player5.connect(phaser);
    player1_2.disconnect(phaser);
    player2_2.disconnect(phaser);
    player3_2.disconnect(phaser);
    player4_2.disconnect(phaser);
    player5_2.disconnect(phaser);
  


}else{
this.className = "is-playing";
this.innerHTML = "FX2: ON";

player.connect(phaser);
player2.connect(phaser);
player3.connect(phaser);
player4.connect(phaser);
//player5.connect(phaser);
player1_2.connect(phaser);
player2_2.connect(phaser);
player3_2.connect(phaser);
player4_2.connect(phaser);
player5_2.connect(phaser);


}}
); 



document.getElementById("effectButton3").addEventListener("click", function(){

  if (this.className == 'is-playing')
    
  {
    this.className = "";
    this.innerHTML = "FX3: OFF"
    player.disconnect(autoFilter);
    player2.disconnect(autoFilter);
    player3.disconnect(autoFilter);
    player4.disconnect(autoFilter);
    //player5.connect(autoFilter);
    player1_2.disconnect(autoFilter);
    player2_2.disconnect(autoFilter);
    player3_2.disconnect(autoFilter);
    player4_2.disconnect(autoFilter);
    player5_2.disconnect(autoFilter);
  


}else{
this.className = "is-playing";
this.innerHTML = "FX2: ON";

player.connect(autoFilter);
player2.connect(autoFilter);
player3.connect(autoFilter);
player4.connect(autoFilter);
//player5.connect(autoFilter);
player1_2.connect(autoFilter);
player2_2.connect(autoFilter);
player3_2.connect(autoFilter);
player4_2.connect(autoFilter);
player5_2.connect(autoFilter);


}}
); 

///////////////////////////////////////////////////////////////////////////
///////////// Code for dividing canvas into different sections  /////////////
///////////////////////////////////////////////////////////////////////////

var c = document.getElementById("myContainer3");
var ctx = c.getContext("2d");
var ctx2 = c.getContext("2d");
var ctx3 = c.getContext("2d");

var ctx4 = c.getContext("2d");
var ctx5 = c.getContext("2d");
var ctx6 = c.getContext("2d");

ctx.beginPath();
ctx.moveTo(32.5, 0);
ctx.lineTo(32.5, 150);
ctx.stroke();
ctx2.beginPath();
ctx2.moveTo(65, 0);
ctx2.lineTo(65, 150);
ctx2.stroke();
ctx3.beginPath();
ctx3.moveTo(97.5, 0);
ctx3.lineTo(97.5, 150);
ctx3.stroke();

ctx4.beginPath();
ctx4.moveTo(0, 60);
ctx4.lineTo(150, 60);
ctx4.stroke();

ctx5.beginPath();
ctx5.moveTo(0, 40);
ctx5.lineTo(150, 40);
ctx5.stroke();

ctx6.beginPath();
ctx6.moveTo(0, 20);
ctx6.lineTo(150, 20);
ctx6.stroke();
