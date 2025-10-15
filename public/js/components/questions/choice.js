import { BootstrapElement } from '../bootstrap.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<article class="card choice p-3" role="listitem">
  <h6 class="m-0 p-0">
    <strong class="choice-letter"></strong>: <span class="choice-text"></span>
  </h6>
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

    this.choiceElement = this.shadow.querySelector('article');
    this.letterElement = this.shadow.querySelector('.choice-letter');
    this.textElement = this.shadow.querySelector('.choice-text');
    this.choiceElement = this.shadow.querySelector('.choice');
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
