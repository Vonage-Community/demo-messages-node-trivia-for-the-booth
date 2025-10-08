
export class RegistrationForm extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
<form>
  <div class="mb-3">
    <label for="name" class="form-label">Name address</label>
    <input type="text" class="form-control" id="name">
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email">
  </div>

  <div class="mb-3">
    <label for="phone" class="form-label">Phone</label>
    <input type="phone" class="form-control" id="phone">
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>

</form>`;
  }


}

customElements.define('trivia-registration-form', RegistrationForm);
