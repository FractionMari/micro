
function handleOrientation(event) {
  updateFieldIfNotNull('Orientation_a', event.alpha);
  updateFieldIfNotNull('Orientation_b', event.beta);
  updateFieldIfNotNull('Orientation_g', event.gamma);
  incrementEventCount();
}

function incrementEventCount(){
  let counterElement = document.getElementById("num-observed-events")
  let eventCount = parseInt(counterElement.innerHTML)
  counterElement.innerHTML = eventCount + 1;
}

function updateFieldIfNotNull(fieldName, value, precision=10){
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

function handleMotion(event) {


  let xValue = event.acceleration.x;
  let yValue = event.acceleration.y;
  let zValue = event.acceleration.z;
  // let totAcc = (xValue + yValue + zValue);

  let totAcc = Math.sqrt(xValue^2 + yValue^2 + zValue^2)
  let totAcc = xValue(n+1) - xValue(n)

  totAcc = Math.abs(totAcc);
//  totAcc = Math.floor(totAcc);
//Scaling the incoming number
 function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
  var offset = newMin - prevMin,
      scale = (newMax - newMin) / (prevMax - prevMin);
  return function (x) {
      return offset + scale * x;
  };
};

var fn = generateScaleFunction(0, 13, 0.5, 0);
var newAcc = fn(totAcc);

let yGravAcc = event.accelerationIncludingGravity.y;

  
  updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
  updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
  updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);

  updateFieldIfNotNull('Accelerometer_x', event.acceleration.x);
  updateFieldIfNotNull('Accelerometer_y', event.acceleration.y);
  updateFieldIfNotNull('Accelerometer_z', event.acceleration.z);
  updateFieldIfNotNull('Total_acc', newAcc);
  updateFieldIfNotNull('Prev_acc', totAcc);

  updateFieldIfNotNull('Accelerometer_i', event.interval, 2);

  updateFieldIfNotNull('Gyroscope_z', event.rotationRate.alpha);
  updateFieldIfNotNull('Gyroscope_x', event.rotationRate.beta);
  updateFieldIfNotNull('Gyroscope_y', event.rotationRate.gamma);
  incrementEventCount();

  volume.gain.value = newAcc;
  
  // Rotation to control oscillator pitch
  oscillator.frequency.value = yGravAcc * 100;
  oscillator2.frequency.value = yGravAcc * 100 - 13;

}

let is_running = false;
let demo_button = document.getElementById("start_demo");
demo_button.onclick = function(e) {
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

/* window.onload = function() {

  if (playing == 1) {
    //oscillator.frequency.value = x;
    volume.gain.value = totAcc
  }
}; */

// This is the first oscillator
var oscillator;

// creating a second oscillator
var oscillator2;  
var volume;
// var volumeslider = document.getElementById("volume");
var playing;


document.querySelector("#button1").addEventListener('click', function() {
var context = new AudioContext();
oscillator = context.createOscillator();
oscillator2 = context.createOscillator();
oscillator.frequency.value = 180;
oscillator2.frequency.value = 167;
oscillator2.type = "sawtooth";

oscillator.start();
oscillator2.start();

volume = context.createGain();
volume.gain.value = 0.5;

/* volumeslider.oninput = function() {
  volume.gain.value = this.value;
  console.log(this.value);
}   */

oscillator.connect(volume); 
oscillator2.connect(volume); 
volume.connect(context.destination);  

// playing = 1;
});


document.querySelector("#button2").addEventListener('click', function() {
oscillator.stop();
oscillator2.stop();
});