import { BootstrapElement } from '../bootstrap.js';
import '../questions/questionList.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section class="card mb-3 w-100" aria-labelledby="game-title">
  <header class="card-header">
    <h3 id="game-title">Title</h3>
  </header>

  <ul class="list-inline m-3 mb-0">
    <li class="list-inline-item">Questions: <span data-field="questions" aria-live="polite">0</span></li>
    <li class="list-inline-item">Players: <span data-field="players" aria-live="polite">0</span></li>
    <li class="list-inline-item">Correct: <span data-field="correct" aria-live="polite">0%</span></li>
    <li class="list-inline-item">Incorrect: <span data-field="incorrect" aria-live="polite">0%</span></li>
  </ul>

  <trivia-questions-list class="game-questions"></trivia-questions-list>

  <footer class="card-body d-flex gap-2">
    <button class="btn btn-primary" id="activate" type="button">Activate</button>
  </footer>
</section>
`;

export class GamesSummaryElement extends BootstrapElement {
  static observedAttributes = [
    'data-game-id',
    'data-game-title',
    'data-game-question-count',
    'data-game-player-count',
    'data-game-correct-count',
    'data-game-incorrect-count',
  ];

  constructor() {
    super();

    this.shadow.append(gameListTemplate.content.cloneNode(true));
    this.titleElement = this.shadow.querySelector('#game-title');

    this.summaryListElement = this.shadow.querySelector('ul');
    this.questionsElement = this.shadow.querySelector('[data-field="questions"]');
    this.playersElement = this.shadow.querySelector('[data-field="players"]');
    this.correctElement = this.shadow.querySelector('[data-field="correct"]');
    this.incorrectElement = this.shadow.querySelector('[data-field="incorrect"]');

    this.questionsListElement = this.shadow.querySelector('.game-questions');

    this.activateElement = this.shadow.querySelector('#activate');
  }

  get gameId() {
    return this.getAttribute('data-game-id');
  }

  set gameId(value) {
    this.setAttribute('data-game-id', value);
  }

  get gameTitle() {
    return this.getAttribute('data-game-title');
  }

  set gameTitle(value) {
    this.setAttribute('data-game-title', value);
  }

  get gameQuestionCount() {
    return Number(this.getAttribute('data-game-question-count')) || 0;
  }

  set gameQuestionCount(value) {
    this.setAttribute('data-game-question-count', value);
  }

  get gamePlayerCount() {
    return Number(this.getAttribute('data-game-player-count')) || 0;
  }

  set gamePlayerCount(value) {
    this.setAttribute('data-game-player-count', value);
  }

  get gameCorrectCount() {
    return Number(this.getAttribute('data-game-correct-count')) || 0;
  }

  set gameCorrectCount(value) {
    this.setAttribute('data-game-correct-count', value);
  }

  get gameIncorrectCount() {
    return Number(this.getAttribute('data-game-incorrect-count')) || 0;
  }

  set gameIncorrectCount(value) {
    this.setAttribute('data-game-incorrect-count', value);
  }

  get gameShortCode() {
    return this.getAttribute('data-game-short-code');
  }

  set gameShortCode(value) {
    this.setAttribute('data-game-short-code');
  }

  activate() {
    console.log('Activate');
  }

  updateSummary() {
    const title = `${this.dataset.gameTitle ?? 'Untitled Game'} - ${this.dataset.gameShortCode}`;
    const totalQuestions = Number(this.dataset.gameQuestionCount ?? 0);
    const correct = Number(this.dataset.gameCorrectCount ?? 0);
    const incorrect = Number(this.dataset.gameIncorrectCount ?? 0);

    const correctPercent = totalQuestions
      ? Math.round((correct / totalQuestions) * 100)
      : 0;

    const incorrectPercent = totalQuestions
      ? Math.round((incorrect / totalQuestions) * 100)
      : 0;

    this.titleElement.textContent = title;
    this.questionsElement.textContent = totalQuestions;
    this.correctElement.textContent = `${correct} (${correctPercent}%)`;
    this.incorrectElement.textContent = `${incorrect} (${incorrectPercent}%)`;
    this.questionsListElement.setAttribute('data-game-id', this.gameId);
  }

  attributeChangedCallback() {
    this.updateSummary();
  }

}

customElements.define(
  'trivia-game-summary',
  GamesSummaryElement,
);
