import { RPCElement } from '../rpcElement.js';

const questionListTemplate = document.createElement('template');
questionListTemplate.innerHTML = `
<section class="card mb-3 w-100" aria-labelledby="question-title">
  <header class="card-header">
    <h3>Questions</h3>
  </header>
  <ul class="card-group row" role="list"></ul>
</section>
`;

export class QuestionListElement extends RPCElement {
  static observedAttributes = ['data-game-id'];

  constructor() {
    super();
    this.shadow.append(questionListTemplate.content.cloneNode(true));
    this.questionListElement = this.shadow.querySelector('ul');
  }

  connectedCallback() {
    this.setAttribute('aria-label', this.shadow.querySelector('h3').textContent);
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

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Changed', name, oldValue, newValue);
    if (name === 'data-game-id' && oldValue !== newValue) {
      this.loadData();
    }
  }

  onDataLoaded(questions) {
    console.log(questions);
    questions.forEach(({ question, choiceA, choiceB, choiceC, choiceD }) => {
      const questionElement = document.createElement('trivia-question');
      questionElement.setAttribute('data-question', question);
      questionElement.setAttribute('data-choice-a', choiceA);
      questionElement.setAttribute('data-choice-b', choiceB);
      questionElement.setAttribute('data-choice-c', choiceC);
      questionElement.setAttribute('data-choice-d', choiceD);

      this.questionListElement.append(questionElement);
    });
  }
}

customElements.define(
  'trivia-questions-list',
  QuestionListElement,
);
