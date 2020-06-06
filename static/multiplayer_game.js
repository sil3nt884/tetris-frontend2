import { GET, POST } from './utils.js';
const PORT = window.gameConfig.backendPort;
const config = window.gameConfig;

const getData = () => {
  return new Promise((resolve) => {
    const source = new EventSource(`${config.baseURL}:${PORT}/get-data`);
    source.onmessage = function(event) {
      resolve(JSON.parse(event.data));
    };
  });
};

async function init(player1, player2) {
  console.log('INIT CALLED');

  const player1Canvas = document.getElementById('player1-tetris');
  const player1Score = document.getElementById('player1-score');
  const player1Context = player1Canvas.getContext('2d');

  const player2Canvas = document.getElementById('player2-tetris');
  const player2Score = document.getElementById('player2-score');
  const player2Context = player2Canvas.getContext('2d');

  const clientId = async () => await GET(`${config.baseURL}:${PORT}/connect`).then((response) => response.text())
    .then((data) => console.log(data));

  player1Context.scale(20, 20);
  player2Context.scale(20, 20);
  const playerId = await clientId();




  const player1 = {
    id: playerId,
    position: { x: 0, y: 0 },
    matrix: null,
    score: 0,
  };
  POST(`${config.baseURL}:${PORT}/data`, player1).catch(console.log);

  let player2 = await getData();

  // 20 * 12 = 240 width
  // 20 * 18 = 360 height
  const player1Arena = createMatrix(12, 18);
  const player2Arena = createMatrix(12, 18);

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
          player1Context.fillStyle = colors[value];
          player1Context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }

  function draw() {
    player1Context.fillStyle = '#000';
    player1Context.fillRect(0, 0, player1Canvas.width, player1Canvas.height);
    drawMatrix(player1Arena, { x: 0, y: 0 });
    drawMatrix(player1.matrix, player1.position);
    drawMatrix(player2Arena, { x: 0, y: 0 });
    drawMatrix(player2.matrix, player2.position);
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
    player1.position.y++;
    if (collide(player1Arena, player1)) {
      player1.position.y--;
      merge(player1Arena, player1);
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
    player1.position.x += direction;
    if (collide(player1Arena, player1)) {
      player1.position.x -= direction;
    }
  }

  function playerReset() {
    const pieces = 'TOISZLJ';
    const random = Math.floor(pieces.length * Math.random());
    player1.matrix = createPiece(pieces[random]);
    player1.position.y = 0;
    player1.position.x = Math.floor(player1Arena[0].length / 2) - Math.floor(player1.matrix[0].length / 2);
    if (collide(player1Arena, player1)) {
      player1Arena.forEach((row) => row.fill(0));
      player1.score = 0;
      updateScore();
    }
  }

  function playerRotate(direction) {
    const xPosition = player1.position.x;
    let offset = 1;
    rotate(player1.matrix, direction);
    while (collide(player1Arena, player1)) {
      player1.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player1.matrix[0].length) {
        rotate(player1.matrix, -direction);
        player1.position.x = xPosition;
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

      // Send player object to server
      POST(`${config.baseURL}:${PORT}/data`, player1).catch(console.log);

      // Request other player's object from server
      player2 = await getData();
    }
    lastTime = time;

    draw();
    requestAnimationFrame(update);
  }

  function updateScore() {
    player1Score.innerText = player1.score;
    player2Score.innerText = player2.score;
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
};

window.onload = init();

// Tetris tutorial
// https://www.youtube.com/watch?v=H2aW5V46khA

// Multiplayer Tetris: https://www.youtube.com/playlist?list=PLS8HfBXv9ZWW49tOAbvxmKy17gpsqWXaX
