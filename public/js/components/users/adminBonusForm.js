import Modal from 'bootstrap/js/dist/modal';
import { submitRPCForm } from '../../form.js';
import { registerEvent, removeEvent } from '../../events.js';
import '../form/form-input.js';
import { RPCElement } from '../rpcElement.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<div class="modal fade bonus-form-modal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Add Bonus</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <form action="#" class="needs-validation bonus-form" data-rpc-method="players.add_bonus" novalidate>
        <div class="modal-body">
          <trivia-form-input
            name="scoreType"
            label="Type"
            required>
          </trivia-form-input>

          <trivia-form-input
            name="scorePoints"
            label="Points"
            type="number"
            required>
          </trivia-form-input>

          <input type="hidden" name="playerId">
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  </div>
</div>
`;

export class BonusFormElement extends RPCElement {
  static observedAttributes = [
    'data-bonus-title',
    'data-bonus-id',
  ];

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));
    this.modal = this.shadow.querySelector('.bonus-form-modal');
    this.modalBody = this.shadow.querySelector('.modal-body');
    this.formElement = this.shadow.querySelector('.bonus-form');

    this.bonusTitleInputElement = this.shadow.querySelector('trivia-form-input[name="title"]');
    this.hiddenPlayerIdInput = this.shadow.querySelector('input[name="playerId"]');
  }

  get playerId() {
    return Number(this.dataset.playerId) || null;
  }

  set playerId(value) {
    this.dataset.playerId = value;
  }

  get scoreId() {
    return this.dataset.scoreId;
  }

  set scoreId(value) {
    this.dataset.scoreId = value;
  }

  get scoreType() {
    return this.dataset.scoreType;
  }

  set scoreType(value) {
    this.dataset.scoreType = value;
  }

  get scorePoints() {
    return this.dataset.scorePoints;
  }

  set scorePoints(value) {
    this.dataset.scorePoints = value;
  }

  toggleModal() {
    this.hiddenPlayerIdInput.value = this.playerId;
    this.connectedModal.toggle();
  }

  submitForm() {
    const formData = new FormData(this.formElement);

    const data = {};
    for (const [name, value] of formData.entries()) {
      data[name] = value;
    };

    submitRPCForm(this.formElement)(null, data);
  }

  afterSubmit(results) {
    this.scoreId = results.detail.data.id;
    this.scoreType = results.detail.data.scoreType;
    this.scorePoints = results.detail.data.scorePoints;
    this.connectedModal.hide();
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.connectedModal = new Modal(this.modal, { backdrop: 'static' });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.submitForm();
    });

    this.boundedAfterSubmit = this.afterSubmit.bind(this);
    console.log(this.playerId);

    registerEvent('form:submitted', this.boundedAfterSubmit);
  }

  disconnectedCallback() {
    removeEvent('form:submitted', this.boundedAfterSubmit);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {

      case 'data-player-id':
        this.playerId = newValue;
        this.hiddenPlayerIdInput.value = newValue ?? '';
        break;
    }
  }
}

customElements.define(
  'trivia-bonus-form',
  BonusFormElement,
);
