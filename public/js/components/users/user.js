import { RPCElement } from '../rpcElement.js';

export class UserElement extends RPCElement {
  static observedAttributes = [
    'data-user-id',
    'data-user-name',
    'data-user-email',
    'data-user-phone',
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

  get phone() {
    return this.dataset.phone;
  }

  set phone(value) {
    this.dataset.phone = value;
  }

  onDataLoaded(results) {
    this.userId = results.id;
    this.name = results.name;
    this.email = results.email;
    this.phone = results.phone;
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

      case 'data-phone':
        this.phone = newValue;
        break;
    }

  }
}

customElements.define(
  'trivia-user',
  UserElement,
);
