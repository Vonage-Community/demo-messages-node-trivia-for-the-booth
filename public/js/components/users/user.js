import { RPCElement } from '../rpcElement.js';

export class UserElement extends RPCElement {
  static observedAttributes = [
    'data-user-id',
    'data-user-name',
    'data-user-email',
  ];

  get userId() {
    return this.dataset.userId;
  }

  set userId(value) {
    this.dataset.userId = value;
  }

  get name() {
    return this.dataset.name;
  }

  set name(value) {
    this.dataset.name = value;
  }

  get email() {
    return this.dataset.email;
  }

  set email(value) {
    this.dataset.email = value;
  }

  onDataLoaded(results) {
    this.userId = results.id;
    this.name = results.name;
    this.email = results.email;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'data-user-id':
        this.userId = newValue;
        break;

      case 'data-name':
        this.name = newValue;
        break;

      case 'data-email':
        this.email = newValue;
        break;
    }

  }
}

customElements.define(
  'trivia-user',
  UserElement,
);
