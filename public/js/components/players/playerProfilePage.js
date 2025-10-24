import '../questions/playQuestion.js';
import { storeMessage } from '../../toast.js';
import { RPCElement } from '../rpcElement.js';
import { staggerAnimation } from '../../animation.js';

const playerTemplate = document.createElement('template');
playerTemplate.innerHTML = `

<header class="d-flex mb-5 justify-content-between">
  <h1 class="player-name"></h1>
  <div>
    <button class="logout btn btn-secondary">Logout</button>
  </div>
</header>

<div class="d-flex justify-content-between align-items-center flex-column mt-5">
  <a href="/play" class="play btn btn-primary btn-lg mb-4">Play</a>
  <h2 class="">Your Score</h2>
  <h3 class="player-score mb-5">0</h3>

  <h4 class="mt-5 game-title">Bonuses for game: Test</h4>

  <ul class="bonuses list-unstyled">
  </ul>
</div>
`;

export class PlayerProfilePageElement extends RPCElement {
  constructor() {
    super();
    this.shadow.append(playerTemplate.content.cloneNode(true));
    document.querySelector('main').classList.add('d-none');
    this.playerNameElement = this.shadow.querySelector('.player-name');
    this.playerScoreElement = this.shadow.querySelector('.player-score');
    this.playerBonusesElement = this.shadow.querySelector('.bonuses');
    this.gameTitleElement = this.shadow.querySelector('.game-title');
    this.logoutButtonElement = this.shadow.querySelector('.logout');
  }

  connectedCallback() {
    this.logoutButtonElement.addEventListener('click', () => {
      storeMessage('Log Out');
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login';
    });
    this.getPlayerScores();
  }

  getPlayerScores() {
    this.makeRPCCall('players.scores');
  }

  onDataLoaded(results) {
    this.playerName = results.name;
    this.score = results.totalScore;
    this.games = results.games;
    this.bonuses = results.bonus;
    this.updatePage();
    const main = document.querySelector('main');
    main.classList.remove('d-none');
    main.classList.add('fade-in');
  }

  updatePage() {
    this.playerNameElement.textContent = `Hello ${this.playerName}`;
    this.playerScoreElement.textContent = this.score;
    this.startGameScrolling();
  }

  startGameScrolling() {
    const boundedShowGame = this.showGame.bind(this);
    setInterval(boundedShowGame, 10000);
    this.showGame();
  }

  showGame() {
    this.gameTitleElement.innerHTML = '';
    this.playerBonusesElement.innerHTML = '';
    this.gameIndexToShow = this.gameIndexToShow || 0;

    const game = this?.games[this.gameIndexToShow];
    let whatToShow = game;
    if (!game) {
      whatToShow = this.bonuses.length > 0 ? this.bonuses : false;
    }

    if (!whatToShow) {
      return;
    }

    this.gameTitleElement.textContent = game
      ? `Bonuses for game: ${game.gameTitle}`
      : 'Additional bonuses';

    const bonuses = game.questions.map(({ scores }) => [...scores]).flat();;
    const gameScore = game.questions.reduce(
      (gameScore, { scores }) => {
        scores.forEach(({ points }) => gameScore += points);
        return gameScore;
      },
      0,
    );

    bonuses.forEach(({ type, points }) => {
      const playerBonusesElement = document.createElement('li');
      playerBonusesElement.textContent = `+${points} ${type}`;
      this.playerBonusesElement.append(playerBonusesElement);
    });


    const breakElement = document.createElement('li');
    breakElement.append(document.createElement('p'));
    this.playerBonusesElement.append(breakElement);
    const totalPointsElement = document.createElement('li');
    totalPointsElement.textContent = `You scored ${gameScore} points`;
    this.playerBonusesElement.append(totalPointsElement);
    const bonusesElement = this.playerBonusesElement.querySelectorAll('li');
    staggerAnimation('slide-in-right')(bonusesElement);
    this.gameIndexToShow += this.games.length === (this.gameIndexToShow + 1)
      ? 0
      : 1;
  }
}
customElements.define(
  'trivia-player-profile',
  PlayerProfilePageElement,
);
