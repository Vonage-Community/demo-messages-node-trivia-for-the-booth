import { FormInput } from './form-input.js';

export class FormInputPassword extends FormInput {
  constructor() {
    super();
    this.setAttribute('type', 'password');
  }

  get icon() {
    return 'key';
  }
}

customElements.define(
  'trivia-form-input-password',
  FormInputPassword,
);
