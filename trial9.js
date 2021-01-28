// Annet forsøk den 28. januar. 


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

    // Preparing the audio variables
    var AudioContext = window.AudioContext || window.webkitAudioContext;  
    var volume;
    var newAcc;
    var context, player;
    var playing = 0;
    
    // A button for playback of music track
    document.querySelector("#button1").addEventListener('click', function() {
    context = new AudioContext();
    volume = context.createGain();
    var biquadFilter = context.createBiquadFilter();
    
    // Manipulate the Biquad filter

    biquadFilter.type = "bandpass";
    biquadFilter.frequency.value = 1000;
    biquadFilter.Q.value = 5;
    biquadFilter.detune.value = 100;

    //// testing of biquad vlaues
    var biquad_detune_slider = document.getElementById("biquad_detune");
    var biquad_gain_slider = document.getElementById("biquad_gain");
    var biquad_freq_slider = document.getElementById("biquad_freq");

    biquad_detune_slider.oninput = function() {
        biquadFilter.detune.value = this.value;
    }  

    biquad_gain_slider.oninput = function() {
        biquadFilter.Q.value = this.value;
    }  

    biquad_freq_slider.oninput = function() {
        biquadFilter.frequency.value = this.value;
    }  


    // create a sound input node from an audio sample
    player = context.createBufferSource();
    player.loop = true;
    // loading the sound
    loadSound("jazzkos.mp3");
    // Setting default volume value
    volume.gain.value = 0.5;
    player.connect(biquadFilter);
    biquadFilter.connect(volume)    
    volume.connect(context.destination);  
    playing = 1;


    
    

    });
    
    // stop button of the music player
    
    document.querySelector("#button2").addEventListener('click', function() {
        player.stop();
        playing = 0;

    });


// function for updating values for sensor data

function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

// LowPassFilterData(reading, bias)

class LowPassFilterData {
  constructor(reading) {
    Object.assign(this, { x: reading.x, y: reading.y, z: reading.z });
  }
  
    update(reading) {
      this.x = reading.x;
      this.y = reading.y;
      this.z = reading.z;
    }
/*     update(reading) {
      this.x = this.x * this.bias + reading.x * (1 - this.bias);
      this.y = this.y * this.bias + reading.y * (1 - this.bias);
      this.z = this.z * this.bias + reading.z * (1 - this.bias);
    } */



  };
  
  const accl = new Accelerometer({ frequency: 50 });
                
  // Isolate gravity with low-pass filter.
  const filter = new LowPassFilterData(accl);

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

    let diffAcc = Math.abs(totAcc - totFilter);
    var fn_biquad = generateScaleFunction(0, 10, 0, 5000);
    let biquadAcc = Math.abs(zValue);
    biquadAcc = fn_biquad(biquadAcc)
    


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
    updateFieldIfNotNull('biquad', biquadAcc );

  //Scaling the incoming number
   function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
    var offset = newMin - prevMin,
        scale = (newMax - newMin) / (prevMax - prevMin);
    return function (x) {
        return offset + scale * x;
    };

    
  };

  function clamp(min, max, val) {
    return Math.min(Math.max(min, +val), max);
  }
  var fn = generateScaleFunction(0, 1.5, 0.5, 0);


  newAcc = fn(diffAcc);



newAcc = (clamp(0.1, 0.5, newAcc));
volume.gain.value = newAcc;
biquadFilter.frequency.value = biquadAcc;

}  


  accl.start();


