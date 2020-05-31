import { GET } from './utils.js';
import { default as config } from './config.js';

const promiseTimeout = () => {
  return new Promise((resolve) => {
    setTimeout(()=> {
      resolve({});
    }, config.timeout);
  });
};

const awaitingForSecondPlayer = async () => {
  return await GET(`https://localhost:${config.PORT}/players`);
};

const startSingleplayerGame = () => {
  const connection = document.getElementById('connection');
  connection.style.display = 'none';

  const score = document.createElement('div');
  score.id = 'score';

  const canvas = document.createElement('canvas');
  canvas.id = 'tetris';
  canvas.width = '240';
  canvas.height = '360';

  const gameScript = document.createElement('script');
  gameScript.src = './static/game.js';
  gameScript.type = 'module';

  document.body.append(score, canvas, gameScript);
};

const startMuliplayerGame = () => {

};

const start = async () => {
  const connected = await GET(`https://localhost:${config.PORT}/connect`);
  if (connected) {
    const raceResult = await Promise.race([awaitingForSecondPlayer(), promiseTimeout()]);
    if (!Object.keys(raceResult).length > 0) {
      startSingleplayerGame();
    }
    startMuliplayerGame();
  }
};

start();
