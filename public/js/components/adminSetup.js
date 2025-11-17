import { RPCElement } from './rpcElement.js';
import './adminVonage.js';
import { countries } from '../../countries.js';

const setupTemplate = document.createElement('template');
setupTemplate.innerHTML = `

<section class="mb-3 w-100 d-flex flex-column"
  role="region">

    <trivia-admin-setup-vonage></trivia-admin-setup-vonage>

    <section class="border rounded m-3 p-3">
      <h2 class="border-bottom pb-2">Phone Numbers</h2>

      <table class="table">
        <thead>
          <th>Number</th>
          <th>Manage</th>
        </thead>

        <tbody>
          <td>
            (+1) 6318675309
            <p class="text-body">
              <span> ${countries['US'].flag} ${countries['US'].name}</span >
            </p>
          </td>

          <td>
            <button class="btn btn-primary">Link</button>
          </td>
        </tbody>
      </table>

    </section>

    <section class="border rounded m-3 p-3">
      <h2 class="border-bottom p-2">Settings</h2>

      <dl class="row">
        <dt class="col-sm-3">ChatGPT API Key</dt>
        <dd class="col-sm-9">Not Set</dd>

        <dt class="col-sm-3">Bitly API Key</dt>
        <dd class="col-sm-9">Not Set</dd>
      </dl>

    </section>
</section >
  `;

export class AdminSetupElement extends RPCElement {
  constructor() {
    super();
    this.shadow.append(setupTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
  }
}

customElements.define(
  'trivia-admin-setup',
  AdminSetupElement,
);
