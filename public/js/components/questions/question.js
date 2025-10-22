import { RPCElement } from '../rpcElement.js';

export class QuestionElement extends RPCElement {
  static observedAttributes = [
    'data-question-id',
    'data-game-id',
    'data-question',
    'data-choice-a',
    'data-choice-b',
    'data-choice-c',
    'data-choice-d',
  ];

  constructor() {
    super();
    if (new.target === RPCElement) {
      throw new TypeError('Cannot instantiate QuestionElement directly');
    }
  }

  get questionId() {
    return this.dataset.questionId;
  }

  set questionId(value) {
    this.dataset.questionId = value;
  }

  get gameId() {
    return this.dataset.gameId;
  }

  set gameId(value) {
    this.dataset.gameId = value;
  }

  get question() {
    return this.dataset.question;
  }

  set question(value) {
    this.dataset.question = value;
  }

  get choiceA() {
    return this.dataset.choiceA;
  }

  set choiceA(value) {
    this.dataset.choiceA = value;
  }

  get choiceB() {
    return this.dataset.choiceB;
  }

  set choiceB(value) {
    this.dataset.choiceB = value;
  }

  get choiceC() {
    return this.dataset.choiceC;
  }

  set choiceC(value) {
    this.dataset.choiceC = value;
  }

  get choiceD() {
    return this.dataset.choiceD;
  }

  set choiceD(value) {
    this.dataset.choiceD = value;
  }


  get rpcMethod() {
    return 'questions.fetch';
  }

  get rpcParams() {
    return {
      id: this.questionId,
    };
  }

  onDataLoaded(result) {
    this.question = result?.question || '';
    this.choiceA = result?.choiceA || '';
    this.choiceB = result?.choiceB || '';
    this.choiceC = result?.choiceC || '';
    this.choiceD = result?.choiceD || '';
    this.correctChoice = result?.correctChoice || '';
    this.questionId = result?.id;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.hasConnected) {
      return;
    }

    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'data-game-id':
        this.gameId = newValue;
        break;

      case 'data-question':
        this.question = newValue;
        break;

      case 'data-choice-a':
        this.choiceA = newValue;
        break;

      case 'data-choice-b':
        this.choiceB = newValue;
        break;

      case 'data-choice-c':
        this.choiceC = newValue;
        break;

      case 'data-choice-d':
        this.choiceD = newValue;
        break;
    }
  }
}

customElements.define(
  'trivia-question',
  QuestionElement,
);
