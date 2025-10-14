import { BootstrapElement } from '../bootstrap.js';
import '../questions/questionList.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section class="card mb-3 w-100" aria-labelledby="game-title" role="region">
  <header class="card-header">
    <h3 id="game-title">Title</h3>
  </header>

  <ul class="list-inline m-3 mb-0">
    <li class="list-inline-item">Questions: <span data-field="questions" aria-live="polite">0</span></li>
    <li class="list-inline-item">Players: <span data-field="players" aria-live="polite">0</span></li>
    <li class="list-inline-item">Correct Answers: <span data-field="correct" aria-live="polite">0%</span></li>
    <li class="list-inline-item">Incorrect Answers: <span data-field="incorrect" aria-live="polite">0%</span></li>
  </ul>

  <section id="questions-section" class="collapse p-1"></section>

  <footer class="card-body">
    <button class="btn btn-primary" id="activate" aria-label="Activate this game">Activate</button>
    <button class="btn btn-primary" id="show-questions" aria-label="Show or hide questions for this game">Questions</button>
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
    this.questionsElement = this.shadow.querySelector('[data-field="questions"]');
    this.playersElement = this.shadow.querySelector('[data-field="players"]');
    this.correctElement = this.shadow.querySelector('[data-field="correct"]');
    this.incorrectElement = this.shadow.querySelector('[data-field="incorrect"]');
    this.activateElement = this.shadow.querySelector('#activate');

    this.showQuestionsElement = this.shadow.querySelector('#show-questions');
    this.showQuestionsElement.setAttribute('aria-expanded', 'false');
    this.showQuestionsElement.setAttribute('aria-controls', 'questions-section');

    this.questionsSectionElement = this.shadow.querySelector('#questions-section');
    this.questionsListElement = document.createElement('trivia-questions-list');
    this.questionsSectionElement.append(this.questionsListElement);
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

  connectedCallback() {
    this.boundShowQuestions = this.showQuestions.bind(this);
    this.boundActivate = this.activate.bind(this);
    this.showQuestionsElement.addEventListener('click', this.boundShowQuestions);
    this.activateElement.addEventListener('click', this.boundActivate);
  }

  disconnectedCallback() {
    this.showQuestionsElement.removeEventListener('click', this.boundShowQuestions);
    this.activateElement.removeEventListener('click', this.boundActivate);
  }

  showQuestions() {
    this.questionsSectionElement.classList.toggle('collapse.show');
    this.questionsSectionElement.classList.toggle('collapse');
    this.questionsListElement.setAttribute('data-game-id', this.gameId);
    const expanded = this.showQuestionsElement.getAttribute('aria-expanded') === 'true';
    this.showQuestionsElement.setAttribute('aria-expanded', String(!expanded));
  }

  activate() {
    console.log('Activate');
  }

  updateSummary() {
    const title = this.dataset.gameTitle ?? 'Untitled Game';
    const totalQuestions = Number(this.dataset.gameQuestionCount ?? 0);
    const correct = Number(this.dataset.gameCorrectCount ?? 0);
    const incorrect = Number(this.dataset.gameIncorrectCount ?? 0);

    const correctPct = totalQuestions
      ? Math.round((correct / totalQuestions) * 100)
      : 0;

    const incorrectPct = totalQuestions
      ? Math.round((incorrect / totalQuestions) * 100)
      : 0;

    this.titleElement.textContent = title;
    this.questionsElement.textContent = totalQuestions;
    this.correctElement.textContent = `${correct} (${correctPct}%)`;
    this.incorrectElement.textContent = `${incorrect} (${incorrectPct}%)`;
  }

  attributeChangedCallback() {
    this.updateSummary();
  }

  render() {
    console.log('Rendering game summary');
  }

}

customElements.define(
  'trivia-game-summary',
  GamesSummaryElement,
);
