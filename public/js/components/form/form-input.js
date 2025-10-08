const inputTemplate = document.createElement('template');
inputTemplate.innerHTML = `
<style>@import 'css/app.scss'</style>
<div class="mb-3 input">
  <label class="form-label">
    <slot></slot>
    <div class="input-group">
      <span class="input-group-text flex-nowrap prefix"></span>
      <input class="form-control"></input>
    </div>
  </label>
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

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.append(inputTemplate.content.cloneNode(true));
    this.divElement = this.shadow.querySelector('div.input');
    this.inputElement = this.shadow.querySelector('input');
    this.labelElement = this.shadow.querySelector('label');
    this.helpElement = this.shadow.querySelector('div.form-text');
    this.prefixElement = this.shadow.querySelector('span.prefix');
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.internals.setFormValue(value);
  }

  get form() {
    return this.internals.form;
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

  get validity() {
    return this.internals.validity;
  }

  get validationMessage() {
    return this.internals.validationMessage;
  }

  get willValidate() {
    return this.internals.willValidate;
  }

  connectedCallback() {
    this.baseId = this.getAttribute('id') || `${this.name}Input`;
    this.build();
  }

  build() {
    this.buildLabel();
    this.buildInput();
    this.buildHelp();
    this.buildPrefix();
  }

  buildPrefix() {
    this.updatePrefix();
  }

  buildLabel() {
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
        this.inputElement[attr] = attrValue;
        return;
      }

      if (this.hasAttribute('required')) {
        this.inputElement.setAttribute('required', '');
        return;
      }

      this.inputElement.removeAttribute('required');
    });

    this.inputElement.name = this.name;

    this.inputElement.addEventListener('change', (event) => {
      const clone = new event.constructor(event.type, event);

      this.dispatchEvent(clone);

      this.value = this.inputElement.value;
    });

    this.validateInput();
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

  updateValidity() {
    if (!this.inputElement) {
      return;
    };

    this.inputElement.classList.remove('is-valid', 'is-invalid');
    this.inputElement.classList.add(this.inputElement.checkValidity() ? 'is-valid' : 'is-invalid');
  }

  resetValidation() {
    this.inputElement.classList.remove('is-valid', 'is-invalid');
  }


  checkValidity() {
    return this.internals.checkValidity();
  }

  reportValidity() {
    return this.internals.reportValidity();
  }

  validateInput() {
    const validState = this.inputElement.validity;
    if (validState.valid) {
      this.internals.setValidity({}, '', this.inputElement);
      return;
    }

    for (let state in validState) {
      const attr = `data-${state.toString()}`;

      if (validState[state]) {
        this.validationError = state.toString();

        const errorMessage = this.hasAttribute(attr) ?
          this.getAttribute(attr) : this.inputElement.validationMessage;

        this.internals.setValidity(
          { [this.validationError]: true },
          errorMessage,
          this.inputElement,
        );
      }
    }
  }

  attributeChangedCallback(name) {
    switch (name) {
      case 'disabled':
        this.updateDisabled();
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

  render() {
    this.innerHTML = this.divElement;
  }
}

customElements.define(
  'trivia-form-input',
  FormInput,
);
