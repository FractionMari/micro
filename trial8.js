
// Trial 28. january 2021. Trying to integrate some effects in the working version
// now. Borrowing some code from Apache tosee if I can integrate it in the app.


/* 
Copyright 2021 Mari Lesteberg

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.  * echovalue
 */

let volume = context.createGain(); 


function RoomEffectsSample(inputs) {
    var ctx = this;
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', function(e) {
        var value = e.target.value;
        ctx.setImpulseResponse(value);
       // console.log(this.value) values 0-3
      });
    }
  
    this.impulseResponses = [];
    this.buffer = null;
    

  
    // Load all of the needed impulse responses and the actual sample.
    var loader = new BufferLoader(context, [
      "jazzkos.mp3",
      "https://webaudioapi.com/samples/room-effects/sounds/impulse-response/telephone.wav",
      "https://webaudioapi.com/samples/room-effects/sounds/impulse-response/muffler.wav",
      "https://webaudioapi.com/samples/room-effects/sounds/impulse-response/spring.wav",
      "https://webaudioapi.com/samples/room-effects/sounds/impulse-response/echo.wav",
    ], onLoaded);
  
    function onLoaded(buffers) {
      ctx.buffer = buffers[0];
      ctx.impulseResponses = buffers.splice(1);
      ctx.impulseResponseBuffer = ctx.impulseResponses[0];
  
      var button = document.querySelector('button');
      button.removeAttribute('disabled');
      button.innerHTML = 'Play/pause';
    }
    loader.load();
  }
  


  RoomEffectsSample.prototype.setImpulseResponse = function(index) {
    this.impulseResponseBuffer = this.impulseResponses[index];



    // Change the impulse response buffer.

    this.convolver.buffer = this.impulseResponseBuffer;
    //console.log(this.impulseResponseBuffer);
    iRvalue = this.impulseResponseBuffer["length"];
    //console.log(iRvalue);



  };
  
  RoomEffectsSample.prototype.playPause = function() {
    if (!this.isPlaying) {



        //// prøver å putte inn gammel kode her ..

        

    



      let echoslider = document.getElementById("echo_value");
      let echovalue = 0;

        echoslider.oninput = function() {
        echovalue = this.value;
        console.log(this.value);
        }   
      // Make a source node for the sample.
      var source = context.createBufferSource();
      source.buffer = this.buffer;
      // Make a convolver node for the impulse response.
      var convolver = context.createConvolver();
      convolver.buffer = this.impulseResponseBuffer;
      //console.log(convolver.buffer["length"]);
      //convolver.buffer["length"] = this.impulseResponseBuffer * echovalue;
      //console.log(convolver.buffer["length"]);
      
//////// Dette er Accelerometerkoden: ///////////

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
  
    let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
    let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));

    let diffAcc = Math.abs(totAcc - totFilter);


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
  
  var fn = generateScaleFunction(0, 1.5, 0.5, 0);
  newAcc = fn(diffAcc);

  function clamp(min, max, val) {
    return Math.min(Math.max(min, +val), max);
  }

newAcc = (clamp(0.1, 0.5, newAcc));
volume.gain.value = newAcc;

}  

  accl.start();


      // Connect the graph.
      source.connect(convolver);
      convolver.connect(volume);
      volume.connect(context.destination);
      // Save references to important nodes.
      this.source = source;
      this.convolver = convolver;
      // Start playback.
      this.source[this.source.start ? 'start': 'noteOn'](0);
    } else {
      this.source[this.source.stop ? 'stop': 'noteOff'](0);
    }
    this.isPlaying = !this.isPlaying;
  };
  
