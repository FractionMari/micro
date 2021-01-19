// Prøver med en annen tutorial fra https://w3c.github.io/motion-sensors/
// prøver å kombinere dette med den trial4.js


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
  
  const accl = new Accelerometer({ frequency: 20 });
                
  // Isolate gravity with low-pass filter.
  const filter = new LowPassFilterData(accl, 0.8);

  accl.onreading = () => {

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

      //Scaling the incoming number
   function generateScaleFunction(prevMin, prevMax, newMin, newMax) {
    var offset = newMin - prevMin,
        scale = (newMax - newMin) / (prevMax - prevMin);
    return function (x) {
        return offset + scale * x;
    };
  };
  
  var fn = generateScaleFunction(0, 2, 0.5, 0.1);
  var newAcc = fn(diffAcc);

  function clamp(min, max, val) {
    return Math.min(Math.max(min, +val), max);
  }

  newAcc = (clamp(0.1, 0.5, newAcc));

    // volume control:
    volume.gain.value = newAcc;

    updateFieldIfNotNull('volume_acc', newAcc );

    // console.log(`Isolated gravity (${filter.x}, ${filter.y}, ${filter.z})`);
  }
  accl.start();

  ////// OSCIllATOR ///////
  
    // This is the first oscillator
    var oscillator;
    // creating a second oscillator
    var oscillator2;  
    var volume;

    document.querySelector("#button1").addEventListener('click', function() {
    var context = new AudioContext();
    oscillator = context.createOscillator();
    oscillator2 = context.createOscillator();
    oscillator.frequency.value = 380;
    oscillator2.frequency.value = 280;
    oscillator2.type = "sine";
    
    oscillator.start();
    oscillator2.start();
    
    volume = context.createGain();
    volume.gain.value = 0.5;
    oscillator.connect(volume); 
    oscillator2.connect(volume); 
    volume.connect(context.destination);  
    
    // playing = 1;
    });
    
    
    document.querySelector("#button2").addEventListener('click', function() {
    oscillator.stop();
    oscillator2.stop();
    });
