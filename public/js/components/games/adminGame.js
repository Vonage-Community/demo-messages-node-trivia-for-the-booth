import Collapse from 'bootstrap/js/dist/collapse';
import '../questions/adminQuestionList.js';
import { GameElement } from './game.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section class="border mb-3 w-100"
  role="region"
  aria-describedby="game-title"
  aria-labelledby="game-title">

  <header class="card-header border-0 d-flex align-items-center gap-2">
    <button class="accordion-button bg-transparent collapsed expand-game"
      type="button"
      aria-controls="game-data-1"
      aria-expanded="false">

      <h3 class="game-title">Title</h3>
    </button>

    <button class="btn activate-game" type="button" aria-label="Activate Game">Activate</button>
    <button class="btn deactivate-game" type="button" aria-label="Deactivate Game">Deactivate</button>
  </header>

  <div class="accordion-body accordion-collapse collapse game-data transate-middle p-3 "
  role="region"
  aria-label="Game statistics">
    <dl class="row d-flex justify-content-center" id="game-stats">
      <dt class="col-sm-3" aria-label="Total Questions">Questions</dt>
      <dd class="col-sm-3" data-field="questions"></dd>

      <dt class="col-sm-3" aria-label="Total Players">Players</dt>
      <dd class="col-sm-3" data-field="players"></dd>
    </dl>

    <dl class="row d-flex justify-content-center" id="game-stats">
      <dt class="col-sm-3" aria-label="Questions Answer correctly">Correct</dt>
      <dd class="col-sm-3" data-field="correct"></dd>

      <dt class="col-sm-3" aria-label="Questions answered incorrectly">Incorrect</dt>
      <dd class="col-sm-3" data-field="incorrect"></dd>
    </dl>
  </div>

</section>
`;

export class AdminGameElement extends GameElement {
  static observedAttributes = [
    ...GameElement.observedAttributes,
    'data-question-count',
    'data-player-count',
    'data-correct-count',
    'data-incorrect-count',
  ];

  constructor() {
    super();

    this.shadow.append(gameListTemplate.content.cloneNode(true));
    this.titleElement = this.shadow.querySelector('.game-title');

    this.summaryListElement = this.shadow.querySelector('ul');
    this.questionCountElement = this.shadow.querySelector('[data-field="questions"]');
    this.playersCountElement = this.shadow.querySelector('[data-field="players"]');
    this.totalCorrectAnswersElemenet = this.shadow.querySelector('[data-field="correct"]');
    this.totalIncorrectAnswersElemenet = this.shadow.querySelector('[data-field="incorrect"]');

    this.gameDataElement = this.shadow.querySelector('.game-data');
    this.activateButtonElement = this.shadow.querySelector('.activate-game');
    this.deactivateButtonElement = this.shadow.querySelector('.deactivate-game');
    this.expandButtomElement = this.shadow.querySelector('.expand-game');

    this.boundedToggleList = this.toggleList.bind(this);
    this.boundedAddQuestionList = this.addQuestionList.bind(this);
    this.boundedActivateGame = this.activateGame.bind(this);
    this.boundedDeactivateGame = this.deactivateGame.bind(this);
  }

  get questionCount() {
    return Number(this.dataset.questionCount);
  }

  set questionCount(value) {
    this.dataset.questionCount = value;
  }

  get playerCount() {
    return Number(this.dataset.playerCount);
  }

  set playerCount(value) {
    this.dataset.playepCount = value;
  }

  get totalCorrectAnswers() {
    return Number(this.dataset.totalCorrectAnswers);
  }

  set totalCorrectAnswers(value) {
    this.dataset.totalCorrectCount = value;
  }

  get totalIncorrectAnswers() {
    return Number(this.dataset.totalIncorrectAnswers);
  }

  set totalIncorrectAnswers(value) {
    this.dataset.totalIncorrectAnswers = value;
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
  }

  addQuestionList() {
    const questionsListElement = document.createElement('trivia-admin-questions-list');
    questionsListElement.dataset.gameId = this.gameId;
    this.gameDataElement.append(questionsListElement);
  }

  activateGame() {
    this.makeRPCCall('games.activate', { id: this.gameId });
  }

  deactivateGame() {
    this.makeRPCCall('games.deactivate', { id: this.gameId });
  }


  disconnectedCallback() {
    this.expandButtomElement.removeEventListener('click', this.boundedToggleList);
  }

  updateGame() {
    this.updateTitle();
    this.updateGameStats();
    this.updateButtons();
  }

  updateTitle() {
    const title = `${this.gameTitle ?? 'Untitled Game'} - ${this.shortCode}`;
    this.titleElement.textContent = title;
  }

  updateGameStats() {
    const correct = Number(this.totalCorrectAnswers ?? 0);
    const totalQuestions = Number(this.questionCount ?? 0);
    const incorrect = Number(this.totalIncorrectAnswers ?? 0);

    this.playersCountElement.textContent = this.playerCount;
    this.questionCountElement.textContent = totalQuestions;

    const correctPercent = totalQuestions
      ? Math.round((correct / totalQuestions) * 100)
      : 0;

    const incorrectPercent = totalQuestions
      ? Math.round((incorrect / totalQuestions) * 100)
      : 0;

    this.totalCorrectAnswersElemenet.textContent = `${correct} (${correctPercent}%)`;
    this.totalIncorrectAnswersElemenet.textContent = `${incorrect} (${incorrectPercent}%)`;
  }

  updateButtons() {
    if (this.bonusGame) {
      console.log('Bonus game');
      this.activateButtonElement.disabled = true;
      this.activateButtonElement.textContent = 'Bonus game';
      this.deactivateButtonElement.classList.add('d-none');
      return;
    }

    if (this.active) {
      console.log('Active game');
      this.activateButtonElement.disabled = true;
      this.activateButtonElement.classList.add('d-none');

      this.deactivateButtonElement.classList.remove('d-none');
      this.deactivateButtonElement.disabled = false;
      return;
    }

    this.activateButtonElement.classList.remove('d-none');
    this.activateButtonElement.disabled = false;

    this.deactivateButtonElement.classList.add('d-none');
    this.deactivateButtonElement.disabled = true;

  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.setAttribute('aria-label', this.shadow.querySelector('h3').textContent);
    this.gameAccordion = new Collapse(this.gameDataElement, { toggle: false });
    this.expandButtomElement.addEventListener('click', this.boundedToggleList);
    this.activateButtonElement.addEventListener('click', this.boundedActivateGame);
    this.deactivateButtonElement.addEventListener('click', this.boundedDeactivateGame);
    this.updateGame();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.hasConnected) {
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
    console.log('attributeChangedCallback', name, oldValue, newValue);

    switch (name) {
      case 'data-question-count':
      // falls through
      case 'data-player-count':
      // falls through
      case 'data-correctcount':
      // falls through
      case 'data-incorrect-count':
        this.updateGameStats();
        break;

      case 'data-active':
      case 'data-bonus':
        this.updateButtons();
        break;

      case 'data-game-title':
      // falls through
      case 'data-short-code':
        this.updateTitle();
    }
  }

  onDataLoaded(result) {
    this.isActive = result.active;
    this.isBonus = result.bonusGame;
  }

}

customElements.define(
  'trivia-admin-game',
  AdminGameElement,
);
