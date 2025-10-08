import { FormInput } from './form-input.js';

export class FormInputEmail extends FormInput {
  constructor() {
    super();
    this.setAttribute('type', 'email');
  }

  get icon() {
    return 'envelope';
  }
}

customElements.define(
  'trivia-form-input-email',
  FormInputEmail,
);
