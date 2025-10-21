import { FormInput } from './form-input.js';

export class FormInputPhone extends FormInput {
  constructor() {
    super();
    this.setAttribute('help', 'Include your country code');
    this.setAttribute('type', 'tel');
    this.setAttribute('pattern', '^\\+?[1-9]\\d{1,14}$');
  }

  connectedCallback() {
    super.connectedCallback();
  }

  get icon() {
    return 'telephone';
  }
}

customElements.define(
  'trivia-form-input-phone',
  FormInputPhone,
);
