import { GameElement } from './game.js';
import '../questions/playQuestion.js';
import { registerEvent } from '../../events.js';

const playGameTemplate = document.createElement('template');
playGameTemplate.innerHTML = `
<h1 class="game-title mb-4 text-white"></h1>

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
      <button class="start btn btn-success">Start</button>
    </header>
  </article>
</section>
`;

export class PlayGameElement extends GameElement {
  static observedAttributes = GameElement.observedAttriutes;

  constructor() {
    super();
    this.shadow.append(playGameTemplate.content.cloneNode(true));
    this.noGameElement = this.shadow.querySelector('.no-game');
    this.noMoreQuestionsElement = this.shadow.querySelector('.no-more');
    this.startGameElement = this.shadow.querySelector('.start-game');
    this.startGameButton = this.shadow.querySelector('.start');
    this.gameElement = this.shadow.querySelector('.play-game');
    this.titleElement = this.shadow.querySelector('.game-title');

    this.boundedHandleNoMoreQuestions = this.handleNoMoreQuestions.bind(this);
    this.boundedStartGame = this.startGame.bind(this);
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
  }

  playingGame() {
    console.log('playing game');
    if (this.noQuestions) {
      console.log('no questions');
      return;
    }

    this.setAriaActiveState(this.gameElement);
    const question = document.createElement('trivia-question-play');
    question.dataset.gameId = this.gameId;
    this.gameElement.append(question);
  }

  updateGame() {
    this.updateTitle();
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
    registerEvent('rpc:success', this.boundedHandleNoMoreQuestions);
    this.startGameElement.addEventListener('click', this.boundedStartGame);
  }

  handleNoMoreQuestions(event) {
    const method = event.detail.method;
    const result = event.detail.result;

    if (!['players.answer'].includes(method)) {
      return;
    }

    if (!result || !result.hasNext) {
      this.noMoreQuestions();
    }
  }

  startGame() {
    this.makeRPCCall('players.start', { gameId: this.gameId });
    this.startGameElement.classList.add('fade-out');
  }

  noMoreQuestions() {
    console.log('No more questions', this.gameElement);
    this.updateTitle();
    if (this.gameElement.classList.contains('d-none')) {
      console.log('Not showing game element');
      this.noMoreQuestionsElement.classList.remove('d-none');
      this.noMoreQuestionsElement.classList.add('fade-in');
      return;
    }

    this.noQuestions = true;
    this.gameElement.classList.add('fade-out');
    this.gameElement.addEventListener(
      'animationend',
      () => {
        console.log('Game faded');
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
    super.onDataLoaded(results);

    if (method === 'players.start') {
      super.onDataLoaded(results.game);
      this.playingGame();
      return;
    }

    if (results.hasNext) {
      this.updateGame();
      return;
    }

    this.noMoreQuestions();
  }

  onDataError(results) {
    const error = results?.data?.error;
    const { code, message } = error;
    console.log('RPC Error', code, message);
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
