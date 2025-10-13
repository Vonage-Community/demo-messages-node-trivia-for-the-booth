import './form-input.js';
import './form-password.js';
import './form-email.js';
import './form-phone.js';
import { RPCElement } from '../rpcElement.js';

const registrationFormTemplate = document.createElement('template');
registrationFormTemplate.innerHTML = `

<form action="#" class="needs-validation" novalidate>
  <trivia-form-input
    name="name"
    icon="person"
    help="The name you want to display in leader boards"
    label="Display Name"
    required>
  </trivia-form-input>

  <trivia-form-input-email
    name="email"
    required
    label="Email">
  </trivia-form-input-email>

  <trivia-form-input-password
    name="password"
    required
    label="Password">
  </trivia-form-input-password>

  <trivia-form-input-phone
    name="phone"
    required
    label="Phone Number">
  </trivia-form-input-phone>

  <button type="submit" class="btn btn-primary mb-3">Register</button>
</form>
`;

export class RegistrationForm extends RPCElement {
  constructor() {
    super();
    this.shadow.append(registrationFormTemplate.content.cloneNode(true));
  }
}

customElements.define(
  'trivia-form-registration',
  RegistrationForm,
);
