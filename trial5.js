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
    constructor(reading2) {
      Object.assign(this, { x2: reading2.x2, y2: reading2.y2, z2: reading2.z2 });
    }

  update(reading2) {
    this.x2 = reading2.x2;
    this.y2 = reading2.y2;
    this.z2 = reading2.z2;
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
    let xFilter = filter2.x2;
    let yFilter = filter2.y2;
    let zFilter = filter2.z2;
  
    let totAcc = Math.sqrt((xValue ** 2) + (yValue ** 2) + (zValue ** 2));
    let totFilter = Math.sqrt((xFilter ** 2) + (yFilter ** 2) + (zFilter ** 2));



    let diffAcc = totAcc - totFilter;

    filter.update(accl); // Pass latest values through filter.
    filter2.update(filter); // Pass latest values through filter.
    updateFieldIfNotNull('test_x', filter.x );
    updateFieldIfNotNull('filter_x', filter2.x2 );

    updateFieldIfNotNull('test_y', filter.y );
    updateFieldIfNotNull('filter_y', filter2.y2 );

    updateFieldIfNotNull('test_z', filter.z );
    updateFieldIfNotNull('filter_z', filter2.z2 );

    updateFieldIfNotNull('total_acc', totAcc );
    updateFieldIfNotNull('total_filter', totFilter );
    updateFieldIfNotNull('diff_acc', diffAcc );


  }
  
  accl.start();