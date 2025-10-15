import { QuestionElement } from './question.js';

const questionControlTemplate = document.createElement('template');
questionControlTemplate.innerHTML = `
<div class="card-body p-0 pt-3">
  <button class="btn btn-secondary edit-question" aria-label="Edit this question">Edit</button>
</div>
`;

export class QuestionSummaryElement extends QuestionElement {
  constructor() {
    super();
    this.choicesSection = this.shadow.querySelector('section.card-body');
    this.choicesSection.append(questionControlTemplate.content.cloneNode(true));
    this.editButtonElement = this.shadow.querySelector('button.edit-question');
    this.questionCardElement.classList.add('border-bottom');
    this.radioElements = [];
    this.formShowing = false;
  }

  toggleForm() {
    console.log('Toggle Form');
  }

  connectedCallback() {
    super.connectedCallback();
    this.boundedToggleForm = this.toggleForm.bind(this);
    this.editButtonElement.addEventListener('click', this.boundedToggleForm);
  }

  disconnectedCallback() {
    this.editButtonElement.removeEventListener('click', this.boundedToggleForm);
  }
}

customElements.define(
  'trivia-question-summary',
  QuestionSummaryElement,
);
