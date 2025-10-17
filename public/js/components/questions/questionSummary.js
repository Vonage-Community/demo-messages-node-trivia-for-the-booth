import { QuestionElement } from './question.js';
import './questionForm.js';
import './choiceSummary.js';
import { registerEvent, removeEvent } from '../../events.js';

const questionControlTemplate = document.createElement('template');
questionControlTemplate.innerHTML = `
<div class="card-body p-0 pt-3">
  <button class="btn btn-secondary edit-question" aria-label="Edit this question">Edit</button>
  <button class="btn btn-danger delete-question" aria-label="Delete this question">Delete</button>
</div>
`;

export class QuestionSummaryElement extends QuestionElement {
  static observedAttributes = [
    ...QuestionElement.observedAttributes,
    'data-correct-choice',
    'data-correct-answer-count',
    'data-incorrect-answer-count',
    'data-count-choice-a',
    'data-count-choice-b',
    'data-count-choice-c',
    'data-count-choice-d',
  ];

  constructor() {
    super();
    this.choicesSection = this.shadow.querySelector('section.card-body');
    this.choicesSection.append(questionControlTemplate.content.cloneNode(true));
    this.editButtonElement = this.shadow.querySelector('button.edit-question');
    this.deleteButtonElement = this.shadow.querySelector('button.delete-question');
    this.questionCardElement.classList.add('border-bottom');
    this.radioElements = [];
    this.formShowing = false;
  }

  get choiceElement() {
    return 'trivia-choice-summary';
  }

  toggleForm() {
    const questionElement = document.createElement('trivia-question-form');

    questionElement.dataset.question = this.question || '';
    questionElement.dataset.choiceA = this.choiceA || '';
    questionElement.dataset.choiceB = this.choiceB || '';
    questionElement.dataset.choiceC = this.choiceC || '';
    questionElement.dataset.choiceD = this.choiceD || '';
    questionElement.dataset.correctChoice = this.correctChoice || '';
    questionElement.dataset.gameId = this.gameId || '';
    questionElement.dataset.questionId = this.questionId || '';

    questionElement.dataset.correctAnswerCount = this.correctAnswerCount ?? 0;
    questionElement.dataset.incorrectAnswerCount = this.incorrectAnswerCount ?? 0;
    questionElement.dataset.countChoiceA = this.countChoiceA ?? 0;
    questionElement.dataset.countChoiceB = this.countChoiceB ?? 0;
    questionElement.dataset.countChoiceC = this.countChoiceC ?? 0;
    questionElement.dataset.countChoiceD = this.countChoiceD ?? 0;

    this.questionCardElement.append(questionElement);
    questionElement.toggleModal();

    questionElement.modal.addEventListener('hidden.bs.modal', () => {
      questionElement.remove();
      this.makeRPCCall();
    });
  }

  get totalAnswers() {
    return Number(this.dataset.correctAnswerCount ?? 0) + Number(this.dataset.incorrectAnswerCount ?? 0);
  }

  get choiceAData() {
    return {
      ...super.choiceAData,
      correctChoice: this.dataset.correctChoice,
      count: this.dataset.countChoiceA,
    };
  }

  get choiceBData() {
    return {
      ...super.choiceBData,
      correctChoice: this.dataset.correctChoice,
      count: this.dataset.countChoiceC,
    };
  }

  get choiceCData() {
    return {
      ...super.choiceCData,
      correctChoice: this.dataset.correctChoice,
      count: this.dataset.countChoiceC,
    };
  }

  get choiceDData() {
    return {
      ...super.choiceDData,
      correctChoice: this.dataset.correctChoice,
      count: this.dataset.countChoiceD,
    };
  }

  updateChoice(choice, choiceData) {
    super.updateChoice(choice, choiceData);
    choice.dataset.correctChoice = choiceData.correctChoice;
    choice.dataset.count = choiceData.count || 0;
    choice.dataset.totalAnswers = this.totalAnswers;
  }

  deleteQuestion() {
    this.makeRPCCall(
      'questions.delete',
      {
        id: this.questionId,
      },
    );

    const removeSummaryAfterDelete = () => {
      removeEvent('rpc:success', removeSummaryAfterDelete);
      this.remove();
    };

    registerEvent('rpc:success', removeSummaryAfterDelete);
  }

  connectedCallback() {
    super.connectedCallback();
    this.boundedToggleForm = this.toggleForm.bind(this);
    this.boundedDeleteQuestion = this.deleteQuestion.bind(this);
    this.editButtonElement.addEventListener('click', this.boundedToggleForm);
    this.deleteButtonElement.addEventListener('click', this.boundedDeleteQuestion);
  }

  disconnectedCallback() {
    this.editButtonElement.removeEventListener('click', this.boundedToggleForm);
    this.deleteButtonElement.removeEventListener('click', this.boundedDeleteQuestion);
  }

  onDataLoaded(result) {
    super.onDataLoaded(result);
    this.dataset.correctAnswerCount = result.correctAnswerCount ?? 0;
    this.dataset.incorrectAnswerCount = result.incorrectAnswerCount ?? 0;
    this.dataset.countChoiceA = result.countChoiceA ?? 0;
    this.dataset.countChoiceB = result.countChoiceB ?? 0;
    this.dataset.countChoiceC = result.countChoiceC ?? 0;
    this.dataset.countChoiceD = result.countChoiceD ?? 0;
    this.updateQuestion();
  }
}

customElements.define(
  'trivia-question-summary',
  QuestionSummaryElement,
);
