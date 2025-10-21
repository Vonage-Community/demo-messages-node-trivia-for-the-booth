import { RPCElement } from '../rpcElement.js';
import { registerEvent, removeEvent } from '../../events.js';
import './gameForm.js';
import './adminGame.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section aria-label="Games List" class="games-list accordion accordion-flush">

  <header class="mt-3 mb-3 d-flex justify-content-end align-items-center w-100">
    <button class="btn btn-success add-game">Create Game</button>
  </header>

  <ul class="games card-group row p-0 m-0" role="list"></ul>
</section>
`;

export class AdminGamesListElement extends RPCElement {
  constructor() {
    super();

    this.shadow.append(gameListTemplate.content.cloneNode(true));
    this.gamesSectionElement = this.shadow.querySelector('.games');
    this.addButtonElement = this.shadow.querySelector('.add-game');

    this.games = [];
    this.hasConnected = false;

    this.boundedRefreshList = this.refreshList.bind(this);
    this.boundedAddGame = this.addGame.bind(this);
    this.boundedBuildGameElement = this.buildGameElement.bind(this);
  }

  get rpcMethod() {
    return 'games.list';
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
    return this.gamesSectionElement;
  }

  addGame() {
    const gameFormElement = document.createElement('trivia-game-form');
    this.gamesSectionElement.append(gameFormElement);

    gameFormElement.toggleModal();

    gameFormElement.modal.addEventListener('hidden.bs.modal', () => {
      gameFormElement.remove();
      this.makeRPCCall();
    });
  }

  refreshList(event) {
    const method = event.detail.method;
    if (method === 'games.deactivate' || method === 'games.activate') {
      this.makeRPCCall();
    }
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.makeRPCCall();

    this.addButtonElement.addEventListener('click', this.boundedAddGame);

    registerEvent('rpc:success', this.boundedRefreshList);
  }

  disconnectedCallback() {
    removeEvent('rpc:success', this.boundedRefreshList);
    this.addButtonElement.removeEventListener('click', this.boundedAddGame);
  }

  buildGameElement(game) {
    const gameElement = document.createElement('trivia-admin-game');

    Object.entries(game).forEach(([key, value]) => {
      let normalKey = key;
      if (key === 'id') {
        normalKey = 'gameId';
      }

      if (key === 'title') {
        normalKey = 'gameTitle';
      }

      gameElement.dataset[normalKey] = value;
    });

    this.gamesSectionElement.append(gameElement);
    console.log(gameElement);
  }

  render() {
    this.gamesSectionElement.innerHTML = '';
    this.games.forEach(this.boundedBuildGameElement);
  }

  onDataLoaded({ games, limit, total, offset }) {
    this.games = games || [];
    this.limit = limit || 0;
    this.total = total || 0;
    this.offset = offset || 0;
    this.render();
  }
}

customElements.define(
  'trivia-admin-games',
  AdminGamesListElement,
);
