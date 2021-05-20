
const synth = new Tone.Synth().toDestination();

    // Random tone generator 
    const freq = note => 2 ** (note / 12) * 440; // 440 is the frequency of A4
    // the bitwise Or does the same as Math.floor
    const notes = [ -15, -14, -13, -12, -11, -10, -9, -8, -7,  -6, -5, -4, -3 ,-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Close to your 100, 400, 1600 and 6300

    let randomArray = [];


    document.getElementById("button1").addEventListener("click", function() {
        for (var i = 0; i < 100; i += 1) {

            const randomNote = () => notes[Math.random() * notes.length | 0]; // the bitwise Or does the same as Math.floor

            let random = freq(randomNote());
            console.log(random);
            randomArray.push(random);
            console.log(randomArray)
        
        };
        Tone.start();
    });



    document.getElementById("button2").addEventListener("click", function() {
	
        const seq = new Tone.Sequence((time, note) => {
            synth.triggerAttackRelease(note, 0.1, time);
            // subdivisions are given as subarrays
        }, randomArray).start(0);
        Tone.Transport.bpm.value = 20;
        // start/stop the oscllator every quarter note
        
        Tone.Transport.start();
        // ramp the bpm to 120 over 10 seconds
        Tone.Transport.bpm.rampTo(120, 20);

    });


