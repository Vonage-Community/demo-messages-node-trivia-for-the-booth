import { FormInput } from './form-input.js';

const multiTemplate = document.createElement('template');
multiTemplate.innerHTML = `
<div class="mb-3 input">
  <label class="form-label"></label>
  <div class="input-group">
    <input class="form-control" type="text" />
    <button class="btn btn-outline-secondary add-button" type="button" aria-label="Add value">
      <i class="bi bi-plus-lg"></i>
    </button>
  </div>
  <div class="values mt-2 d-flex flex-wrap gap-2"></div>
  <div class="invalid-feedback"></div>
  <div class="form-text help-text d-none"></div>
</div>
`;

export class FormInputMulti extends FormInput {
  static formAssociated = true;

  constructor() {
    super();
    this.values = [];

    const inputGroup = this.querySelector('.input-group');

    this.valuesContainer = document.createElement('div');
    this.valuesContainer.className = 'values mt-2 d-flex flex-wrap gap-2';
    inputGroup.insertAdjacentElement('afterend', this.valuesContainer);
  }

  get value() {
    return this.values.join(',');
  }

  set value(value) {
    this.values = Array.isArray(value)
      ? value
      : (value ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    this.renderValues();
    this.internals.setFormValue(this.values.join(','));
  }

  updateValidationFeedBack() {
    super.updateValidationFeedBack();
    this.inputElement.classList.remove('is-invalid');
    this.inputElement.classList.remove('is-valid');


  }

  addValue() {
    const newValue = this.inputElement.value.trim();
    if (!newValue) {
      return;
    }

    if (!this.values.includes(newValue)) {
      this.values.push(newValue);
      this.renderValues();
      this.internals.setFormValue(this.values.join(','));
    }

    this.inputElement.value = '';
    this.inputElement.focus();
  }

  connectedCallback() {
    super.connectedCallback();
    this.boundedAddValue = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.addValue();
      }
    };

    this.inputElement.addEventListener('keypress', this.boundedAddValue);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('keypress', this.boundedAddValue);
  }

  removeValue(value) {
    this.values = this.values.filter((filterValue) => filterValue !== value);
    this.renderValues();
    this.internals.setFormValue(this.values.join(','));
  }

  renderValues() {
    this.valuesContainer.innerHTML = '';

    this.values.forEach((value) => {
      const pill = document.createElement('span');
      pill.className = 'badge bg-primary d-flex align-items-center gap-1';
      pill.textContent = value;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-close btn-close-white btn-sm ms-1';
      removeBtn.setAttribute('aria-label', `Remove ${value}`);
      removeBtn.addEventListener('click', () => this.removeValue(value));

      pill.append(removeBtn);
      this.valuesContainer.append(pill);
    });
  }
}

customElements.define('trivia-form-input-multi', FormInputMulti);
