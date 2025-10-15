import './choice.js';
import '../form/form-input.js';
import { RPCElement } from '../rpcElement.js';

const questionTemplate = document.createElement('template');
questionTemplate.innerHTML = `
<article class="question card border-0" role="group" aria-labelledby="question-text">
  <header class="ms-3 mt-3">
    <h4 class="card-title question-text"></h4>
  </header>

  <section class="card-body">
    <div class="row row-cols-2 g-3 choices" role="list"></div>
  </section>
</article>
`;

export class QuestionElement extends RPCElement {
  static observedAttributes = [
    'data-question-id',
    'data-game-id',
    'data-question',
    'data-choice-a',
    'data-choice-b',
    'data-choice-c',
    'data-choice-c',
    'data-correct-choice',
  ];

  constructor() {
    super();
    this.shadow.append(questionTemplate.content.cloneNode(true));

    this.questionCardElement = this.shadow.querySelector('article');
    this.questionTextElement = this.shadow.querySelector('.question-text');
    this.choicesContainer = this.shadow.querySelector('.choices');
  }

  get questionId() {
    return this.getAttribute('data-question-id');
  }

  get gameId() {
    return this.getAttribute('data-game-id');
  }

  get question() {
    return this.getAttribute('data-question');
  }

  get choiceA() {
    return this.getAttribute('data-choice-a');
  }

  get choiceB() {
    return this.getAttribute('data-choice-b');
  }

  get choiceC() {
    return this.getAttribute('data-choice-c');
  }

  get choiceD() {
    return this.getAttribute('data-choice-d');
  }

  get correctChoice() {
    return this.getAttribute('data-correct-choice');
  }

  get rpcMethod() {
    return 'questions.fetch';
  }

  get rpcParams() {
    return {
      id: this.questionId,
    };
  }

  connectedCallback() {
    this.updateQuestion();
  }

  updateQuestion() {
    this.choicesContainer.innerHTML = '';
    const choices = [
      {
        letter: 'A',
        text: this.choiceA || '',
      },
      {
        letter: 'B',
        text: this.choiceB || '',
      },
      {
        letter: 'C',
        text: this.choiceC || '',
      },
      {
        letter: 'D',
        text: this.choiceD || '',
      },
    ];

    for (const { letter, text } of choices) {
      const choice = document.createElement('trivia-choice');
      choice.setAttribute('data-choice-letter', letter);
      choice.setAttribute('data-title', text);
      this.choicesContainer.append(choice);
    }

    this.questionTextElement.textContent = this.question;
  }

  onDataLoaded(result) {
    this.setAttribute('data-question', result.question || '');
    this.setAttribute('data-choice-a', result.choiceA || '');
    this.setAttribute('data-choice-b', result.choiceB || '');
    this.setAttribute('data-choice-c', result.choiceC || '');
    this.setAttribute('data-choice-d', result.choiceD || '');
    this.setAttribute('data-correct-choice', result.correctChoice || '');
    this.updateQuestion();
  }
}

customElements.define(
  'trivia-question',
  QuestionElement,
);
