let osc, osc2, playing = false;
let freq = 440, amp = 0.5;
let color_1 = 255, color_2 = 255, color_3 = 255;
let count = 0, count2 = 0;
let wave_type = 0;


let sketchRunning = false;

function setup() {
    createCanvas(800, 800);
    noLoop(); // ⛔️ don't run draw() yet
  
    // Set up sound
    osc = new p5.Oscillator('sine');
    osc2 = new p5.Oscillator('sawtooth');
    osc.start(); osc.amp(0);
    osc2.start(); osc2.amp(0);
  
    // Hook up toggle button
    const toggleBtn = document.getElementById('toggleBtn');
    toggleBtn.addEventListener('click', () => {
      getAudioContext().resume(); // allow sound
  
      sketchRunning = !sketchRunning;
  
      if (sketchRunning) {
        loop();
        toggleBtn.textContent = "Stop Synth";
        toggleBtn.classList.remove('off');
      } else {
        noLoop();
        osc.amp(0, 0.1);
        osc2.amp(0, 0.1);
        playing = false;
        toggleBtn.textContent = "Start Synth";
        toggleBtn.classList.add('off');
      }
    });
  }

function draw() {
  background(255);


  if (playing) {
    if (wave_type === 0) {
      osc.freq(freq, 0);
      osc.amp(amp, 0.1);
    } else {
      osc2.freq(freq, 0);
      osc2.amp(amp, 0.1);
    }
  }

  drawPiano();
  animateColors();

  // Animate background colors back to white
  color_1 = min(color_1 + 5, 255);
  color_2 = min(color_2 + 5, 255);
  color_3 = min(color_3 + 5, 255);
}

function mousePressed() {
  getAudioContext().resume();


  // Toggle active state
  active = !active;

  // Stop oscillators when deactivating
  if (!active) {
    osc.amp(0, 0.1);
    osc2.amp(0, 0.1);
    playing = false;
  }

}

function keyReleased() {
  osc.amp(0, 0.1);
  osc2.amp(0, 0.1);
  playing = false;
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) wave_type = 1;
  if (keyCode === LEFT_ARROW) wave_type = 0;

  const notes = {
    65: 261.63,  // A -> C
    87: 277.18,  // W -> C#
    83: 293.66,  // S -> D
    69: 311.13,  // E -> D#
    68: 329.63,  // D -> E
    70: 349.23,  // F -> F
    84: 369.99,  // T -> F#
    71: 392.00,  // G -> G
    89: 415.30,  // Y -> G#
    72: 440.00,  // H -> A
    85: 466.16,  // U -> A#
    74: 493.88   // J -> B
  };

  const colors = {
    65: [228, 0, 0],
    87: [228, 97, 4],
    83: [238, 137, 4],
    69: [238, 177, 4],
    68: [208, 177, 4],
    70: [239, 255, 40],
    84: [4, 255, 71],
    71: [4, 255, 160],
    89: [0, 125, 250],
    72: [100, 125, 220],
    85: [200, 90, 220],
    74: [200, 10, 220]
  };

  if (notes[keyCode]) {
    freq = notes[keyCode];
    [color_1, color_2, color_3] = colors[keyCode];
    playing = true;
  }

  count = 0;
}

function drawPiano() {
  push();
  count++;
  noStroke();
  let x = (freq - 253) * 2.8;
  for (let i = 0; i < 70; i++) {
    fill(color_1, color_2, color_3);
    rect(x, i / count, 100, 400);
  }
  pop();
}

function animateColors() {
  count2 += 0.05;
  let size = 20;

  push();
  translate(20, 20);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let sinX = map(sin(count2 + j), -1, 1, -10, freq / 14);
      let cosY = map(cos(count2 + i), -1, 1, -10, freq / 14);
      push();
      fill(color_1, color_2, color_3);
      noStroke();
      translate(i * 10, j * 10);
      circle(sinX + 50, cosY + 500, 10);
      pop();
    }
  }
  pop();
}