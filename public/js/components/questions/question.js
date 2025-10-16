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
    'data-choice-d',
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

  get choiceElement() {
    return 'trivia-choice';
  }

  get choiceAData() {
    return {
      letter: 'A',
      text: this.choiceA || '',
    };
  }

  get choiceBData() {
    return {
      letter: 'B',
      text: this.choiceB || '',
    };
  }

  get choiceCData() {
    return {
      letter: 'C',
      text: this.choiceC || '',
    };
  }

  get choiceDData() {
    return {
      letter: 'D',
      text: this.choiceD || '',
    };
  }

  get choiceData() {
    return [
      this.choiceAData,
      this.choiceBData,
      this.choiceCData,
      this.choiceDData,
    ];
  }

  connectedCallback() {
    this.updateQuestion();
  }

  updateChoice(choice, choiceData) {
    choice.dataset.choiceLetter = choiceData.letter;
    choice.dataset.text = choiceData.text;
  }

  updateQuestion() {
    this.choicesContainer.innerHTML = '';

    for (const choiceData of this.choiceData) {
      const choice = document.createElement(this.choiceElement);
      this.updateChoice(choice, choiceData);
      this.choicesContainer.append(choice);
    }

    this.questionTextElement.textContent = this.question;
  }

  onDataLoaded(result) {
    this.dataset.question = result.question || '';
    this.dataset.choiceA = result.choiceA || '';
    this.dataset.choiceB = result.choiceB || '';
    this.dataset.choiceC = result.choiceC || '';
    this.dataset.choiceD = result.choiceD || '';
    this.dataset.correctChoice = result.correctChoice || '';
    this.updateQuestion();
  }
}

customElements.define(
  'trivia-question',
  QuestionElement,
);
