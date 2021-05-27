# Micromotion app prototypes

More about the apps [here](https://www.uio.no/ritmo/english/projects/micro/subprojects/apps/)


In the micromotion apps, we use accelerometer and gyroscope sensor data from the phone to detect tiny changes in movement. The user is supposed to hold the phone in his/her hand, and by doing different kinds of gesture, the user creates music in different kinds of ways.

The prototypes are written in JavaScript/HTML/CSS and must be opened on android or iPhone to work, and can be reached from this link: 

* https://fractionmari.github.io/micro/


### Sverm

The apps are related to the micromotion [Sverm instruments](https://www.uio.no/ritmo/english/projects/completed-projects/sverm/) which were an artistic research project by Alexander R. Jensenius and Kari Anne Vadstensvik Bjerkestrand, investigating standstill and micromotion in the context of a dance performance.

Made by Mari Lesteberg, after an idea by Alexander R. Jensenius, spring 2021


### Code


#### Accelerometer values

We are using [handleMotion Event](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event) from the JavaScript Sensors API to get the accelerometer data from the mobile device: 

```javascript
      window.addEventListener("devicemotion", handleMotion);
    
```

```javascript

    let xValue = event.acceleration.x; 
    let yValue = event.acceleration.y; 
    let zValue = event.acceleration.z;

        // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    // multiplying with 4 to get values from 0-80
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 4);
```

#### Synth

```javascript

const synth = new Tone.FMSynth().connect(gainNode);
```

In the first prototype, we use a simple FM synth from the Tone.js library, but this can easily be replaced.

#### Effects

Effects from the [Tone.js API](https://tonejs.github.io/docs/14.7.77/index.html) are used. E.g. the PingPongDelay:
```javascript
const pingPong = new Tone.PingPongDelay("4n", 0.2).connect(gainNode);
```
In the below example, values from the accelerometer x axis are used to control the ping pong effect:

```javascript
    pingPong.wet.value = xDotValues;
```

#### Visuals

A red dot inside the micro wave oven gives the user a visual feedback on what is heard when the mobile phone is tilted. The position of the dot change when the mobile phone is tilted:

```javascript
    ////////////////////////////////////////////
    ///////// Red Dot Monitoring in GUI ///////
    ///////////////////////////////////////////

    // multiplying with 5 to get values from 0-100
    let xDotValues = (((event.accelerationIncludingGravity.x * -1) + 10) * 5);
    // multiplying with 4 to get values from 0-50
    let yDotValues = ((event.accelerationIncludingGravity.y  + 10) * 2.5);
    elem.style.top = yDotValues + 'px'; 
    elem.style.left = xDotValues + 'px'; 
```


#### Inverted mapping

In the apps, inverted mapping are used in different ways, which means that one will get the opposite effect when force is used. One example is that the volume will decrease the more you move your device: 

```javascript
    if (inverse == false)
    gainNode.gain.rampTo(newAcc2, 0.1),
    elem.style.opacity = newAcc2;
    else
    // more smooth change of volume:
    gainNode.gain.rampTo(newAcc, 0.1),
    elem.style.opacity = newAcc;
```

### Future ideas

Future ideas for this app is to include a recording function, or a version that allows the user to upload own musical tracks.
### Feedback?

If you have any feedback or suggestions about the apps, please give Mari a note on: lesteberg@gmail.com, or fill out this [form](https://fractionmari.github.io/micro/feedback.html).