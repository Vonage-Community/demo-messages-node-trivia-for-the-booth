import { RPCElement } from '../rpcElement.js';
import { registerEvent, removeEvent } from '../../events.js';
import './gameSummary.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section aria-labelledby="games-heading" class="games-list accordion accordion-flush">
  <h1 id="games-heading">Games</h1>
  <ul class="card-group row" role="list"></ul>
</section>
`;

export class GamesListElement extends RPCElement {
  constructor() {
    super();

    this.shadow.append(gameListTemplate.content.cloneNode(true));
    this.gamesSectionElement = this.shadow.querySelector('ul');
    this.games = [];
    this.hasConnected = false;
  }

  get rpcMethod() {
    return 'games.list';
  }

  get limit() {
    return this.getAttribute('limit') || 50;
  }

  set limit(value) {
    this.setAttribute('limit', value);
  }

  get total() {
    return this.getAttribute('total');
  }

  set total(value) {
    this.setAttribute('total', value);
  }

  get offset() {
    return this.getAttribute('offset') || 0;
  }

  set offset(value) {
    this.setAttribute('offset', value);
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

    this.boundedRefreshList = this.refreshList.bind(this);

    registerEvent('rpc:success', this.boundedRefreshList);
  }

  disconnectedCallback() {
    removeEvent('rpc:success', this.boundedRefreshList);
  }

  render() {
    this.gamesSectionElement.innerHTML = '';
    this.games.forEach((game) => {
      const gameSummaryElement = document.createElement('trivia-game-summary');
      this.gamesSectionElement.append(gameSummaryElement);
      gameSummaryElement.gameId = game.id;
      gameSummaryElement.gameTitle = game.title;
      gameSummaryElement.gameShortCode = game.shortCode;
      gameSummaryElement.gameActive = game.active;
      gameSummaryElement.gameQuestionCount = game.questionCount;
      gameSummaryElement.gamePlayerCount = game.playerCount;
      gameSummaryElement.gameCorrectCount = game.totalCorrectAnswers;
      gameSummaryElement.gameIncorrectCount = game.totalIncorrectAnswers;
    });
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
  'trivia-games',
  GamesListElement,
);
