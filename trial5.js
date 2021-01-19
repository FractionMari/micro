// Prøver med en annen tutorial fra https://w3c.github.io/motion-sensors/
function updateFieldIfNotNull(fieldName, value, precision=10){
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
    filter.update(accl); // Pass latest values through filter.
    updateFieldIfNotNull('test_x', filter.x );
    updateFieldIfNotNull('test_y', filter.y );
    updateFieldIfNotNull('test_z', filter.z );
    console.log(`Isolated gravity (${filter.x}, ${filter.y}, ${filter.z})`);
  }
  
  accl.start();