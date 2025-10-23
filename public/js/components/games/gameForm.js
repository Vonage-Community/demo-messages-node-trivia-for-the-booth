import Modal from 'bootstrap/js/dist/modal';
import { submitRPCForm } from '../../form.js';
import { registerEvent, removeEvent } from '../../events.js';
import '../form/form-input.js';
import { RPCElement } from '../rpcElement.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<div class="modal fade game-form-modal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Create Game</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <form action="#" class="needs-validation game-form" data-rpc-method="games.create" novalidate>
        <div class="modal-body">
          <trivia-form-input
            name="title"
            label="Title"
            required>
          </trivia-form-input>

          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="bonusGame">
            <label class="form-check-label" for="bonusGame">Bonus game?</label>
          </div>

          <input type="hidden" name="gameId">
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

export class GameFormElement extends RPCElement {
  static observedAttributes = [
    'data-game-title',
    'data-game-id',
  ];

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));
    this.modal = this.shadow.querySelector('.game-form-modal');
    this.modalBody = this.shadow.querySelector('.modal-body');
    this.formElement = this.shadow.querySelector('.game-form');

    this.gameTitleInputElement = this.shadow.querySelector('trivia-form-input[name="title"]');
    this.hiddenGameIdInput = this.shadow.querySelector('input[name="gameId"]');
  }

  get gameTitle() {
    return this.dataset.game ?? '';
  }

  set gameTitle(newGameText) {
    this.dataset.game = newGameText;
  }

  get gameId() {
    return Number(this.dataset.gameId) || null;
  }

  set gameId(newGameId) {
    this.dataset.gameId = newGameId;
  }

  toggleModal() {
    this.connectedModal.toggle();
  }

  submitForm() {
    const formData = new FormData(this.formElement);

    const data = {};
    for (const [name, value] of formData.entries()) {
      data[name] = value;
    };

    data.bonusGame = data.bonusGame === 'on';

    submitRPCForm(this.formElement)(null, data);
  }

  afterSubmit() {
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

    registerEvent('form:submitted', this.boundedAfterSubmit);
  }

  disconnectedCallback() {
    removeEvent('form:submitted', this.boundedAfterSubmit);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'data-title':
        this.gameTitleInputElement.setAttribute('value', newValue ?? '');
        break;

      case 'data-game-id':
        this.formElement.dataset.rpcMethod = 'games.update';
        this.hiddenGameIdInput.value = newValue ?? '';
        break;
    }
  }

}

customElements.define('trivia-game-form', GameFormElement);
