import { RPCElement } from '../rpcElement.js';
import './adminQuestion.js';
import './adminQuestionForm.js';
import './adminQuestionGenerateForm.js';
import Collapse from 'bootstrap/js/dist/collapse';

const questionListTemplate = document.createElement('template');
questionListTemplate.innerHTML = `
<section class="mb-3 w-100 border-0" aria-label="Questions">
  <header class="border-0 d-flex justify-content-between align-items-center gap-2">
      <h3 class="mb-0">
        Questions
      </h3>

      <div>
        <button class="btn btn-success add-question" aria-label="Add a new question">Add</button>
        <button class="btn btn-success generate-question" aria-label="Generate questions using Chat GPT">Generate</button>
      </div>
  </header>

  <section class="question-list"
    role="region"
    aria-label="Questions list">
    <div class="text-center fs-3 p-3" role="region">There are no questions</div>
  </section>
</section>
`;

export class AdminQuestionListElement extends RPCElement {
  static observedAttributes = ['data-game-id'];

  constructor() {
    super();
    this.shadow.append(questionListTemplate.content.cloneNode(true));
    this.questionListElement = this.shadow.querySelector('.question-list');
    this.addButtomElement = this.shadow.querySelector('.add-question');
    this.generateButtomElement = this.shadow.querySelector('.generate-question');

    this.boundedBuildQuestionElement = this.buildQuestionElement.bind(this);
    this.hasConnected = false;
    this.expanded = false;
  }

  modalForm(which = 'trivia-admin-question-form') {
    const questionFormElement = document.createElement(which);
    this.questionListElement.append(questionFormElement);

    questionFormElement.dataset.gameId = this.gameId;
    questionFormElement.toggleModal();

    questionFormElement.modal.addEventListener('hidden.bs.modal', () => {
      questionFormElement.remove();
      this.makeRPCCall();
    });
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.setAttribute('aria-label', this.shadow.querySelector('h3').textContent);
    this.questionAccordion = new Collapse(this.questionListElement, { toggle: false });

    const addQuestionModal = () => { this.modalForm(); };
    const addGenerateModal = () => {
      this.modalForm('trivia-admin-generate-questions-form');
    };

    this.boundedAddQuestion = addQuestionModal.bind(this);
    this.boundedGenerateQuestions = addGenerateModal.bind(this);

    this.addButtomElement.addEventListener('click', this.boundedAddQuestion);
    this.generateButtomElement.addEventListener('click', this.boundedGenerateQuestions);
  }

  disconnectedCallback() {
    this.addButtomElement.removeEventListener('click', this.boundedAddQuestion);
    this.generateButtomElement.removeEventListener('click', this.boundedGenerateQuestions);
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
    return this.dataset.gameId;
  }

  set gameId(value) {
    this.dataset.gameId = value;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-game-id' && oldValue !== newValue) {
      this.makeRPCCall();
    }
  }

  buildQuestionElement(question) {
    const questionElement = document.createElement('trivia-admin-question');
    Object.entries(question).forEach(([key, value]) => {
      questionElement.dataset[key === 'id' ? 'questionId' : key] = value;
    });

    console.log(questionElement);
    this.questionListElement.append(questionElement);
  }


  onDataLoaded(questions) {
    if (questions.length < 1) {
      return;
    }

    this.questionListElement.innerHTML = '';
    console.log(questions);

    questions.forEach(this.boundedBuildQuestionElement);
  }
}

customElements.define(
  'trivia-admin-questions-list',
  AdminQuestionListElement,
);
