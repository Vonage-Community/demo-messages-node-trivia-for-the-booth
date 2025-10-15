import { QuestionElement } from './question.js';
import './questionForm.js';

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
    const questionElement = document.createElement('trivia-question-form');
    this.questionCardElement.append(questionElement);

    questionElement.setAttribute('data-question', this.question || '');
    questionElement.setAttribute('data-choice-a', this.choiceA || '');
    questionElement.setAttribute('data-choice-b', this.choiceB || '');
    questionElement.setAttribute('data-choice-c', this.choiceC || '');
    questionElement.setAttribute('data-choice-d', this.choiceD || '');
    questionElement.setAttribute('data-correct-choice', this.correctChoice || '');
    questionElement.setAttribute('data-game-id', this.gameId || '');
    questionElement.setAttribute('data-question-id', this.questionId || '');

    questionElement.toggleModal();

    questionElement.modal.addEventListener('hidden.bs.modal', () => {
      questionElement.remove();
    });
  }

  updateQuestion() {
    super.updateQuestion();
    if (this.correctChoice) {
      const correctChoiceElement = this.shadow.querySelector(`trivia-choice[data-choice-letter="${this.correctChoice}"]`);
      correctChoiceElement.choiceElement.classList.toggle('border-success');
    }
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
