const startSingleplayerGame = () => {
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

const startMultiplayerGame = () => {
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
  gameScript.src = './static/multiplayer_game_v2.js';
  gameScript.type = 'module';

  document.body.append(player1Div);
  document.body.append(player2Div);
  document.body.append(gameScript);
};

const startScreen = () => {
  const startScreenDiv = document.getElementById('start_screen');

  const startSingleplayerButton = document.getElementById('start_singleplayer');
  startSingleplayerButton.addEventListener('click', () => {
    startScreenDiv.style.display = 'none';
    startSingleplayerGame();
  });

  const startMultiplayerButton = document.getElementById('start_multiplayer');
  startMultiplayerButton.addEventListener('click', () => {
    startScreenDiv.style.display = 'none';
    startMultiplayerGame();
  });

  const joinMultiplayerButton = document.getElementById('join_multiplayer');
  joinMultiplayerButton.addEventListener('click', () => {
    startScreenDiv.style.display = 'none';
    startMultiplayerGame();
  });
};

const start = async () => {
  startScreen();
};

start();
