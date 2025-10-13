import './choice.js';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';
import { RPCElement } from '../rpcElement.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(bootstrap);

const questionTemplate = document.createElement('template');
questionTemplate.innerHTML = `
<div class="question card">
  <div class="card-body">
    <h5 class="card-title question-text"></h5>
    <div class="choices card-group"></div>
  </div>
</div>
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
    'data-count-choice-a',
    'data-count-choice-b',
    'data-count-choice-c',
    'data-count-choice-d',
    'data-count-answer-correct',
    'data-count-answer-incorrect',
  ];

  constructor() {
    super();
    this.shadow.adoptedStyleSheets = [sheet];
    this.shadow.append(questionTemplate.content.cloneNode(true));

    this.container = this.shadow.querySelector('.question');
    this.questionTextElement = this.shadow.querySelector('.question-text');
    this.choicesContainer = this.shadow.querySelector('.choices');
    console.log(this.container);
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

  get countChoiceA() {
    return this.getAttribute('data-count-choice-a');
  }

  get countChoiceB() {
    return this.getAttribute('data-count-choice-b');
  }

  get countChoiceC() {
    return this.getAttribute('data-count-choice-c');
  }

  get countChoiceD() {
    return this.getAttribute('data-count-choice-d');
  }

  get answeredCorrect() {
    return this.getAttribute('data-count-answer-correct');
  }

  get answeredIncorrect() {
    return this.getAttribute('data-count-answer-incorrect');
  }

  get rpcMethod() {
    return 'questions.fetch';
  }

  get rpcParams() {
    return {
      id: this.questionId,
    };
  }

  render() {
    console.log('render');
    this.questionTextElement.textContent = this.question;
    this.choicesContainer.innerHTML = '';

    const choices = [
      {
        letter: 'A',
        text: this.choiceA || '',
        count: this.countChoiceA,
      },
      {
        letter: 'B',
        text: this.choiceB || '',
        count: this.countChoiceB,
      },
      {
        letter: 'C',
        text: this.choiceC || '',
        count: this.countChoiceC,
      },
      {
        letter: 'D',
        text: this.choiceD || '',
        count: this.countChoiceD,
      },
    ];

    for (const { letter, text, count } of choices) {
      const choice = document.createElement('trivia-choice');
      choice.setAttribute('data-choice-letter', letter);
      choice.setAttribute('data-title', text);
      choice.setAttribute('data-answer-count', count);
      choice.classList.add('w-50', 'mb-3', 'p-3');
      this.choicesContainer.append(choice);
    }
  }

  onDataLoaded(result) {
    console.log('Question Loaded', result);
    this.setAttribute('data-question', result.question || '');
    this.setAttribute('data-choice-a', result.choiceA || '');
    this.setAttribute('data-choice-b', result.choiceB || '');
    this.setAttribute('data-choice-c', result.choiceC || '');
    this.setAttribute('data-choice-d', result.choiceD || '');
    this.render();
  }
}

customElements.define(
  'trivia-question',
  QuestionElement,
);
