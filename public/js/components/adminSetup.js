import { AdminSettingsElement } from './adminSettings.js';
import './adminVonage.js';
import './adminNumbers.js';
import './form/form-input.js';

const setupTemplate = document.createElement('template');
setupTemplate.innerHTML = `
<section class="mb-3 w-100 d-flex flex-column"
  role="region">

    <trivia-admin-setup-vonage></trivia-admin-setup-vonage>

    <trivia-admin-setup-numbers></trivia-admin-setup-numbers>

    <section class="border rounded m-3 p-3">
      <header class="d-flex justify-content-between w-100">
        <h3>API</h3>
        <div>
          <button type="button" class="btn btn-secondary api-set">Set</button>
        </div>
      </header>

    <dl class="row mt-1">
        <dt class="col-sm-3 pt-2">ChatGPT API Key</dt>
        <dd class="col-sm-9 ">
          <input type="password" class="form-control" name="openAPIKey"></input>
        </dd>
      </dl>
    </section>
</section >
  `;

export class AdminSetupElement extends AdminSettingsElement {
  constructor() {
    super();
    this.shadow.append(setupTemplate.content.cloneNode(true));

    this.setButtonElement = this.shadow.querySelector('.api-set');
    this.openAPIInputElement = this.shadow.querySelector('.form-control');

    this.boundedUpdateApiKeyValue = this.updateApiKeyValue.bind(this);
  }

  updateApiKeyValue(event) {
    event.preventDefault();
    const apiKey = this.openAPIInputElement.value;
    console.log(apiKey);
    this.makeRPCCall('settings.set', {
      openAPIKey: apiKey,
    });
  }

  onDataLoaded(data, method) {
    super.onDataLoaded(data, method);


    if (!this.openAPIKey) {
      this.openAPIInputElement.placeholder = 'Not Set';
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.setButtonElement.addEventListener('click', this.boundedUpdateApiKeyValue);
  }

  disconnectedCallback() {
    this.setButtonElement.removeEventListener('click', this.boundedUpdateApiKeyValue);
  }
}

customElements.define(
  'trivia-admin-setup',
  AdminSetupElement,
);
