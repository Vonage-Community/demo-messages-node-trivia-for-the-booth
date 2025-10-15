import { RPCElement } from '../rpcElement.js';
import './gameSummary.js';

const gameListTemplate = document.createElement('template');
gameListTemplate.innerHTML = `
<section aria-labelledby="games-heading" class="games-list">
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

  connectedCallback() {
    this.makeRPCCall();
  }

  render() {
    this.games.forEach((game) => {
      const gameSummaryElement = document.createElement('trivia-game-summary');
      gameSummaryElement.dataset.gameId = game.id;
      gameSummaryElement.dataset.gameTitle = game.title;
      gameSummaryElement.dataset.gameShortCode = game.shortCode;
      gameSummaryElement.dataset.gameAction = game.active;
      gameSummaryElement.dataset.gameQuestionCount = game.questionCount;
      gameSummaryElement.dataset.gamePlayerCount = game.playerCount;
      gameSummaryElement.dataset.gameCorrectCount = game.totalCorrectAnswers;
      gameSummaryElement.dataset.gameIncorrectCount = game.totalIncorrectAnswers;
      this.gamesSectionElement.append(gameSummaryElement);
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
