import '../questions/playQuestion.js';
import { GameElement } from './game.js';
import { registerEvent } from '../../events.js';

const playGameTemplate = document.createElement('template');
playGameTemplate.innerHTML = `
<header class="game-header d-flex align-items-center justify-content-between mb-4">
  <h1 class="game-title text-white mb-0"></h1>
  <output class="player-score text-white fw-semibold" aria-live="polite">Score: 0</output>
</header>

<section class="game mt-5 flex-column justify-content-center align-items-center"
  aria-live="polite"
  aria-label="Game Area">

  <article class="no-game container text-center text-light d-none"
    role="region"
    aria-label="No active Game">
    <header class="mb-5">
      <h2 class="text-center">No active game</h1>
      <h3 class="text-center text-white">Please check back later</h3>
    </header>
  </article>

  <article class="play-game container text-center text-light d-none"
    role="region"
    aria-label="Playing Game">
  </article>

  <article class="no-more container text-center text-light d-none"
    role="region"
    aria-label="No more questions">
      <h2 class="text-center">You have answered all the questions for this round</h1>
      <h3 class="text-center text-white">Please check back later for the next game</h3>
  </article>

  <article class="start-game container text-center text-light d-none"
    role="region"
    aria-label="Start Game">
    <header class="mb-5">
      <h2 class="start-game-title mb-4">Start game?</h1>
      <h4>Bonus points are awarded for how fast you complete the game</h4>
      <button class="start btn btn-success" disabled>Start</button>
    </header>
  </article>
</section>
`;

export class PlayGameElement extends GameElement {
  static observedAttributes = [
    ...GameElement.observedAttributes,
    'data-score',
    'data-total-score',
    'data-has-next',
  ];

  constructor() {
    super();
    this.shadow.append(playGameTemplate.content.cloneNode(true));
    this.noGameElement = this.shadow.querySelector('.no-game');
    this.noMoreQuestionsElement = this.shadow.querySelector('.no-more');
    this.startGameElement = this.shadow.querySelector('.start-game');
    this.startGameButton = this.shadow.querySelector('.start');
    this.gameElement = this.shadow.querySelector('.play-game');
    this.titleElement = this.shadow.querySelector('.game-title');
    this.playerScoreElement = this.shadow.querySelector('.player-score');

    this.boundedHandleRPCSuccess = this.handleRPCSuccess.bind(this);
    this.boundedStartGame = this.startGame.bind(this);
    this.boundedNoMoreQuestions = this.noMoreQuestions.bind(this);
  }

  get totalScore() {
    return Number(this.dataset.totalScore) || 0;
  }

  set totalScore(value) {
    this.dataset.totalScore = value;
  }

  get hasNext() {
    return this.dataset.hasNext === 'true';
  }

  set hasNext(value) {
    this.dataset.hasNext = value;
  }

  updateTitle() {
    this.titleElement.textContent = `${this.gameTitle} - ${this.shortCode}`;
  }

  noActiveGame() {
    this.noGameElement.classList.remove('d-none');
    this.noGameElement.classList.add('fade-in');
  }

  setAriaActiveState(stateElement) {
    // Hide all articles
    [this.noGameElement, this.startGameElement, this.gameElement].forEach((element) => {
      element.classList.add('d-none');
      element.setAttribute('aria-hidden', 'true');
      element.removeAttribute('tabindex');
    });

    // Show and focus the active one
    stateElement.classList.remove('d-none');
    stateElement.removeAttribute('aria-hidden');
    stateElement.setAttribute('tabindex', '-1');

    // Move focus for screen readers
    stateElement.focus();
  }

  notPlayingGame() {
    this.startGameElement.classList.remove('d-none');
    this.startGameElement.classList.add('fade-in');
    this.startGameButton.disabled = false;
  }

  playingGame() {
    if (!this.hasNext) {
      console.log('No next question');
      this.noMoreQuestions();
      return;
    }

    this.setAriaActiveState(this.gameElement);
    const question = document.createElement('trivia-question-play');
    question.dataset.gameId = this.gameId;
    this.gameElement.append(question);
  }

  updateGame() {
    this.updateTitle();
    this.updateScore();
    console.log('Game state', this.state);
    switch (this.state) {
      case GameElement.PLAYING:
        this.playingGame();
        break;

      case GameElement.NOT_PLAYING:
        this.notPlayingGame();
        break;
    }
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.callActiveGame();

    registerEvent('rpc:success', this.boundedHandleRPCSuccess);
    registerEvent('game:complete', this.boundedNoMoreQuestions);
    this.startGameButton.addEventListener('click', this.boundedStartGame);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) {
      return;
    }

    if (name !== 'data-has-next') {
      super.attributeChangedCallback(name, oldValue, newValue);
    }

    if (name === 'data-has-next') {
      this.hasNext = newValue;
    }

  }

  updateScore() {
    this.playerScoreElement.textContent = `Score: ${this.totalScore}`;
  }

  handleEndGame(event) {
    this.noMoreQuestions();
  }

  handleRPCSuccess(event) {
    const result = event.detail.result;

    if (result.totalScore) {
      this.totalScore = result.totalScore;
      this.updateScore();
    }
  }

  startGame() {
    this.makeRPCCall('players.start', { gameId: this.gameId });
    this.startGameElement.classList.add('fade-out');
  }

  noMoreQuestions() {
    this.updateTitle();
    if (this.gameElement.classList.contains('d-none')) {
      this.noMoreQuestionsElement.classList.remove('d-none');
      this.noMoreQuestionsElement.classList.add('fade-in');
      return;
    }

    this.noQuestions = true;
    this.gameElement.classList.add('fade-out');
    this.gameElement.addEventListener(
      'animationend',
      () => {
        this.gameElement.innerHTML = '';
        this.noMoreQuestionsElement.classList.remove('d-none');
        this.noMoreQuestionsElement.classList.add('fade-in');
      },
      {
        once: true,
      },
    );
  }

  onDataLoaded(results, method) {
    if (method === 'players.start') {
      super.onDataLoaded(results.game);
      this.playingGame();
      return;
    }

    super.onDataLoaded(results);
    if (method === 'games.active') {
      this.hasNext = results.hasNext;
      this.updateGame();
      return;
    }

    this.noMoreQuestions();
  }

  onDataError(results) {
    const error = results?.data?.error;
    const { message } = error;
    if (message === 'No active game found') {
      this.noActiveGame();
      return;
    }
  }
}

customElements.define(
  'trivia-play-game',
  PlayGameElement,
);
