import { BootstrapElement } from './bootstrap';

const spinnerTemplate = document.createElement('template');
spinnerTemplate.innerHTML = `
<div class="d-flex justify-content-center spinner">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`;

export class SpinnerElement extends BootstrapElement {
  constructor() {
    super();
    this.shadow.append(spinnerTemplate.content.cloneNode(true));
    this.container = this.shadow.querySelector('.spinner');
    this.hiddenLabel = this.shadow.querySelector('.visually-hidden');
  }
}

customElements.define('trivia-spinner', SpinnerElement);
