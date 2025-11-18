import { AdminSettingsElement } from './adminSettings.js';
import { countries } from '../../countries.js';

const setupNumberTemplate = document.createElement('template');
setupNumberTemplate.innerHTML = `
<section class="border rounded m-3 p-3">
  <header>
    <h2 class="border-bottom pb-2">Phone Numbers</h2>
  </header>

  <table class="table">
    <thead>
      <tr>
        <th>Number</th>
        <th>Status</th>
        <th>Manage</th>
      </tr>
    </thead>

    <tbody>

    </tbody>
  </table>
</section>
`;

export class AdminSetupNumbersElement extends AdminSettingsElement {
  constructor() {
    super();
    this.shadow.append(setupNumberTemplate.content.cloneNode(true));
    this.tableBodyElement = this.shadow.querySelector('tbody');

    this.boundedLinkNumber = this.linkNumber.bind(this);
    this.numbers = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.numbers = [];
  }

  linkNumber(event) {
    event.preventDefault();
    const msisdn = event.target.dataset.msisdn;
    console.log('Linking number', msisdn);
    this.makeRPCCall('settings.link_number', msisdn);
  }

  listNumbers() {
    this.tableBodyElement.innerHTML = '';
    if (this.numbers.length < 1) {
      const noNumbersRow = document.createElement('tr');
      noNumbersRow.innerHTML = '<td colspan="3">This account does not have any numbers</td>';
      this.tableBodyElement.append(noNumbersRow);
      return;
    }


    if (!this.applicationId) {
      const noNumbersRow = document.createElement('tr');
      noNumbersRow.innerHTML = '<td colspan="3">You need to create an application first</td > ';
      this.tableBodyElement.append(noNumbersRow);
      return;
    }


    this.numbers.forEach(({ app_id: appId, country, msisdn }) => {
      const numberRow = document.createElement('tr');

      const numberCell = document.createElement('td');

      numberCell.innerHTML = `
      <td>
        ${msisdn}
        <p class="text-body">
          <span> ${countries[country].flag} ${countries[country].name}</span >
        </p>
      </td>
      `;

      const statusCell = document.createElement('td');
      statusCell.textContent = 'Not linked';

      const linkButton = document.createElement('button');
      linkButton.classList.add('btn', 'btn-primary');
      linkButton.textContent = 'Link';
      linkButton.dataset.msisdn = msisdn;
      linkButton.addEventListener('click', this.boundedLinkNumber);

      if (appId) {
        statusCell.textContent = `Linked to ${appId}`;
      }

      if (appId === this.applicationId) {
        linkButton.textContent = 'Unlink';
        status.textContent = 'Linked to this application';
        linkButton.removeEventListener('click', this.boundedLinkNumber);
      }

      const manageCell = document.createElement('td');
      manageCell.append(linkButton);

      numberRow.append(numberCell);
      numberRow.append(statusCell);
      numberRow.append(manageCell);
      this.tableBodyElement.append(numberRow);
    });
  }

  loadNumbers() {
    if (this.apiKey && this.apiSecret) {
      this.makeRPCCall('settings.owned_numbers');
    }
  }

  onDataLoaded(data, method) {
    super.onDataLoaded(data, method);
    if (method === 'settings.get') {
      this.loadNumbers();
      return;
    }

    console.log('Owned numbers', data);
    this.numbers = data.numbers || [];
    this.listNumbers();
  }
}

customElements.define(
  'trivia-admin-setup-numbers',
  AdminSetupNumbersElement,
);
