const inputTemplate = document.createElement('template'); inputTemplate.innerHTML = `
<div class="mb-3 input">
  <label class="form-label"></label>
  <div class="input-group">
    <span class="input-group-text flex-nowrap prefix"></span>
    <input class="form-control"></input>
  </div>
  <div class="invalid-feedback"></div>
  <div class="form-text help-text d-none"></div>
</div>
`;

export class FormInput extends HTMLElement {
  static observedAttributes = [
    'prefix',
    'disabled',
    'help',
    'placeholder',
    'required',
    'value',
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

  get value() {
    return this._value;
  }

  set value(value) {
    this.internals.setFormValue(value);
    this.inputElement.value = value;
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
    this.render();

    this.addEventListener('input', this.resetValidity);

    this.addEventListener('blur', this.resetValidity);

    this.addEventListener('change', (event) => {
      this.value = event.target.value;
    });
  }

  render() {
    this.renderLabel();
    this.renderInput();
    this.renderHelp();
    this.renderPrefix();
    this.renderInvalidFeedback();
  }

  renderInvalidFeedback() {
    this.invalidFeedbackElement.setAttribute('id', `${this.baseId}Invalid`);
  }

  renderPrefix() {
    this.updatePrefix();
  }

  renderLabel() {
    this.labelElement.textContent = this.getAttribute('label') || '';
    this.labelElement.setAttribute('for', this.baseId);
  }

  renderInput() {
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

  renderHelp() {
    this.helpElement.setAttribute('id', `${this.baseId}Help`);
    this.updateHelp();
  }

  updateHelp() {
    if (!this.help) {
      this.helpElement.classList.add('d-none');
      return;
    }
    this.helpElement.classList.remove('d-none');
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

  checkValidity() {
    this.inputElement.checkValidity();
    this.updateValidationFeedBack();
  }

  setCustomValidity(message) {
    this.inputElement.setCustomValidity(message);
    this.internals.setValidity(
      { customError: true },
      message,
      this.inputElement,
    );

    this.updateValidationFeedBack();
  }

  reportValidity() {
    const valid = this.inputElement.checkValidity();

    this.updateValidationFeedBack();
    return valid;
  }

  resetValidity() {
    this.inputElement.setCustomValidity('');
    this.internals.setValidity({});
    this.checkValidity();
  }

  updateValidationFeedBack() {
    const message = this.inputElement.validationMessage || this.internals.validationMessage;
    const valid = !message;

    if (valid) {
      this.inputElement.setAttribute('aria-describedby', `${this.baseId}Help`);
      this.invalidFeedbackElement.textContent = '';
      this.invalidFeedbackElement.classList.toggle('d-none', !valid);
      this.invalidFeedbackElement.classList.toggle('d-block', valid);
      this.inputElement.classList.toggle('is-invalid', !valid);
      this.inputElement.classList.toggle('is-valid', valid);
      return;
    }

    this.inputElement.setAttribute('aria-describedby', `${this.baseId}Help ${this.baseId}Invalid`);
    this.invalidFeedbackElement.textContent = message;
    this.invalidFeedbackElement.classList.toggle('d-none', valid);
    this.invalidFeedbackElement.classList.toggle('d-block', !valid);
    this.inputElement.classList.toggle('is-invalid', !valid);
    this.inputElement.classList.toggle('is-valid', valid);
  }

  attributeChangedCallback(name, oldValue, newValue) {
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

      case 'value':
        this.value = newValue;
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
