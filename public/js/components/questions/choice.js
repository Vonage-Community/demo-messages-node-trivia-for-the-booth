import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

const sheet = new CSSStyleSheet();
sheet.replaceSync(bootstrap);

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<div class="card choice">
  <div class="card-body choice">
    <p><strong></strong>: <span></span></p>
    <div class="progress" role="progressbar">
      <div class="progress-bar"></div>
    </div>
  </div>
</div>
`;

export class ChoiceElement extends HTMLElement {
  static observedAttributes = [
    'data-title',
    'data-answer-count',
    'data-choice-letter',
  ];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];
    this.shadow.append(choiceTemplate.content.cloneNode(true));

    this.choiceElement = this.shadow.querySelector('div.choice');
    this.titleElement = this.shadow.querySelector('p');
    this.letterElement = this.choiceElement.querySelector('strong');
    this.choiceDescriptionElement = this.choiceElement.querySelector('span');
    this.progressElement = this.choiceElement.querySelector('div.progress');
    this.progressBarElement = this.choiceElement.querySelector('div.progress-bar');
  }

  get title() {
    return this.getAttribute('data-title');
  }

  get answerCount() {
    return this.getAttribute('data-answer-count');
  }

  get choiceLetter() {
    return this.getAttribute('data-choice-letter');
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }
    this.hasConnected = true;
    this.render();
  }

  render() {
    this.titleElement.id = `label-${this.choiceLetter}`;
    this.classList.add(`choice-${this.choiceLetter}`);
    this.renderLetterElement();
    this.renderDescriptionElement();
    this.renderProgressElement();
  }

  renderLetterElement() {
    this.letterElement.innerText = this.choiceLetter;
  }

  renderDescriptionElement() {
    this.choiceDescriptionElement.innerText = this.title || '';
  }

  renderProgressElement() {
    if (this.answerCount === null) {
      this.progressElement.remove();
      return;
    }

    this.progressBarElement.id = `progress-${this.choiceLetter}`;

    this.progressElement.setAttribute('aria-labelledby', this.titleElement.id);
    this.progressElement.setAttribute('aria-valuenow', this.answerCount);
    this.progressElement.setAttribute('aria-valuemin', '0');
    this.progressElement.setAttribute('aria-valuemax', '100');

    this.progressBarElement.style.width = `${this.answerCount}%`;
    this.progressBarElement.innerText = `${this.answerCount}%`;
  }

  attributeChangedCallback() {
    this.render();
  }
}

customElements.define(
  'trivia-choice',
  ChoiceElement,
);
