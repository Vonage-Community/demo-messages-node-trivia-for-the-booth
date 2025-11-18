import { RPCElement } from './rpcElement.js';
import './form/form-input.js';
import { success } from '../toast.js';
import { submitRPCForm } from '../form.js';
import { registerEvent, removeEvent } from '../events.js';
import { AdmiSettingsElement } from './adminSettings.js';

const vonageSetupTemplate = document.createElement('template');
vonageSetupTemplate.innerHTML = `
<section class="border rounded m-3 p-3">
  <header>
    <h2 class="border-bottom pb-2">Vonage Settings</h2>
  </header>

  <section>
    <form action="#" class="needs-validation vonage-api-form" data-rpc-method="settings.set" novalidate>
      <header class="d-flex justify-content-between w-100">
        <h3>API</h3>
        <div>
          <button type="submit" class="btn btn-secondary api-set d-none">Set</button>
          <button type="button" class="btn btn-light api-edit">Edit</button>
        </div>
      </header>

      <trivia-form-input
        name="apiKey"
        label="API Key"
        disabled
        required>
      </trivia-form-input>

      <trivia-form-input
        name="apiSecret"
        label="API Secret"
        disabled
        required>
      </trivia-form-input>
    </form>
  </section>

  <section>
    <header class="d-flex justify-content-between w-100">
      <h3>Application</h3>
      <div>
        <button class="btn btn-light create-app" disabled>Create</button>
      </div>
    </header>

    <dl>
      <dt>Id:</dt>
      <dl class="app-id"></dl>

      <dt>Name:</dt>
      <dl class="app-name"></dl>
    </dl>
  </section>
</section>
`;

export class VonageSetupElement extends AdmiSettingsElement {
  constructor() {
    super();
    this.shadow.append(vonageSetupTemplate.content.cloneNode(true));

    this.apiKeyElement = this.shadow.querySelector('[name="apiKey"]');
    this.apiSecretElement = this.shadow.querySelector('[name="apiSecret"]');
    this.applicationIdElement = this.shadow.querySelector('.app-id');
    this.applicationNameElement = this.shadow.querySelector('.app-name');
    this.apiFormElement = this.shadow.querySelector('.vonage-api-form');
    this.apiEditButtonElement = this.shadow.querySelector('.api-edit');
    this.apiSubmitButtonElement = this.shadow.querySelector('.api-set');
    this.createApplicationButtonElement = this.shadow.querySelector('.create-app');

    this.boundUpdateAPISettings = this.updateAPISettings.bind(this);
    this.boundedAfterSubmit = this.afterSubmit.bind(this);
    this.boundedShowApiForm = this.showAPIForm.bind(this);
    this.boundedCreateApplication = this.createApplication.bind(this);
  }

  createApplication() {
    this.makeRPCCall('settings.create_app');
  }

  showAPIForm() {
    this.apiKeyElement.inputElement.disabled = false;
    this.apiSecretElement.inputElement.disabled = false;
    this.apiSubmitButtonElement.classList.toggle('d-none');
    this.apiEditButtonElement.classList.toggle('d-none');
  }

  hideApiForm() {
    this.apiKeyElement.inputElement.disabled = true;
    this.apiSecretElement.inputElement.disabled = true;
    this.apiKeyElement.inputElement.classList.remove('is-valid');
    this.apiSecretElement.inputElement.classList.remove('is-valid');
    this.apiSubmitButtonElement.classList.toggle('d-none');
    this.apiEditButtonElement.classList.toggle('d-none');
  }

  updateAPISettings() {
    const formData = new FormData(this.apiFormElement);

    const data = {};
    for (const [name, value] of formData.entries()) {
      data[name] = value;
    };

    submitRPCForm(this.apiFormElement)(null, data);
  }

  updateAPIKey() {
    if (!this.apiKey) {
      this.apiKeyElement.inputElement.placeholder = 'Not set';
      return;
    }

    this.apiKeyElement.value = this.apiKey;
  }

  updateAPISecret() {
    if (!this.apiSecret) {
      this.apiSecretElement.inputElement.placeholder = 'Not set';
      return;
    }

    this.apiSecretElement.value = this.apiSecret;
  }

  updateApplicationId() {
    this.applicationIdElement.textContent = this.applicationId
      ? this.applicationId
      : '';
  }

  updateApplicationName() {
    this.applicationNameElement.textContent = this.applicationName
      ? this.applicationName
      : '';
  }

  afterSubmit(args) {
    this.onDataLoaded(args.detail.data);
    this.hideApiForm();
    success('API key and secret saved');
  }

  update() {
    this.updateAPIKey();
    this.updateAPISecret();
    this.updateApplicationId();
    this.updateApplicationName();

    if (this.apiKey) {
      this.createApplicationButtonElement.disabled = false;
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.apiFormElement.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.updateAPISettings();
    });

    this.apiEditButtonElement.addEventListener('click', this.boundedShowApiForm);
    this.createApplicationButtonElement.addEventListener('click', this.boundedCreateApplication);

    registerEvent('form:submitted', this.boundedAfterSubmit);
  }

  onDataLoaded(data, method) {
    super.onDataLoaded(data, method);
    this.update();
  }

  disconnectedCallback() {
    removeEvent('form:submitted', this.boundedAfterSubmit);
    this.apiEditButtonElement.removeEventListener('click', this.boundedShowApiForm);
    this.createApplicationButtonElement.removeEventListener('click', this.boundedCreateApplication);
  }
}

customElements.define(
  'trivia-admin-setup-vonage',
  VonageSetupElement,
);
