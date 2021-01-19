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
  
    let totAcc = Math.sqrt(Math.abs(xValue^2) + Math.abs(yValue^2) + Math.abs(zValue^2));
    let totFilter = Math.sqrt(Math.abs(xFilter^2) + Math.abs(yFilter^2) + Math.abs(zFilter^2));

    let diffAcc = totAcc - totFilter;

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

    // volume control:
    volume.gain.value = diffAcc;

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
    oscillator2.frequency.value = 157;
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
