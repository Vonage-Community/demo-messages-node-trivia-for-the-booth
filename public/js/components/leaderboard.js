import { RPCElement } from './rpcElement.js';
import { staggerAnimation } from '../animation.js';
import './leaderboardItem.js';
import { getUserId } from '../auth.js';

const leaderboardTemplate = document.createElement('template');
leaderboardTemplate.innerHTML = `

<a href="/" class="home-link btn btn-primary mt-2">Home</a>

<div class="leader-board d-flex justify-content-between align-items-center flex-column mt-5">
  <h2 class="leaderboard-name">Round 1</h2>

  <section class="leaderboards w-100">
  </section>
  <p class="no-rounds">No rounds have been played</p>
</div>
`;

export class LeaderBoardElement extends RPCElement {
  static observedAttributes = ['data-interval'];

  constructor() {
    super();

    this.shadow.append(leaderboardTemplate.content.cloneNode(true));
    this.leaderboardSectionElement = this.shadow.querySelector('.leaderboards');
    this.leaderBoardNameElement = this.shadow.querySelector('.leaderboard-name');
    this.homeLinkElement = this.shadow.querySelector('.home-link');
    this.noGamesElement = this.shadow.querySelector('.no-rounds');

    this.games = [];
    this.leaderboardIntervalId = null;
    this.boundedGetLeaderBoardData = this.getLeaderBoardData.bind(this);
    this.leaderboardGameIndex = -1;
  }

  get leaderboardInterval() {
    return Number(this.dataset.interval ?? 15000);
  }

  set leaderboardInterval(value) {
    this.dataset.interval = value;
  }

  get showItems() {
    return Number(this.dataset.showItems ?? 5);
  }

  set showItems(value) {
    this.dataset.showItems = value;
  }

  get leaderboardTitle() {
    return this.games[this.leaderboardGameIndex]
      ? `Leaderboard for game ${this.games[this.leaderboardGameIndex].title}`
      : 'Global Leaderboard';
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    if (!getUserId()) {
      this.homeLinkElement.classList.add('d-none');
    }

    this.hasConnected = true;
    this.loadGames();
  }

  startLeaderboard() {
    if (this.leaderboardIntervalId) {
      clearInterval(this.leaderboardIntervalId);
    }

    this.leaderboardIntervalId = setInterval(
      this.boundedGetLeaderBoardData,
      this.leaderboardInterval,
    );

    this.getLeaderBoardData();
  }

  getLeaderBoardData() {
    let method = 'players.leaderboard';
    let params = {};

    if (this.games.length > 0) {
      this.leaderboardGameIndex = this.games[(this.leaderboardGameIndex + 1)]
        ? this.leaderboardGameIndex + 1
        : -1;
    }

    if (this.leaderboardGameIndex > -1) {
      method = 'games.leaderboard';
      params = { gameId: this.games[this.leaderboardGameIndex].id };
    }

    this.makeRPCCall(method, params);
  }

  showLeaderboard(results) {
    this.leaderboardSectionElement.innerHTML = '';
    this.leaderBoardNameElement.textContent = this.leaderboardTitle;
    const items = [];

    results.forEach(({ name, totalPoints, rank }) => {
      const item = document.createElement('trivia-leaderboard-item');
      item.dataset.name = name;
      item.dataset.totalPoints = totalPoints;
      item.dataset.rank = rank;
      this.leaderboardSectionElement.append(item);
      items.push(item);
    });

    staggerAnimation('slide-in-right')(items);
    this.noGamesElement.classList.toggle('d-none', results.length > 0);
  }

  loadGames() {
    this.makeRPCCall('games.list');
  }

  afterGamesLoaded({ games }) {
    this.games = games.filter(({ playerCount }) => playerCount > 0);
    this.startLeaderboard();
  }

  onDataLoaded(results, method) {
    switch (method) {
      case 'games.list':
        this.afterGamesLoaded(results);
        break;

      case 'games.leaderboard':
      // falls through
      case 'players.leaderboard':
        this.showLeaderboard(results);
        break;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'data-interval') {
      this.startLeaderboard();
    }
  }
}

customElements.define(
  'trivia-leaderboard',
  LeaderBoardElement,
);
