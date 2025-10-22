import Modal from 'bootstrap/js/dist/modal';
import { submitRPCForm } from '../../form.js';
import { registerEvent, removeEvent } from '../../events.js';
import '../form/form-input.js';
import { QuestionElement } from './question.js';

const choiceTemplate = document.createElement('template');
choiceTemplate.innerHTML = `
<div class="modal fade question-form-modal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">Add question</h1>
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

export class AdminQuestionFormElement extends QuestionElement {
  static observedAttributes = QuestionElement.observedAttributes;

  constructor() {
    super();
    this.shadow.append(choiceTemplate.content.cloneNode(true));
    this.modal = this.shadow.querySelector('.question-form-modal');
    this.modalBody = this.shadow.querySelector('.modal-body');
    this.formElement = this.shadow.querySelector('.question-form');

    this.questionInputElement = this.shadow.querySelector('trivia-form-input[name="question"]');
    this.choiceAInputElement = this.shadow.querySelector('trivia-form-input[name="choiceA"]');
    this.choiceBInputElement = this.shadow.querySelector('trivia-form-input[name="choiceB"]');
    this.choiceCInputElement = this.shadow.querySelector('trivia-form-input[name="choiceC"]');
    this.choiceDInputElement = this.shadow.querySelector('trivia-form-input[name="choiceD"]');

    this.correctChoiceSelectElement = this.shadow.querySelector('select[name="correctChoice"]');
    this.titleModalTitleElement = this.shadow.querySelector('.modal-title');

    this.hiddenGameIdInput = this.shadow.querySelector('input[name="gameId"]');
    this.hiddenQuestionIdInput = this.shadow.querySelector('input[name="questionId"]');
  }

  toggleModal() {
    this.connectedModal.toggle();
  }

  submitForm() {
    // I don't want to mess around with internals
    const formData = new FormData(this.formElement);

    const data = {};
    for (const [name, value] of formData.entries()) {
      data[name] = value;
    };

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
    super.attributeChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'data-question':
        this.questionInputElement.setAttribute('value', newValue ?? '');
        break;

      case 'data-choice-a':
        this.choiceAInputElement.setAttribute('value', newValue ?? '');
        break;

      case 'data-choice-b':
        this.choiceBInputElement.setAttribute('value', newValue ?? '');
        break;

      case 'data-choice-c':
        this.choiceCInputElement.setAttribute('value', newValue ?? '');
        break;

      case 'data-choice-d':
        this.choiceDInputElement.setAttribute('value', newValue ?? '');
        break;

      case 'data-correct-choice':
        this.correctChoiceSelectElement.value = newValue ?? '';
        break;

      case 'data-question-id':
        this.formElement.dataset.rpcMethod = 'questions.update';
        this.hiddenQuestionIdInput.value = newValue ?? '';
        this.titleModalTitleElement.textContent = 'Edit question';
        break;

      case 'data-game-id':
        this.hiddenGameIdInput.value = newValue ?? '';
        break;
    }
  }

}

customElements.define(
  'trivia-admin-question-form',
  AdminQuestionFormElement,
);
