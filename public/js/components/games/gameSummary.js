import Collapse from 'bootstrap/js/dist/collapse';
import '../questions/questionList.js';
import { RPCElement } from '../rpcElement.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section class="card mb-3 w-100 accordion-item"
role="region"
aria-describedby="game-title"
aria-labelledby="game-title">
  <header class="card-header border-0 d-flex align-items-center gap-2">
    <button class="accordion-button bg-transparent collapsed expand-game"
      type="button"
      aria-controls="game-data-1"
      aria-expanded="false">
      <h3 id="game-title">Title</h3>
    </button>

    <button class="btn btn-primary activate-game" type="button" aria-label="Activate Game">Activate</button>
    <button class="btn btn-primary deactivate-game" type="button" aria-label="Deactivate Game">Deactivate</button>
  </header>

  <div class="accordion-body accordion-collapse collapse game-data" id="game-stats"
  role="region"
  aria-label="Game details">
    <dl class="row" id="game-stats">
      <dt class="col-sm-1" aria-label="Total Questions">Questions</dt>
      <dd class="col-sm-1" data-field="questions"></dd>

      <dt class="col-sm-1" aria-label="Total Players">Players</dt>
      <dd class="col-sm-1" data-field="players"></dd>

      <dt class="col-sm-1" aria-label="Questions Answer correctly">Correct</dt>
      <dd class="col-sm-1" data-field="correct"></dd>

      <dt class="col-sm-1" aria-label="Questions answered incorrectly">Incorrect</dt>
      <dd class="col-sm-1" data-field="incorrect"></dd>
    </dl>
  </div>
