import { RPCElement } from '../rpcElement.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
`;

export class ChoiceElement extends RPCElement {
  static observedAttributes = [
    'data-text',
    'data-choice-letter',
    'data-selected',
    'data-correct',
  ];

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));


  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;

    this.render();
  }

  get choiceLetter() {
    return this.dataset.choiceLetter ?? '';
  }

  get text() {
    return this.dataset.text ?? '';
  }

  render() {
    this.letterElement.textContent = this.choiceLetter;
    this.textElement.textContent = this.text;
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }
}

customElements.define('trivia-choice', ChoiceElement);
