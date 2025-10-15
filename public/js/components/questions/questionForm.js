import Modal from 'bootstrap/js/dist/modal';
import { submitRPCForm } from '../../form.js';
import { registerEvent, removeEvent } from '../../events.js';
import '../form/form-input.js';
import { RPCElement } from '../rpcElement.js';
import { QuestionElement } from './question.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<div class="modal fade question-form-modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <form action="#" class="needs-validation question-form" data-rpc-method="questions.create" novalidate>
        <div class="modal-body">
          <trivia-form-input
            name="question"
            label="Question"
            required>
          </trivia-form-input>

          <trivia-form-input
            name="choiceA",
            label="Choice A"
            required>
          </trivia-form-input>

          <trivia-form-input
            name="choiceB",
            label="Choice B"
            required>
          </trivia-form-input>

          <trivia-form-input
            name="choiceC",
            label="Choice C"
            required>
          </trivia-form-input>

          <trivia-form-input
            name="choiceD",
            label="Choice D"
            required>
          </trivia-form-input>

          <label for="correctChoice">Correct Choice</label>

          <select class="form-select" name="correctChoice" aria-label="Correct Option">
            <option value="A">Choice A</option>
            <option value="B">Choice B</option>
            <option value="C">Choice C</option>
            <option value="D">Choice D</option>
          </select>

          <input type="hidden" name="gameId">
          <input type="hidden" name="questionId">

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

export class QuestionFormElement extends RPCElement {
  static observedAttributes = QuestionElement.observedAttributes;

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));
    this.modal = this.shadow.querySelector('.question-form-modal');
    this.modalBody = this.shadow.querySelector('.modal-body');
    this.formElement = this.shadow.querySelector('.question-form');
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

    submitRPCForm(this.formElement)(null, data);
  }

  afterSubmit(event) {
    console.log('afterSubmit', event);

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

    registerEvent('form:submitted', this.afterSubmit);
  }

  disconnectedCallback() {
    removeEvent('form:submitted', this.afterSubmit);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'data-question':
        this.shadow.querySelector('trivia-form-input[name="question"]').setAttribute('value', newValue);
        break;

      case 'data-choice-a':
        this.shadow.querySelector('trivia-form-input[name="choiceA"]').setAttribute('value', newValue);
        break;

      case 'data-choice-b':
        this.shadow.querySelector('trivia-form-input[name="choiceB"]').setAttribute('value', newValue);
        break;

      case 'data-choice-c':
        this.shadow.querySelector('trivia-form-input[name="choiceC"]').setAttribute('value', newValue);
        break;

      case 'data-choice-d':
        this.shadow.querySelector('trivia-form-input[name="choiceD"]').setAttribute('value', newValue);
        break;

      case 'data-correct-choice':
        this.shadow.querySelector('select[name="correctChoice"]').value = newValue;
        break;

      case 'data-question-id':
        this.formElement.setAttribute('data-rpc-method', 'questions.update');
        this.shadow.querySelector('input[name="questionId"]').value = newValue;
        break;

      case 'data-game-id':
        this.shadow.querySelector('input[name="gameId"]').value = newValue;
        break;
    }
  }
}

customElements.define('trivia-question-form', QuestionFormElement);
