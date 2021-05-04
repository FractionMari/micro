function handleMotion(event) {

    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;
    let filterWheel = event.accelerationIncludingGravity.x;
    let pitchWheel = event.accelerationIncludingGravity.y;
    let totAcc = (Math.abs(xValue) + Math.abs(yValue) + Math.abs(zValue));
    let elem = document.getElementById("myAnimation");  
    let fn = generateScaleFunction(0.3, 11, 0.9, 0);
    let fn2 = generateScaleFunction(11, 0.3, 0, 0.9);
    let filterScale = generateScaleFunction(-10, 10, 10, 300);

    // Scaling values for inverted volume-control
    newAcc = fn(totAcc);
    newAcc = (clamp(0, 0.9, newAcc));

    // Scaling values for non-inverted volume-control
    newAcc2 = fn2(totAcc);
    newAcc2 = (clamp(0, 0.9, newAcc2));

    // Switch between inverted and non-inverted volume-control, 
    // and visual feedback indicated by the opacity of the element in GUI
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.1),
    elem.style.opacity = newAcc2;
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.1),
    elem.style.opacity = newAcc;
       

    // The x and y axis have a range from -10  - 10
    // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    // multiplying with 4 to get values from 0-80
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 4);

    // Animation of element in GUI, corresponding with the movement of Y and X axis
    elem.style.top = yDotValues + 'px'; 
    elem.style.left = xDotValues + 'px'; 


    //Control fo filter effect on the X axis 
    filterWheel = Math.abs(filterWheel);
    filterWheel = filterScale(filterWheel);

    // Control of Pitch on the y axis
    // Will give a range from 0-20
    pitchWheel = (pitchWheel * -1) + 10;
    pitchShift(pitchWheel, synth, pentaScale);
    let harmonicity = pitchWheel / 10;
   
    // Values for the rest of the effects here
    autoFilter.baseFrequency = filterWheel;
    synth.harmonicity.value = harmonicity;
    phaser.frequency = harmonicity;
    pingPong.wet.value = xDotValues;


    // Updating values to HTML
    updateFieldIfNotNull('test_x', xValue);
    updateFieldIfNotNull('test_y', yValue);
    updateFieldIfNotNull('test_z', zValue);
    updateFieldIfNotNull('total_acc', totAcc );
    updateFieldIfNotNull('volume_acc', newAcc );
    updateFieldIfNotNull('filterwheel', filterWheel);
    updateFieldIfNotNull('Accelerometer_gx', event.accelerationIncludingGravity.x);
    updateFieldIfNotNull('Accelerometer_gy', event.accelerationIncludingGravity.y);
    updateFieldIfNotNull('Accelerometer_gz', event.accelerationIncludingGravity.z);
    updateFieldIfNotNull('x_dots', xDotValues);
    updateFieldIfNotNull('y_dots', yDotValues);
    updateFieldIfNotNull('pitchwheel', pitchWheel);
    updateFieldIfNotNull('harmonicity', harmonicity);
      
    }
    
