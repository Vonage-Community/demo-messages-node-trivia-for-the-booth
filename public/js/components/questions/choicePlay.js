import { ChoiceElement } from './choice.js';
const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = `
<style>
:host {
  --bs-secondary-rgb: 170, 175, 181; /* #AAAFB5 */
  --bs-heading-color: #000;
}

.text-secondary {
  color: rgba(var(--bs-secondary-rgb), var(--bs-text-opacity, 1));
}

.hidden-inert {
  visibility: hidden;
}
.choice {
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
  background: #7F3FE4;
}

.choice:hover {
  filter: brightness(1.15);
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(255,255,255,0.15);
}
.choice.wrong {
  background: #C62842;
  color: #fff;
  border: none;
  box-shadow: 0 0 15px rgba(198, 40, 66, 0.4);
}

.choice.correct {
  background: #1DBF73; /* Vonage success green */
  color: #fff;
  border: none;
  box-shadow: 0 0 15px rgba(29,191,115,0.4);
}
</style>
<p class="text-white text-center hidden-inert"> Are you sure? Tap again to confirm</p>
`;

export class ChoicePlayElement extends ChoiceElement {
  constructor() {
    super();

    this.shadow.append(styleTemplate.content.cloneNode(true));

  }
  connectedCallback() {
    super.connectedCallback();
    this.choiceElement.classList.remove('card');
    this.letterElement.remove();
    this.textElement.remove();
    this.choiceElement.classList.add('p-3', 'rounded-3', 'shadow-lg', 'text-center', 'text-white');
    this.choiceContainerElement.textContent = this.text;
    this.confirmElement = this.shadow.querySelector('p');
  }

}

customElements.define(
  'trivia-choice-play',
  ChoicePlayElement,
);
