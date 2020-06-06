import { GET, POST } from './utils.js';
const PORT = window.gameConfig.backendPort;
const config = window.gameConfig;


const PromiseTimeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('not connected');
    }, ms);
  });
};

const awaitingForSecondPlayer = async () => {
  return new Promise((resolve) => {
    const source = new EventSource(
        `${config.baseURL}:${config.backendPort}/players`);
    source.onmessage = function(event) {
      if (event.data.includes('ok')) {
        resolve(event.data);
      }
    };
  });
};

const getData = () => {
  return new Promise((resolve) => {
    const source = new EventSource(`${config.baseURL}:${PORT}/get-data`);
    source.onmessage = function(event) {
      resolve(JSON.parse(event.data));
    };
  });
};

const initPlayers = async () => {
  console.log('starting game');
  const players = [];
  // get clients Id
  const clientId = async () => await GET(`${config.baseURL}:${PORT}/connect`).then((response) => response.text());
  const id = await clientId();

  const player = {
    id,
    position: { x: 0, y: 0 },
    matrix: null,
    score: 0,
  };
  players.push(player);
  //  send plays initail sate
  console.log('sending player starting data');
  await POST(`${config.baseURL}:${PORT}/data`, player).catch(console.log);
  console.log('awaiting for second player to join');
  const results = await Promise.race([awaitingForSecondPlayer(), PromiseTimeout(config.mulitiPlayerTimeout)]);

  if (results.includes('ok')) {
    console.log('second player has joined');
    const secondPlayer = await getData();
    // create unique object for player 2
    secondPlayer.ref = 2;
    players.push(secondPlayer);
    console.log('created second player object');
    return players;
  } else {
    window.location = '/';
    alert('Could not connect to player 2');
  }
};


const updateOhtersPlayersData = (player2, playersArena, domObject , gameObects) => {
  const source = new EventSource(`${config.baseURL}:${PORT}/get-data`);
  source.onmessage = function(event) {
    player2= JSON.parse(event.data);
    console.log('dom objects', domObject)
    updateOtherPlayer(player2, playersArena, domObject, gameObects);
  };
};


const getDomForGame = () => {
  const player1Canvas = document.getElementById('player1-tetris');
  const player1Score = document.getElementById('player1-score');
  const player1Context = player1Canvas.getContext('2d');

  const player2Canvas = document.getElementById('player2-tetris');
  const player2Score = document.getElementById('player2-score');
  const player2Context = player2Canvas.getContext('2d');

  player1Context.scale(20, 20);
  player2Context.scale(20, 20);

  return {
    player1Canvas,
    player1Score,
    player1Context,
    player2Canvas,
    player2Score,
    player2Context,
  };
};


const createMatrix = (w, h) => {
  const matrix = [];
  // While h is not 0, decrement h
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
};

const CreatePlayersArena = () => {
  const player1Arena = createMatrix(12, 18);
  const player2Arena = createMatrix(12, 18);
  return { player1Arena, player2Arena };
};
function updateScore(player) {
  document.getElementById('player1-score').innerText = player.score;
}


const creareGameObjects = () => {
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

  return {
    PIECES,
    colors,
  };
};

function createPiece(piece, PIECES) {
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


function playerRotate(player, direction, playersArena) {
  const xPosition = player.position.x;
  let offset = 1;
  rotate(player.matrix, direction);
  while (collide(playersArena.player1Arena, player)) {
    player.position.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -direction);
      player.position.x = xPosition;
      return;
    }
  }
}


