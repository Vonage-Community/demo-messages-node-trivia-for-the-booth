import { BootstrapElement } from '../bootstrap.js';

const countTemplate = document.createElement('template');
countTemplate.innerHTML = `
<article class=" choice d-flex flex-column" role="listitem">
  <h6 class="m-0 p-2 mb-2 border rounded choice-text"></h6>

  <div class="row pe-3 ps-3">
    <span class="col-2 choice-stats me-2"></span>

    <div class="progress choice-progress p-0"
    aria-label="Answer percentage"
    aria-valuemax="100"
    aria-valuemin="0">
      <div class="progress-bar choice-progress-bar"></div>
    </div>
  </div>
</article>
`;

export class AdminChoiceElement extends BootstrapElement {
  static observedAttributes = [
    'data-text',
    'data-choice-letter',
    'data-correct',
    'data-correct-choice',
    'data-count',
    'data-total-answers',
  ];

  constructor() {
    super();
    this.shadow.append(countTemplate.content.cloneNode(true));
    this.choiceElement = this.shadow.querySelector('.choice');
    this.textElement = this.shadow.querySelector('.choice-text');
    this.progressElement = this.shadow.querySelector('.choice-progress');
    this.progressBarElement = this.shadow.querySelector('.choice-progress-bar');
    this.statsElement = this.shadow.querySelector('.choice-stats');
  }

  get letter() {
    return this.dataset.letter;
  }

  set letter(value) {
    this.datset.letter = value;
  }

  get text() {
    return this.dataset.text;
  }

  set text(value) {
    this.dataset.text = value;
  }

  get correct() {
    return this.dataset.correct === 'true';
  }

  set correct(value) {
    this.dataset.correct = value;
  }

  get count() {
    return Number(this.dataset.count);
  }

  set count(value) {
    this.datset.count = value;
  }

  get answerCount() {
    return Number(this.dataset.count ?? 0);
  }

  get totalAnswers() {
    return Number(this.dataset.totalAnswers ?? 0);
  }

  get answerPercent() {
    return this.totalAnswers > 0
      ? Math.floor((this.answerCount / this.totalAnswers) * 100)
      : 0;

  }

  get percentage() {
    return this.totalAnswers > 0
      ? Math.floor((this.answerCount / this.totalCount) * 100).toFixed(1)
      : '0.0';
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.updateChoice();
  }

  updateChoice() {
    this.updateText();
    this.updateProgress();
  }

  updateText() {
    this.textElement.textContent = `${this.letter}: ${this.text}`;
    if (this.correct) {
      this.textElement.classList.add('border-success');
    }
  }

  updateProgress() {
    this.progressBarElement.style.width = `${this.answerPercent}%`;
    this.statsElement.textContent = `${this.answerCount} (${this.answerPercent}%)`;

  }
}

customElements.define(
  'trivia-admin-choice',
  AdminChoiceElement,
);
