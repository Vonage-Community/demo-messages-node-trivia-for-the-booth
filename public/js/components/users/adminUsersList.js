import { RPCElement } from '../rpcElement.js';
import './adminUser.js';

const userListTemplate = document.createElement('template');
userListTemplate.innerHTML = `
<header class="mt-3">
  <input
    type="search"
    class="form-control"
    placeholder="Search by name or email..."
    aria-label="Search users"
  />
</header>
<section aria-label="Users List" class="users mt-3">
</section>
`;

export class AdminUsersListElement extends RPCElement {
  constructor() {
    super();

    this.shadow.append(userListTemplate.content.cloneNode(true));
    this.searchInputElement = this.shadow.querySelector('input[type="search"]');
    this.usersSectionElement = this.shadow.querySelector('.users');

    this.boundedOnSearchInput = this.onSearchInput.bind(this);
    this.boundedBuildUser = this.buildUserElement.bind(this);

    this.users = [];
    this.query = '';
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
      query: this.query || '',
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
    this.searchInputElement.addEventListener('input', this.boundedOnSearchInput);
  }

  disconnectedCallback() {
    this.searchInputElement.removeEventListener('input', this.boundedOnSearchInput);
  }

  onSearchInput(event) {
    if (this.searchDelay) {
      clearTimeout(this.searchDelay);
    }
    const value = event.target.value.trim();

    this.query = value;

    const boundedTimeoutCall = () => {
      this.makeRPCCall();
    };

    boundedTimeoutCall.bind(this);

    this.searchDelay = setTimeout(boundedTimeoutCall, 500);
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
    this.usersSectionElement.innerHTML = '';
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