function playerMove(direction, player1, playersArena) {
  player1.position.x += direction;
  if (collide(playersArena.player1Arena, player1)) {
    player1.position.x -= direction;
  }
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

function sweep( playersArena) {
  let rowCount = 1;
  outer: for (let y = playersArena.player1Arena.length - 1; y > 0; --y) {
    for (let x = 0; x < playersArena.player1Arena[y].length; ++x) {
      if (playersArena.player1Arena[y][x] === 0) {
        continue outer;
      }
    }
    const emptyRow = playersArena.player1Arena.splice(y, 1)[0].fill(0);
    playersArena.player1Arena.unshift(emptyRow);
    ++y;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}
function playerReset(playersArena, player, gameObjects) {
  const pieces = 'TOISZLJ';
  const random = Math.floor(pieces.length * Math.random());
  player.matrix = createPiece(pieces[random], gameObjects.PIECES);
  player.position.y = 0;
  player.position.x = Math.floor(playersArena.player1Arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(playersArena.player1Arena, player)) {
    playersArena.player1Arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore(player);
  }
}


function playerDrop(player, playersArena, dropCounter, gameObjects) {
  player.position.y++;
  if (collide(playersArena.player1Arena, player)) {
    player.position.y--;
    merge(playersArena.player1Arena, player);
    playerReset(playersArena, player, gameObjects);
    sweep( playersArena);
    updateScore(player);
  }
  if (dropCounter);
  dropCounter = 0;
}

const handlePlayerkeyDown = (player, playersArena) => {
  document.addEventListener('keydown', (event) => {
    const key = event.keyCode;
    const leftKeyPressed = key === 37;
    const rightKeyPressed = key === 39;
    const downKeyPressed = key === 40;
    const qKeyPressed = key === 81;
    const wKeyPressed = key === 87;


    if (leftKeyPressed) {
      playerMove(-1, player, playersArena);
    } else if (rightKeyPressed) {
      playerMove(1, player, playersArena);
    } else if (downKeyPressed) {
      playerDrop(player, playersArena);
    } else if (qKeyPressed) {
      playerRotate(-1, player, playersArena);
    } else if (wKeyPressed) {
      playerRotate(1, player, playersArena);
    }
  });
};

function drawMatrix(player1Context, matrix, offset, gameObject) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        player1Context.fillStyle = gameObject.colors[value];
        player1Context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw(playersArena, player1, gameDom, gameObjects) {
  gameDom.player1Context.fillStyle = '#000';
  gameDom.player1Context.fillRect(0, 0, gameDom.player1Canvas.width, gameDom.player1Canvas.height);
  drawMatrix(gameDom.player1Context, playersArena.player1Arena, { x: 0, y: 0 }, gameObjects);
  drawMatrix(gameDom.player1Context, player1.matrix, player1.position, gameObjects);
}


async function update(time = 0, player, playersArena, gameDom, lastTime, dropCounter, dropInterval, gameObject ) {
  const deltaTime = time - lastTime;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop(player, playersArena, dropCounter, gameObject);
  }
  await POST(`${config.baseURL}:${PORT}/data`, player).catch(console.log);
  lastTime = time;
  draw(playersArena, player, gameDom, gameObject);
  requestAnimationFrame(async (animateTime) => {
    await update(animateTime, player, playersArena, gameDom, lastTime, dropCounter, dropInterval, gameObject);
  });
}


function drawOtherPlayerMatrix(matrix, offset, domObjects, gameObects) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        domObjects.player2Context.fillStyle = gameObects.colors[value];
        domObjects.player2Context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}


const updateOtherPlayer = (player, playersArena, domObject, gameObects) => {
  drawOtherPlayerMatrix(player.matrix, player.position, domObject, gameObects);
};

(async function() {
  const players = await initPlayers();
  console.log('game objects', players);
  //  attach ohter players data listener
  const indexOfPlayer = players
      .filter((playerObject) => !playerObject.ref)
      .map((playerObj) => players.indexOf(playerObj))[0];

  console.log('players index', indexOfPlayer);

  const indexOfOhterPlayer = players
      .filter((playerObject) => playerObject.ref === 2)
      .map((playerObj) => players.indexOf(playerObj))[0];


  console.log('player2 Object', players[indexOfOhterPlayer]);
  //  prearing game to start
  const domObject = getDomForGame();
  const playersArena = CreatePlayersArena();
  const gameObjects = creareGameObjects();
  updateOhtersPlayersData(players[indexOfOhterPlayer], playersArena, domObject, gameObjects );
  handlePlayerkeyDown(players[indexOfPlayer], playersArena);


  const intailTime = 0;
  const lastTime = 0;
  const dropCounter = 0;
  const dropInterval = 1000;
  playerReset(playersArena, players[indexOfPlayer], gameObjects);
  updateScore(players[indexOfPlayer]);
  update(intailTime, players[indexOfPlayer], playersArena, domObject, lastTime, dropCounter, dropInterval, gameObjects);
})();
