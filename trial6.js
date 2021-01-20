// Trial 6: går over til LYDFIL i stedet for oscillator.
// Prøver med en annen tutorial fra https://w3c.github.io/motion-sensors/
// prøver å kombinere dette med den trial4.js
// Fikk ikke dette helt til, det er en crackling sound på volumet som jeg prøvde å fikse.
// Prøver videre med å spille av audio i stedet for oscillator.

    // Method 1 for loading sound
    function loadSound(soundfile) {
        var request = new XMLHttpRequest();
        request.open('GET', soundfile, true);
        request.responseType = 'arraybuffer';
        // Decode asynchronously
        request.onload = function() {
          context.decodeAudioData(request.response, function(buffer) {
            player.buffer = buffer;
            player.start();
          }, onError);
        }
        request.send();
        
      }
      function onError(){
        console.log("The file could not be loaded");
      }

    var AudioContext = window.AudioContext || window.webkitAudioContext;  
    var volume;
    var newAcc;
    var context, player;
    var playing = 0;

    document.querySelector("#button1").addEventListener('click', function() {
    context = new AudioContext();
    volume = context.createGain();
    // create a sound input node from an audio sample
    player = context.createBufferSource();
    player.loop = true;
    // loading the sound
    loadSound("jazzkos.mp3");
    /* 
    var volumeslider = document.getElementById("volume_acc");
    volumeslider.oninput = function() {
    volume.gain.value = this.value;
    } */
    volume.gain.value = 0.5;
    player.connect(volume);    
    volume.connect(context.destination);  
    playing = 1;
    
    

    });
    
    // stop button of the oscillator
    
    document.querySelector("#button2").addEventListener('click', function() {
        player.stop();
        playing = 0;

    });



function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

  
class LowPassFilterData {
    constructor(reading, bias) {
      Object.assign(this, { x: reading.x, y: reading.y, z: reading.z });
      this.bias = bias;
    }
  
    update(reading) {
      this.x = this.x * this.bias + reading.x * (1 - this.bias);
      this.y = this.y * this.bias + reading.y * (1 - this.bias);
      this.z = this.z * this.bias + reading.z * (1 - this.bias);
    }



  };
  
  const accl = new Accelerometer({ frequency: 50 });
                
  // Isolate gravity with low-pass filter.
  const filter = new LowPassFilterData(accl, 0.8);

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

    let diffAcc = totAcc - totFilter;
   // diffAcc = Math.abs(diffAcc);

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

      //Scaling the incoming number
   function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
    var offset = newMin - prevMin,
        scale = (newMax - newMin) / (prevMax - prevMin);
    return function (x) {
        return offset + scale * x;
    };
  };
  
  var fn = generateScaleFunction(0, 2, 0.5, 0.1);
  newAcc = fn(diffAcc);

  function clamp(min, max, val) {
    return Math.min(Math.max(min, +val), max);
  }

newAcc = (clamp(0.1, 0.5, newAcc));
volume.gain.value = newAcc;

}  




    


  accl.start();


