// Prøver med en annen tutorial fra https://w3c.github.io/motion-sensors/
function updateFieldIfNotNull(fieldName, value, precision=2){
    if (value != null)
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
  }

// LowPassFilterData(reading, bias)
/* class LowPassFilterData {
    constructor(reading) {
      Object.assign(this, { x: reading.x, y: reading.y, z: reading.z });
    } */

class LowPassFilterData {
    constructor(reading, bias) {
      Object.assign(this, { x: reading.x, y: reading.y, z: reading.z });
      this.bias = bias;
    }
/*   // experimenting
    update(reading) {
      this.x = reading.x;
      this.y = reading.y;
      this.z = reading.z;
    } */

    update(reading) {
      this.x = this.x * this.bias + reading.x * (1 - this.bias);
      this.y = this.y * this.bias + reading.y * (1 - this.bias);
      this.z = this.z * this.bias + reading.z * (1 - this.bias);
    }
    

    // removing the filter, but trying to preserve the delay of updated frames

  };

  // LowPassFilterData2 experiment
class LowPassFilterData2 {
    constructor(reading) {
      Object.assign(this, { x: reading.x, y: reading.y, z: reading.z });
    }

  update(reading) {
    this.x = reading.x;
    this.y = reading.y;
    this.z = reading.z;
  }

};
  
  
  const accl = new Accelerometer({ frequency: 20 });
                
  // Isolate gravity with low-pass filter.
  const filter = new LowPassFilterData(accl, 0.8);

  const filter2 = new LowPassFilterData2(filter);

  
  accl.onreading = () => {

    let xValue = filter.x;
    let yValue = filter.y;
    let zValue = filter.z;
    let xFilter = filter2.x;
    let yFilter = filter2.y;
    let zFilter = filter2.z;
  
    let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
    let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));



    let diffAcc = totAcc - totFilter;

    filter.update(accl); // Pass latest values through filter.
    updateFieldIfNotNull('test_x', filter.x );
    updateFieldIfNotNull('filter_x', filter2.x );

    updateFieldIfNotNull('test_y', filter.y );
    updateFieldIfNotNull('filter_y', filter2.y );

    updateFieldIfNotNull('test_z', filter.z );
    updateFieldIfNotNull('filter_z', filter2.z );

    updateFieldIfNotNull('total_acc', totAcc );
    updateFieldIfNotNull('total_filter', totFilter );
    updateFieldIfNotNull('diff_acc', diffAcc );


  }
  
  accl.start();