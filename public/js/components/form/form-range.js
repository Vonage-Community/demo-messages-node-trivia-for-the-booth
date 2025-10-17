import { FormInput } from './form-input.js';

const style = document.createElement('template');
style.innerHTML = `
<style>
  input[type="range"]:focus {
    outline: none !important;
    box-shadow: none !important;
  }
</style>
`;

export class FormInputRange extends FormInput {
  constructor() {
    super();

    // Force the input type to "range"
    this.setAttribute('type', 'range');

    // Add output element next to the slider
    this.outputElement = document.createElement('span');
    this.outputElement.className = 'ms-2 fw-semibold current-value';
    this.outputElement.textContent = this.inputElement.value ?? '';

    this.inputElement.classList.add('form-range');
    this.inputElement.classList.add('border-0');

    const inputGroup = this.querySelector('.input-group');
    inputGroup.append(this.outputElement);
    this.append(style.content.cloneNode(true));
  }

  connectedCallback() {
    super.connectedCallback();

    // Initialize range display
    this.boundedUpdateOutput = this.updateOutput.bind(this);
    this.inputElement.addEventListener('input', this.boundedUpdateOutput);
    this.updateOutput();
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('input', this.boundedUpdateOutput);
  }

  updateValidationFeedBack() {
    super.updateValidationFeedBack();

    this.inputElement.classList.remove('is-invalid');
    this.inputElement.classList.remove('is-valid');
  }

  updateOutput() {
    const value = this.inputElement.value;
    this.outputElement.textContent = value;
    this._value = value;
    this.internals.setFormValue(value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback?.(name, oldValue, newValue);

    if (['min', 'max', 'step', 'value'].includes(name)) {
      this.inputElement.setAttribute(name, newValue);
      this.updateOutput();
    }
  }
}

customElements.define('trivia-form-input-range', FormInputRange);
