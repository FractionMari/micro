// Update on 9 April 2021:
// This version contains a better code for differing between motion frames, and is working on both iOS and Android.

// Update on 4 May 2021:
// Ability to upload tracks

  // function for loading an image
  window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var track1 = document.querySelector('audio');


track1.crossOrigin = "Anonymous"; // to bypass cors for imgur image link

track1.src = URL.createObjectURL(this.files[0]); // set src to blob url


// Tone.js parameters:


// let pitchslider = document.getElementById("pitch");

const gainNode = new Tone.Gain().toMaster();

const phaser = new Tone.Phaser({
	frequency: 15,
	octaves: 5,
	baseFrequency: 1000
}).connect(gainNode);

const pingPong = new Tone.PingPongDelay("4n", 0.2).connect(gainNode);
const pitchShift2 = new Tone.PitchShift().connect(gainNode);
const autoFilter = new Tone.PitchShift().connect(gainNode); // connect(pitchShift2);

//instead of a Synth, there is some loops
// Pitch variables
pitchShift2.pitch = 0; // down one octave
// Players
const player = new Tone.Player().connect(autoFilter);
const player2 = new Tone.Player().connect(autoFilter);
const player3 = new Tone.Player().connect(autoFilter);
const player4 = new Tone.Player().connect(autoFilter);
const player5 = undefined; 
const player1_2 = new Tone.Player().connect(autoFilter);
const player2_2 = new Tone.Player().connect(autoFilter);
const player3_2 = new Tone.Player().connect(autoFilter);
const player4_2 = new Tone.Player().connect(autoFilter);
const player5_2 = new Tone.Player().connect(autoFilter);


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

//var result = [];

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
      updateFieldIfNotNull('volume_acc', newAcc );
    
    //monitoring diffAcc

    var fn = generateScaleFunction(0, 10, 0.3, 0);
    newAcc = fn(diffAcc);
    newAcc = (clamp(0, 0.3, newAcc));
    //console.log(newAcc);
    
    var fn2 = generateScaleFunction(1, 2, 0, 0.3);
    newAcc2 = fn2(diffAcc);
    newAcc2 = (clamp(0, 0.3, newAcc2));
    //console.log(newAcc2);
    
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.1);
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.1);


      
      //incrementEventCount();
    }
 




    let is_running = false;
    let demo_button = document.getElementById("start_demo");

    var playerBuffers = new Tone.Buffers({
        "drums" : "audioUrl",
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
          window.addEventListener("deviceorientation", handleOrientation);
    

          
    
        if (this.className == 'is-playing')
        
        {
          this.className = "is-playing2";
          this.innerHTML = "Loop 3 ON"
          var playerBuffers = new Tone.Buffers({
            "drums" : "track1.src",
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
          this.className = "";
          this.innerHTML = "Loop 1 ON";
      
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
      
      }else{
          this.className = "is-playing";
          this.innerHTML = "Loop 2 ON";
      
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
        this.innerHTML = "OFF"
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
  this.innerHTML = "ON";

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
    this.innerHTML = "OFF"
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
this.innerHTML = "ON";

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
/* 
track1.onload = function() {

    URL.revokeObjectURL(track1.src);  // no longer needed, free memory
    

    
   


  } */} } )});