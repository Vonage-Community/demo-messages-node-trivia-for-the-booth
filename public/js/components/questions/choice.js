import { RPCElement } from '../rpcElement.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<article class="card p-3 choice" role="listitem">
  <h6 class="m-0 p-0 choice-container">
    <strong class="choice-letter float-start"></strong>: <span class="choice-text"></span>
  </h6>
</article>
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

    this.choiceElement = this.shadow.querySelector('.choice');
    this.letterElement = this.shadow.querySelector('.choice-letter');
    this.textElement = this.shadow.querySelector('.choice-text');
    this.choiceContainerElement = this.shadow.querySelector('.choice-container');
  }

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
