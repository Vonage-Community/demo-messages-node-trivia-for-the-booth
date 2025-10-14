import { BootstrapElement } from '../bootstrap.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<article class="card choice" role="listitem">
  <span class="visually-hidden">Choice</span>

<p class="card-text ps-3">
  <strong class="choice-letter"></strong>: <span class="choice-text"></span>
</p>

</article>
`;

export class ChoiceElement extends BootstrapElement {
  static observedAttributes = [
    'data-title',
    'data-choice-letter',
    'data-selected',
    'data-correct',
  ];

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));

    this.card = this.shadow.querySelector('.card');
    this.button = this.shadow.querySelector('button');
    this.letterElement = this.shadow.querySelector('.choice-letter');
    this.textElement = this.shadow.querySelector('.choice-text');
    this.resultFooter = this.shadow.querySelector('.card-footer');
    this.resultText = this.shadow.querySelector('.result-text');
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;

    this.render();
  }

  get choiceLetter() {
    return this.getAttribute('data-choice-letter') ?? '';
  }

  get title() {
    return this.getAttribute('data-title') ?? '';
  }

  render() {
    this.letterElement.textContent = this.choiceLetter;
    this.textElement.textContent = this.title;
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }
}

customElements.define('trivia-choice', ChoiceElement);
