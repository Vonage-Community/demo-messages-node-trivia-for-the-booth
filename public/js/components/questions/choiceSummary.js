import { ChoiceElement } from './choice.js';

const countTemplate = document.createElement('template');
countTemplate.innerHTML = `
  <div class="progress choice-progress float-end ms-2">
    <div class="progress-bar" aria-valuemax="100" aria-valuemin="0"></div>
  </div>
  <span class="choice-stats float-end" ></span>
`;

export class ChoiceSummaryElement extends ChoiceElement {
  static observedAttributes = [
    ...ChoiceElement.observedAttributes,
    'data-correct-choice',
    'data-count',
    'data-total-answers',
  ];

  constructor() {
    super();
    this.choiceContainerElement.append(countTemplate.content.cloneNode(true));
    this.countElement = this.shadow.querySelector('.choice-stats');
    this.progressElement = this.shadow.querySelector('.progress-bar');
  }

  get answerCount() {
    return Number(this.dataset.count ?? 0);
  }

  get totalAnswers() {
    return Number(this.dataset.totalAnswers ?? 0);
  }

  get percentage() {
    return this.totalAnswers > 0
      ? Math.floor((this.answerCount / this.totalCount) * 100).toFixed(1)
      : '0.0';
  }

  renderCounts() {
    this.countElement.textContent = `${this.totalAnswers} (${this.percentage}%)`;
    this.progressElement.style.width = `${this.percentage}%`;
    this.progressElement.setAttribute('aria-valuenow', this.percentage);
  }

  render() {
    super.render();
    this.renderCounts();
    const isCorrect = this.dataset.correctChoice === this.dataset.choiceLetter;

    this.choiceElement.classList.toggle('border-success', isCorrect);
    this.choiceElement.classList.toggle('border-4', isCorrect);

    if (isCorrect) {
      this.choiceElement.setAttribute('aria-label', `${this.choiceLetter}: ${this.title} (Correct answer)`);
      this.progressElement.classList.add('bg-success');
      return;
    }

    this.choiceElement.setAttribute('aria-label', `${this.choiceLetter}: ${this.title} `);
    this.progressElement.classList.add('bg-danger');
  }
}

customElements.define('trivia-choice-summary', ChoiceSummaryElement);
