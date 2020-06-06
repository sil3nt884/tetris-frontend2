const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

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

const PIECES = {
  T: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  O: [
    [2, 2],
    [2, 2],
  ],
  I: [
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
  ],
  S: [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0],
  ],
  Z: [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
  L: [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  J: [
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0],
  ],
};

function sweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const emptyRow = arena.splice(y, 1)[0].fill(0);
    arena.unshift(emptyRow);
    ++y;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

function collide(arena, player) {
  const m = player.matrix;
  const o = player.position;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createPiece(piece) {
  const tPiece = piece === 'T';
  const oPiece = piece === 'O';
  const iPiece = piece === 'I';
  const sPiece = piece === 'S';
  const zPiece = piece === 'Z';
  const lPiece = piece === 'L';
  const jPiece = piece === 'J';
  const { T, O, I, S, Z, L, J } = PIECES;

  if (tPiece) {
    return T;
  } else if (oPiece) {
    return O;
  } else if (iPiece) {
    return I;
  } else if (sPiece) {
    return S;
  } else if (zPiece) {
    return Z;
  } else if (lPiece) {
    return L;
  } else if (jPiece) {
    return J;
  }
}

function createMatrix(w, h) {
  const matrix = [];
  // While h is not 0, decrement h
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

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

const player = {
  position: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.position);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.position.y][x + player.position.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.position.y++;
  if (collide(arena, player)) {
    player.position.y--;
    merge(arena, player);
    playerReset();
    sweep();
    updateScore();
  }
  dropCounter = 0;
}

function rotate(matrix, direction) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }

  if (direction > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerMove(direction) {
  player.position.x += direction;
  if (collide(arena, player)) {
    player.position.x -= direction;
  }
}

function playerReset() {
  const pieces = 'TOISZLJ';
  const random = Math.floor(pieces.length * Math.random());
  player.matrix = createPiece(pieces[random]);
  player.position.y = 0;
  player.position.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function playerRotate(direction) {
  const xPosition = player.position.x;
  let offset = 1;
  rotate(player.matrix, direction);
  while (collide(arena, player)) {
    player.position.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -direction);
      player.position.x = xPosition;
      return;
    }
  }
}

let dropCounter = 0;
const dropInterval = 1000;

let lastTime = 0;

async function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  lastTime = time;

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

document.addEventListener('keydown', (event) => {
  const key = event.keyCode;
  const leftKeyPressed = key === 37;
  const rightKeyPressed = key === 39;
  const downKeyPressed = key === 40;
  const qKeyPressed = key === 81;
  const wKeyPressed = key === 87;

  if (leftKeyPressed) {
    playerMove(-1);
  } else if (rightKeyPressed) {
    playerMove(1);
  } else if (downKeyPressed) {
    playerDrop();
  } else if (qKeyPressed) {
    playerRotate(-1);
  } else if (wKeyPressed) {
    playerRotate(1);
  }
});

playerReset();
updateScore();
update();

// Tetris tutorial
// https://www.youtube.com/watch?v=H2aW5V46khA

// Multiplayer Tetris: https://www.youtube.com/playlist?list=PLS8HfBXv9ZWW49tOAbvxmKy17gpsqWXaX
