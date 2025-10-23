import { QuestionElement } from './question.js';
import './adminQuestionForm.js';
import './choiceSummary.js';
import { registerEvent, removeEvent } from '../../events.js';

const questionTemplate = document.createElement('template');
questionTemplate.innerHTML = `
<article class="question border-bottom mb-3 mt-3 pb-3 pt-3 " role="group" aria-labelledby="question-text">
  <header>
    <h4 class="question-text"></h4>
  </header>

  <section class="row row-cols-2 g-3 choices pb-3">
  </section>

  <button class="btn btn-secondary edit-question" aria-label="Edit this question">Edit</button>
  <button class="btn btn-danger delete-question" aria-label="Delete this question">Delete</button>
</article>
`;

export class AdminQuestionElement extends QuestionElement {
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
    this.shadow.append(questionTemplate.content.cloneNode(true));

    this.questionCardElement = this.shadow.querySelector('.question');
    this.questionTextElement = this.shadow.querySelector('.question-text');
    this.choicesElement = this.shadow.querySelector('.choices');
    this.editButtonElement = this.shadow.querySelector('.edit-question');
    this.deleteButtonElement = this.shadow.querySelector('.delete-question');

    this.boundedBuildChoiceElement = this.buildChoiceElement.bind(this);

    this.choices = [];
    this.formShowing = false;
  }

  get correctChoice() {
    return this.dataset.correctChoice;
  }

  set correctChoice(value) {
    this.dataset.correctChoice = value;
  }

  get correctAnswerCount() {
    return Number(this.dataset.correctAnswerCount);
  };

  set correctAnswerCount(value) {
    this.dataset.correctAnswerCount = value;
  }

  get incorrectAnswerCount() {
    return Number(this.dataset.incorrectAnswerCount);
  }

  set incorrectAnswerCount(value) {
    this.dataset.incorrectAnswerCount = value;
  }

  get countChoiceA() {
    return Number(this.dataset.countChoiceA);
  }

  set countChoiceA(value) {
    this.dataset.countChoiceA = value;
  }

  get countChoiceB() {
    return Number(this.dataset.countChoiceB);
  }

  set countChoiceB(value) {
    this.dataset.countChoiceB = value;
  }

  get countChoiceC() {
    return Number(this.dataset.countChoiceC);
  }

  set countChoiceC(value) {
    this.dataset.countChoiceC = value;
  }

  get countChoiceD() {
    return Number(this.dataset.countChoiceD);
  }

  set countChoiceD(value) {
    this.dataset.countChoiceD = value;
  }

  get totalAnswers() {
    return this.correctAnswerCount + this.incorrectAnswerCount;
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

  toggleForm() {
    const questionFormElement = document.createElement('trivia-admin-question-form');
    for (const [key, value] of Object.entries(this.dataset)) {
      questionFormElement.dataset[key] = value;
    }

    this.questionCardElement.append(questionFormElement);
    questionFormElement.toggleModal();

    questionFormElement.modal.addEventListener('hidden.bs.modal', () => {
      questionFormElement.remove();
      this.makeRPCCall();
    });
  }

  updateQuestion() {
    this.updateTitle();
    this.updateChoices();
  };

  updateTitle() {
    this.questionTextElement.textContent = this.question;
  }

  updateChoices() {
    this.choicesElement.innerHTML = '';
    const choiceData = [
      {
        letter: 'A',
        text: this.choiceA,
        count: this.countChoiceA,
        correct: this.correctChoice === 'A',
      },
      {
        letter: 'B',
        text: this.choiceB,
        count: this.countChoiceB,
        correct: this.correctChoice === 'B',
      },
      {
        letter: 'C',
        text: this.choiceC,
        count: this.countChoiceC,
        correct: this.correctChoice === 'C',
      },
      {
        letter: 'D',
        text: this.choiceD,
        count: this.countChoiceD,
        correct: this.correctChoice === 'D',
      },
    ];

    choiceData.forEach(this.boundedBuildChoiceElement);
  }

  buildChoiceElement(choiceData) {
    const choiceElement = document.createElement('trivia-choice-summary');
    Object.entries(choiceData).forEach(([key, value]) => {
      choiceElement.dataset[key] = value;
      choiceElement.dataset.totalAnswers = this.totalAnswers;
    });

    this.choicesElement.append(choiceElement);

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
    this.boundedToggleForm = this.toggleForm.bind(this);
    this.boundedDeleteQuestion = this.deleteQuestion.bind(this);
    this.editButtonElement.addEventListener('click', this.boundedToggleForm);
    this.deleteButtonElement.addEventListener('click', this.boundedDeleteQuestion);
    this.updateQuestion();
  }

  disconnectedCallback() {
    this.editButtonElement.removeEventListener('click', this.boundedToggleForm);
    this.deleteButtonElement.removeEventListener('click', this.boundedDeleteQuestion);
  }

  onDataLoaded(result) {
    super.onDataLoaded(result);
    this.correctAnswerCount = result.correctAnswerCount ?? 0;
    this.incorrectAnswerCount = result.incorrectAnswerCount ?? 0;
    this.countChoiceA = result.countChoiceA ?? 0;
    this.countChoiceB = result.countChoiceB ?? 0;
    this.countChoiceC = result.countChoiceC ?? 0;
    this.countChoiceD = result.countChoiceD ?? 0;
    this.updateQuestion();
  }
}

customElements.define(
  'trivia-admin-question',
  AdminQuestionElement,
);