</section>
`;

export class GamesSummaryElement extends RPCElement {
  static observedAttributes = [
    'data-game-id',
    'data-game-title',
    'data-game-short-code',
    'data-game-question-count',
    'data-game-player-count',
    'data-game-correct-count',
    'data-game-incorrect-count',
    'data-game-active',
  ];

  constructor() {
    super();

    this.shadow.append(gameListTemplate.content.cloneNode(true));
    this.titleElement = this.shadow.querySelector('#game-title');

    this.summaryListElement = this.shadow.querySelector('ul');
    this.questionCountElement = this.shadow.querySelector('[data-field="questions"]');
    this.playersCountElement = this.shadow.querySelector('[data-field="players"]');
    this.correctCountElemenet = this.shadow.querySelector('[data-field="correct"]');
    this.incorrectCountElemenet = this.shadow.querySelector('[data-field="incorrect"]');

    this.gameDataElement = this.shadow.querySelector('.game-data');
    this.activateButtonElement = this.shadow.querySelector('.activate-game');
    this.deactivateButtonElement = this.shadow.querySelector('.deactivate-game');
    this.expandButtomElement = this.shadow.querySelector('.expand-game');

    this.boundedToggleList = this.toggleList.bind(this);
    this.boundedAddQuestionList = this.addQuestionList.bind(this);
    this.boundedRemoveQuestionList = this.removeQuestionList.bind(this);
    this.boundedActivateGame = this.activateGame.bind(this);
    this.boundedDeactivateGame = this.deactivateGame.bind(this);
  }

  get gameId() {
    return this.dataset.gameId;
  }

  set gameId(value) {
    this.dataset.gameId = value;
  }

  get gameTitle() {
    return this.dataset.gameTitle;
  }

  set gameTitle(value) {
    this.dataset.gameTitle = value;
  }

  get gameQuestionCount() {
    return Number(this.dataset.gameQuestionCount);
  }

  set gameQuestionCount(value) {
    this.dataset.gameQuestionCount = value;
  }

  get gamePlayerCount() {
    return Number(this.dataset.gamePlayerCount);
  }

  set gamePlayerCount(value) {
    this.dataset.gamePlayerCount = value;
  }

  get gameCorrectCount() {
    return Number(this.dataset.gameCorrectCount);
  }

  set gameCorrectCount(value) {
    this.dataset.gameCorrectCount = value;
  }

  get gameIncorrectCount() {
    return Number(this.dataset.gameIncorrectCount);
  }

  set gameIncorrectCount(value) {
    this.dataset.gameIncorrectCount = value;
  }

  get gameShortCode() {
    return this.dataset.gameShortCode;
  }

  set gameShortCode(value) {
    this.dataset.gameShortCode = value;
  }

  get gameActive() {
    return this.dataset.gameActive === 'true';
  }

  set gameActive(value) {
    this.dataset.gameActive = value;
  }

  toggleList() {
    this.expanded = this.expandButtomElement.classList.contains('collapsed');
    this.gameAccordion.toggle();
    this.expandButtomElement.setAttribute(
      'aria-expanded',
      !this.expanded,
    );

    this.expandButtomElement.classList.toggle('collapsed');
    if (this.expanded) {
      this.gameDataElement.focus();
      this.addQuestionList();
      return;
    }

    this.removeQuestionList();
  }

  addQuestionList() {
    this.questionsListElement = document.createElement('trivia-questions-list');
    this.questionsListElement.setAttribute('data-game-id', this.gameId);
    this.gameDataElement.append(this.questionsListElement);
  }

  removeQuestionList() {
    this.questionsListElement.remove();
  }

  activateGame() {
    this.makeRPCCall('games.activate', { id: this.gameId });
  }

  deactivateGame() {
    this.makeRPCCall('games.deactivate', { id: this.gameId });
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.setAttribute('aria-label', this.shadow.querySelector('h3').textContent);
    this.gameAccordion = new Collapse(this.gameDataElement, { toggle: false });
    this.expandButtomElement.addEventListener('click', this.boundedToggleList);
  }

  disconnectedCallback() {
    this.expandButtomElement.removeEventListener('click', this.boundedToggleList);
  }

  updateTitle() {
    const title = `${this.gameTitle ?? 'Untitled Game'} - ${this.gameShortCode}`;
    this.titleElement.textContent = title;
  }

  updateGameStats() {
    const correct = Number(this.gameCorrectCount ?? 0);
    const totalQuestions = Number(this.gameQuestionCount ?? 0);
    const correctPercent = totalQuestions
      ? Math.round((correct / totalQuestions) * 100)
      : 0;


    const incorrect = Number(this.gameIncorrectCount ?? 0);

    const incorrectPercent = totalQuestions
      ? Math.round((incorrect / totalQuestions) * 100)
      : 0;

    this.playersCountElement.textContent = this.gamePlayerCount;
    this.questionCountElement.textContent = totalQuestions;
    this.correctCountElemenet.textContent = `${correct} (${correctPercent}%)`;
    this.incorrectCountElemenet.textContent = `${incorrect} (${incorrectPercent}%)`;
  }

  toggleGameActive() {
    if (this.gameActive) {
      this.activateButtonElement.classList.add('d-none');
      this.activateButtonElement.removeEventListener('click', this.boundedActivateGame);

      this.deactivateButtonElement.classList.remove('d-none');
      this.deactivateButtonElement.addEventListener('click', this.boundedDeactivateGame);
      return;
    }

    this.activateButtonElement.classList.remove('d-none');
    this.activateButtonElement.addEventListener('click', this.boundedActivateGame);

    this.deactivateButtonElement.classList.add('d-none');
    this.deactivateButtonElement.removeEventListener('click', this.boundedDeactivateGame);
  }

  attributeChangedCallback(name) {
    if (!this.hasConnected) {
      return;
    }

    switch (name) {
      case 'data-game-title':
      // falls through
      case 'data-game-short-code':
        this.updateTitle();
        break;

      case 'data-game-question-count':
      // falls through
      case 'data-game-player-count':
      // falls through
      case 'data-game-correctcount':
      // falls through
      case 'data-game-incorrect-count':
        this.updateGameStats();
        break;

      case 'data-game-active':
        this.toggleGameActive();
        break;
    }
  }

  onDataLoaded(result) {
    console.log('Data loaded', result);
    this.gameActive = result.active;
  }

}

customElements.define(
  'trivia-game-summary',
  GamesSummaryElement,
);
