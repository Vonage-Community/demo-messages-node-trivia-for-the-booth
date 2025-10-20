import { GameElement } from './game.js';
import '../questions/playQuestion.js';
import styleSheet from '../styleSheet.js';
import { registerEvent, removeEvent } from '../../events.js';

const playGameTemplate = document.createElement('template');
playGameTemplate.innerHTML = `
<h1 class="game-title mb-4 text-white"></h1>

<section class="game mt-5 d-flex flex-column justify-content-center align-items-center"
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
      <h3 class="text-center text-white">Please check back later</h3>
  </article>

  <article class="start-game container text-center text-light d-none"
    role="region"
    aria-label="Start Game">
    <header class="mb-5">
      <h1 class="start-game-title mb-4"></h1>
    </header>
  </article>
</section>

<style>
article {
  outline: none;
  /* Bootstrap uses vh instead of dvh */
  margin-block-start: 10rem;
}
</style>
`;

export class PlayGameElement extends GameElement {
  static observedAttributes = GameElement.observedAttriutes;

  constructor() {
    super();
    this.shadow.adoptedStyleSheets = [...this.shadow.adoptedStyleSheets, styleSheet];
    this.shadow.append(playGameTemplate.content.cloneNode(true));
    this.noGameElement = this.shadow.querySelector('.no-game');
    this.noMoreQuestionsElement = this.shadow.querySelector('.no-more');
    this.startGameElement = this.shadow.querySelector('.start-game');
    this.gameElement = this.shadow.querySelector('.play-game');
    this.titleElement = this.shadow.querySelector('.game-title');

    this.boundedHandleNoMoreQuestions = this.handleNoMoreQuestions.bind(this);
  }

  updateTitle() {
    this.titleElement.textContent = `${this.gameTitle} - ${this.shortCode}`;
  }

  noGame() {
    console.log('No game');
  }

  noActiveGame() {
    console.log('No active game');
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
    console.log('Not playing');
  }

  playingGame() {
    if (this.noQuestions) {
      console.log('No question');
      return;
    }

    console.log('question');

    this.setAriaActiveState(this.gameElement);
    const question = document.createElement('trivia-question-play');
    question.dataset.gameId = this.gameId;
    this.gameElement.append(question);
  }

  updateGame() {
    this.updateTitle();
    switch (this.state) {
      case GameElement.PLAYING:
        this.playingGame();
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
  }

  handleNoMoreQuestions(event) {
    const method = event.detail.method;
    const result = event.detail.result;

    if (!['players.answer', 'players.next'].includes(method)) {
      return;
    }

    if (!result || !result.hasNext) {
      this.noMoreQuestions();
    }
  }

  noMoreQuestions() {
    console.log('no more questions');
    this.noQuestions = true;
    this.noMoreQuestionsElement.classList.remove('d-none');
    this.gameElement.classList.add('fade-out');
    this.gameElement.addEventListener(
      'animationend',
      () => {
        this.gameElement.innerHTML = '';
        this.noMoreQuestionsElement.classList.add('fade-in');
      },
      {
        once: true,
      },
    );
  }

  onDataLoaded(results) {
    super.onDataLoaded(results);
    if (results.hasNext) {
      this.updateGame();
      return;
    }

    this.noMoreQuestions();
  }
}

customElements.define('trivia-play-game', PlayGameElement);
