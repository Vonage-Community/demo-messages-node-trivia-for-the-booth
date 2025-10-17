import Modal from 'bootstrap/js/dist/modal';
import { submitRPCForm } from '../../form.js';
import { registerEvent, removeEvent } from '../../events.js';
import '../form/form-multi.js';
import '../form/form-range.js';
import { RPCElement } from '../rpcElement.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<div class="modal fade generate-form-modal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Generate questions</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <form action="#" class="needs-validation generate-form" data-rpc-method="questions.generate" novalidate>
        <div class="modal-body">

          <trivia-form-input-multi
            name="themes"
            label="Generate questions using these themes"
            help="Press Enter to add themes">
          </trivia-form-input-multi>

          <trivia-form-input-range
            name="count"
            label="How many questions to generate"
            min="1"
            max="10"
            step="1"
            value="5"
            help="Choose a value between 1 and 10">
          </trivia-form-input-range>

          <label for="correctChoice">Difficulty</label>

          <select class="form-select" name="difficulty" aria-label="Question difficulty">
            <option value="Easy">Piece of Cake</option>
            <option value="Medium">Let's rock</option>
            <option value="Hard">Come get Some</option>
            <option value="Hardest">Damn I'm good</option>
          </select>

          <input type="hidden" name="gameId">

        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</div>
`;

export class GenerateQuestionsFormElement extends RPCElement {
  static observedAttributes = ['data-game-id'];

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));
    this.modal = this.shadow.querySelector('.generate-form-modal');
    this.modalBody = this.shadow.querySelector('.modal-body');
    this.formElement = this.shadow.querySelector('.generate-form');

    this.themeInputElement = this.shadow.querySelector('[name="themes"]');
    this.countInputElement = this.shadow.querySelector('[name="count"]');

    this.hiddenGameIdInput = this.shadow.querySelector('[name="gameId"]');
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

    data.themes = (this.themeInputElement?.value || '').split(',');
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

      case 'data-game-id':
        console.log('game id', newValue);
        this.hiddenGameIdInput.value = newValue ?? '';
        break;
    }
  }
}

customElements.define(
  'trivia-generate-questions-form',
  GenerateQuestionsFormElement,
);
