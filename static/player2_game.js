import { GET } from './utils.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const player2 = [];

// display player 2's game
// Get player 2 object
// Render player 2  object

context.scale(20, 20);

const colors = [
  null,
  'purple',
  'yellow',
  'orange',
  'blue',
  'aqua',
  'green',
  'red',
];

// 20 * 12 = 240 width
// 20 * 18 = 360 height
const arena = createMatrix(12, 18);

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.position);
}

let dropCounter = 0;
const dropInterval = 1000;

let lastTime = 0;

async function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    // GET request to get player 2 object
    GET(`https://localhost:${config.PORT}/data`, player).catch(console.log);
  }
  lastTime = time;

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById('player2Score').innerText = player2.score;
}

updateScore();
update();

// Tetris tutorial
// https://www.youtube.com/watch?v=H2aW5V46khA

// Multiplayer Tetris: https://www.youtube.com/playlist?list=PLS8HfBXv9ZWW49tOAbvxmKy17gpsqWXaX
