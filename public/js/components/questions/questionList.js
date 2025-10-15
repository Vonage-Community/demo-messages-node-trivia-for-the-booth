import { RPCElement } from '../rpcElement.js';
import './questionSummary.js';
import './questionForm.js';
import Collapse from 'bootstrap/js/dist/collapse';

const questionListTemplate = document.createElement('template');
questionListTemplate.innerHTML = `
<section class="card mb-3 w-100 accordion accordion-flush border-0" aria-labelledby="question-title">
  <div class="accordion-item">
    <header class="card-header border-0 d-flex align-items-center gap-2">

      <button class="accordion-button bg-transparent collapsed expand-questions"
        type="button"
        aria-expanded="false">
        <h3 id="question-title" class="mb-0">
          Questions
        </h3>
      </button>

      <button class="btn btn-success add-question" aria-label="Add a new question">Add</button>
    </header>

    <section class="accordion-body accordion-collapse collapse"
      id="questionsAccordion"
      role="region"
      aria-label="Questions list">
      </section>
  </div>
</section>
`;

export class QuestionListElement extends RPCElement {
  static observedAttributes = ['data-game-id'];

  constructor() {
    super();
    this.shadow.append(questionListTemplate.content.cloneNode(true));
    this.accordionElement = this.shadow.querySelector('#questionsAccordion');
    this.expandButtomElement = this.shadow.querySelector('button.expand-questions');
    this.addButtomElement = this.shadow.querySelector('button.add-question');
    this.hasConnected = false;
    this.expanded = false;
  }


  addQuestion() {
    const questionFormElement = document.createElement('trivia-question-form');
    this.accordionElement.append(questionFormElement);
    questionFormElement.setAttribute('data-game-id', this.gameId);
    questionFormElement.toggleModal();

    questionFormElement.modal.addEventListener('hidden.bs.modal', () => {
      questionFormElement.remove();
    });
  }

  toggleList() {
    this.expanded = this.expandButtomElement.classList.contains('collapsed');
    this.questionAccordion.toggle();
    this.expandButtomElement.setAttribute(
      'aria-expanded',
      !this.expanded,
    );

    this.expandButtomElement.classList.toggle('collapsed');

    if (this.expanded && this.hasAttribute('data-game-id')) {
      this.makeRPCCall();
    }
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.boundedToggleList = this.toggleList.bind(this);
    this.boundedAddQuestion = this.addQuestion.bind(this);
    this.setAttribute('aria-label', this.shadow.querySelector('h3').textContent);
    this.questionAccordion = new Collapse(this.accordionElement, { toggle: false });
    this.expandButtomElement.addEventListener('click', this.boundedToggleList);
    this.addButtomElement.addEventListener('click', this.boundedAddQuestion);
  }

  disconnectedCallback() {
    this.expandButtomElement.removeEventListener('click', this.boundedToggleList);
    this.addButtomElement.removeEventListener('click', this.boundedAddQuestion);
  }

  get rpcMethod() {
    return 'questions.for_game';
  }

  get rpcParams() {
    return {
      gameId: this.gameId,
      detailed: true,
    };
  }

  get gameId() {
    return this.getAttribute('data-game-id');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.expanded && name === 'data-game-id' && oldValue !== newValue) {
      this.makeRPCCall();
    }
  }

  onDataLoaded(questions) {
    this.accordionElement.innerHTML = '';

    questions.forEach((question) => {
      const questionElement = document.createElement('trivia-question-summary');

      questionElement.setAttribute('data-game-id', this.gameId);
      questionElement.setAttribute('data-question-id', question.id);
      questionElement.setAttribute('data-question', question.question);
      questionElement.setAttribute('data-choice-a', question.choiceA);
      questionElement.setAttribute('data-choice-b', question.choiceB);
      questionElement.setAttribute('data-choice-c', question.choiceC);
      questionElement.setAttribute('data-choice-d', question.choiceD);
      questionElement.setAttribute('data-correct-choice', question.correctChoice);

      this.accordionElement.append(questionElement);
    });
  }
}

customElements.define('trivia-questions-list', QuestionListElement);
