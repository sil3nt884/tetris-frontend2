import { GET } from './utils.js';
const config = window.gameConfig;

const startSingleplayerGame = () => {
  const connection = document.getElementById('connection');
  connection.style.display = 'none';

  const score = document.createElement('div');
  score.id = 'score';
  score.textContent = 'Score: ';

  const canvas = document.createElement('canvas');
  canvas.id = 'tetris';
  canvas.width = '240';
  canvas.height = '360';

  const gameScript = document.createElement('script');
  gameScript.src = './static/singleplayer_game.js';
  gameScript.type = 'module';

  document.body.append(score, canvas, gameScript);
};

const startMuliplayerGame = () => {
  const connection = document.getElementById('connection');
  connection.style.display = 'none';

  // Player 1
  const player1Div = document.createElement('div');
  player1Div.id = 'player1-container';

  const player1Score = document.createElement('div');
  player1Score.id = 'player1-score';
  player1Score.textContent = 'Player 1 Score: ';

  const player1Canvas = document.createElement('canvas');
  player1Canvas.id = 'player1-tetris';
  player1Canvas.width = '240';
  player1Canvas.height = '360';

  player1Div.style.display = 'inline-block';
  player1Div.style.margin = '5vh';
  player1Div.append(player1Score, player1Canvas);

  // Player 2
  const player2Div = document.createElement('div');
  player2Div.id = 'player2-container';

  const player2Score = document.createElement('div');
  player2Score.id = 'player2-score';
  player2Score.textContent = 'Player 2 Score: ';

  const player2Canvas = document.createElement('canvas');
  player2Canvas.id = 'player2-tetris';
  player2Canvas.width = '240';
  player2Canvas.height = '360';

  player2Div.style.display = 'inline-block';
  player2Div.style.margin = '5vh';
  player2Div.append(player2Score, player2Canvas);

  const gameScript = document.createElement('script');
  gameScript.id = 'game-script';
  gameScript.src = './static/multiplayer_game.js';
  gameScript.type = 'module';

  document.body.append(player1Div);
  document.body.append(player2Div);
  document.body.append(gameScript);
};


const PromiseTimeout = (ms) => {
  return new Promise((resolve)=> {
    setTimeout(()=>{
      resolve('not connected');
    }, ms);
  });
};


const awaitingForSecondPlayer = async () => {
  return new Promise(()=> {
    const source = new EventSource('/Players');
    source.onmessage = function(data) {
      resolve(data);
    };
  });
};

const start = async () => {
  const connected = await GET(`${config.baseURL}:${config.backendPort}/connect`);
  if (connected) {
    const results = await Promise.race([awaitingForSecondPlayer, PromiseTimeout(config.mulitiPlayerTimeout)]);
    if (results === 'ok') {
      startMuliplayerGame();
    } else {
      startSingleplayerGame();
    }
  }
};

start().catch(console.log);
