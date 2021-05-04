# Micromotion app prototypes

More about the apps [here](https://www.uio.no/ritmo/english/projects/micro/subprojects/apps/)


In the micromotion apps, we use accelerometer and gyroscope sensor data from the phone to detect tiny changes in movement. The user is supposed to hold the phone in his/her hand, and by doing different kinds of gesture, the user creates music in different kinds of ways.

The prototypes are written in JavaScript/HTML/CSS and must be opened on android or iPhone to work, and can be reached from these two links: 

* [prototype 1](https://fractionmari.github.io/micro/)

* [prototype 2](https://fractionmari.github.io/micro/prototype3.html)

### Sverm

The apps are related to the micromotion Sverm instruments which were an artistic research project by Alexander R. Jensenius and Kari Anne Vadstensvik Bjerkestrand, investigating standstill and micromotion in the context of a dance performance.

Made by Mari Lesteberg, after an idea by Alexander R. Jensenius, spring 2021


### Code

#### Synth

```javascript

const synth = new Tone.FMSynth().connect(gainNode);
```

In the first prototype, we use a simple FM synth from the Tone.js library, but this can easily be replaced.

#### Effects
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

#### Accelerometer values
#### Inverted mapping
#### Scale

### Future ideas

Future ideas for this app is to include a recording function, or a version that allows the user to upload own musical tracks.
### Feedback?

If you have any feedback or suggestions about the apps, please give Mari a note on: lesteberg@gmail.com 