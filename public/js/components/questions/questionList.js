import { RPCElement } from '../rpcElement.js';
import './questionSummary.js';
import './questionForm.js';
import Collapse from 'bootstrap/js/dist/collapse';

const questionListTemplate = document.createElement('template');
questionListTemplate.innerHTML = `
<section class="card mb-3 w-100 border-0" aria-labelledby="question-title">
  <header class="card-header border-0 d-flex align-items-center gap-2">
    <h3 id="question-title" class="mb-0">
      Questions
    </h3>

    <button class="btn btn-success add-question" aria-label="Add a new question">Add</button>
  </header>

  <section class="question-list"
    role="region"
    aria-label="Questions list">
  </section>
</section>
`;

export class QuestionListElement extends RPCElement {
  static observedAttributes = ['data-game-id'];

  constructor() {
    super();
    this.shadow.append(questionListTemplate.content.cloneNode(true));
    this.questionListElement = this.shadow.querySelector('.question-list');
    this.addButtomElement = this.shadow.querySelector('button.add-question');
    this.hasConnected = false;
    this.expanded = false;
  }

  addQuestion() {
    const questionFormElement = document.createElement('trivia-question-form');
    this.questionListElement.append(questionFormElement);
    questionFormElement.setAttribute('data-game-id', this.gameId);
    questionFormElement.toggleModal();

    questionFormElement.modal.addEventListener('hidden.bs.modal', () => {
      questionFormElement.remove();
    });
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.boundedAddQuestion = this.addQuestion.bind(this);
    this.setAttribute('aria-label', this.shadow.querySelector('h3').textContent);
    this.questionAccordion = new Collapse(this.questionListElement, { toggle: false });
    this.addButtomElement.addEventListener('click', this.boundedAddQuestion);
  }

  disconnectedCallback() {
    this.addButtomElement.removeEventListener('click', this.boundedAddQuestion);
  }

  get rpcMethod() {
    return 'questions.for_game';
  }

  get rpcParams() {
    return {
      gameId: this.gameId,
    };
  }

  get gameId() {
    return this.getAttribute('data-game-id');
  }

  get loadingTargetElement() {
    return this.questionListElement;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-game-id' && oldValue !== newValue) {
      this.makeRPCCall();
    }
  }

  onDataLoaded(questions) {
    this.questionListElement.innerHTML = '';

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

      this.questionListElement.append(questionElement);
    });
  }
}

customElements.define('trivia-questions-list', QuestionListElement);
