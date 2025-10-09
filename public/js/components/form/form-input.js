const inputTemplate = document.createElement('template');
inputTemplate.innerHTML = `
<div class="mb-3 input">
  <label class="form-label"></label>
  <div class="input-group">
    <span class="input-group-text flex-nowrap prefix"></span>
    <input class="form-control"></input>
  </div>
  <div class="invalid-feedback"></div>
  <div class="form-text help-text"></div>
</div>
`;
export class FormInput extends HTMLElement {
  static observedAttributes = [
    'prefix',
    'disabled',
    'help',
    'placeholder',
    'required',
    'icon',
  ];

  static formAssociated = true;

  constructor() {
    super();

    this.internals = this.attachInternals();
    this.append(inputTemplate.content.cloneNode(true));

    this.divElement = this.querySelector('div.input');
    this.inputElement = this.querySelector('input');
    this.labelElement = this.querySelector('label');
    this.helpElement = this.querySelector('div.form-text');
    this.prefixElement = this.querySelector('span.prefix');
    this.invalidFeedbackElement = this.querySelector('div.invalid-feedback');
  }

  reportValidity() {
    const valid = this.inputElement.reportValidity();
    this.updateValidity();
    return valid;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.internals.setFormValue(value);
    this._value = value;
  }

  get name() {
    return this.getAttribute('name');
  }

  get type() {
    return this.getAttribute('type');
  }

  get prefix() {
    return this.getAttribute('prefix');
  }

  get icon() {
    return this.getAttribute('icon');
  }

  get help() {
    return this.getAttribute('help');
  }

  get willValidate() {
    return this.inputElement.willValidate;
  }

  get validity() {
    return this.inputElement.validity;
  }

  get validationMessage() {
    return this.inputElement.validationMessage;
  }

  connectedCallback() {
    this.baseId = this.getAttribute('id') || `${this.name}Input`;
    const initial = this.getAttribute('value') ?? '';
    this.value = initial;
    this.internals.setValidity(
      this.inputElement.checkValidity() ? {} : this.inputElement.validity,
      this.inputElement.validationMessage,
      this.inputElement,
    );
    this.build();
  }

  build() {
    this.buildLabel();
    this.buildInput();
    this.buildHelp();
    this.buildPrefix();
    this.buildInvalidFeedback();
  }

  buildInvalidFeedback() {
    this.invalidFeedbackElement.setAttribute('id', `${this.baseId}Invalid`);
  }

  buildPrefix() {
    this.updatePrefix();
  }

  buildLabel() {
    this.labelElement.textContent = this.getAttribute('label') || '';
    this.labelElement.setAttribute('for', this.baseId);
  }

  buildInput() {
    [
      'type',
      'value',
      'placeholder',
      'required',
      'min',
      'max',
      'minLength',
      'maxLength',
      'pattern',
    ].forEach((attr) => {
      const attrValue = this.getAttribute(attr);

      if (attr !== 'required' && attrValue !== null) {
        this.inputElement.setAttribute(attr, attrValue);
        return;
      }

      if (this.hasAttribute('required')) {
        this.inputElement.setAttribute('required', '');
        return;
      }

      this.inputElement.removeAttribute('required');
    });

    this.inputElement.name = this.name;
    this.inputElement.setAttribute('id', this.baseId);
    this.inputElement.setAttribute('aria-describedby', `${this.baseId}Help`);
    this.inputElement.addEventListener('input', () => this.updateValidationFeedBack());
    this.inputElement.addEventListener('blur', () => this.updateValidationFeedBack());
    this.inputElement.addEventListener(
      'invalid',
      (event) => {
        event.preventDefault();
        this.updateValidationFeedBack();
      },
    );
  }

  focus() {
    this.inputElement.focus();
  }

  buildHelp() {
    this.helpElement.setAttribute('id', `${this.baseId}Help`);
    this.updateHelp();
  }

  updateHelp() {
    this.helpElement.innerHTML = this.help;
  }

  updatePrefix() {
    if (this.icon) {
      this.prefixElement.innerHTML = `<i class="bi bi-${this.icon}"/>`;
      return;
    }

    if (this.prefix) {
      this.prefixElement.innerHTML = this.prefix;
      return;
    }

    this.prefixElement.remove();
  }

  setValidity(flags, message) {
    this.internals.setValidity(
      flags,
      message,
      this.inputElement,
    );

    if (message) {
      this.inputElement.setCustomValidity(message);
    }

    if (flags) {
      this.internals.states.add('invalid');
    }

    this.updateValidationFeedBack();
  }

  updateValidity(flags, message) {
    const valid = this.internals.checkValidity();

    this.internals.setValidity(
      valid ? {} : flags ?? this.inputElement.validity,
      message ?? this.inputElement.validationMessage,
      this.inputElement,
    );

    this.inputElement.classList.toggle('is-invalid', !valid);
    this.inputElement.classList.toggle('is-valid', valid);
    this.updateValidationFeedBack();
  }

  updateValidationFeedBack() {
    const message = this.internals.validationMessage ||
      this.inputElement.validationMessage;
    const valid = !message;

    if (valid) {
      this.inputElement.setAttribute('aria-describedby', `${this.baseId}Help`);
      this.invalidFeedbackElement.classList.toggle('d-none', !valid);
      this.invalidFeedbackElement.classList.toggle('d-block', valid);
      this.invalidFeedbackElement.textContent = '';
      return;
    }

    this.inputElement.setAttribute('aria-describedby', `${this.baseId}Help ${this.baseId}Invalid`);
    this.invalidFeedbackElement.textContent = message;
    this.invalidFeedbackElement.classList.toggle('d-none', valid);
    this.invalidFeedbackElement.classList.toggle('d-block', !valid);
  }

  resetValidation() {
    this.inputElement.classList.remove('is-valid', 'is-invalid');
  }

  attributeChangedCallback(name) {
    switch (name) {
      case 'disabled':
        this.updateDisabled(this.getAttribute('disabled'));
        break;
      case 'help':
        this.updateHelp();
        break;
      case 'prefix':
        this.updatePrefix();
        break;
    }
  }

  updateDisabled(value) {
    this.inputElement.disabled = value !== null && value !== 'false';
  }
}

customElements.define(
  'trivia-form-input',
  FormInput,
);
