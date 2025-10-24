import { RPCElement } from '../rpcElement.js';
import './adminUser.js';

const userListTemplate = document.createElement('template');
userListTemplate.innerHTML = `
<section aria-label="Users List" class="users mt-3">
</section>
`;

export class AdminUsersListElement extends RPCElement {
  constructor() {
    super();

    this.shadow.append(userListTemplate.content.cloneNode(true));
    this.usersSectionElement = this.shadow.querySelector('.users');

    this.boundedBuildUser = this.buildUserElement.bind(this);

    this.users = [];
    this.hasConnected = false;
  }

  get rpcMethod() {
    return 'users.search';
  }

  get limit() {
    return this.dataset.limit || 50;
  }

  set limit(value) {
    this.dataset.limit = value;
  }

  get total() {
    return this.dataset.total;
  }

  set total(value) {
    this.dataset.total = value;
  }

  get offset() {
    return this.dataset.offset || 0;
  }

  set offset(value) {
    this.dataset.offset = value;
  }

  get rpcParams() {
    return {
      limit: this.limit,
      offset: this.offset,
    };
  }

  get loadingTargetElement() {
    return this.usersSectionElement;
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.makeRPCCall();
  }

  disconnectedCallback() {
  }

  buildUserElement(user) {
    const userElement = document.createElement('trivia-admin-user');
    Object.entries(user).forEach(([key, value]) => {
      if (key === 'bonuses') {
        return;
      }
      userElement.dataset[key === 'id' ? 'userId' : key] = value;
    });

    userElement.bonuses = user.bonuses;

    this.usersSectionElement.append(userElement);
  }

  buildUsersList() {
    this.users.forEach(this.boundedBuildUser);
  }

  onDataLoaded({ users, limit, total, offset }) {
    this.users = users || [];
    this.limit = limit || 0;
    this.total = total || 0;
    this.offset = offset || 0;
    this.buildUsersList();
  }
}

customElements.define(
  'trivia-admin-users',
  AdminUsersListElement,
);
