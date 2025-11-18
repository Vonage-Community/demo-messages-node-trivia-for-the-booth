import { RPCElement } from './rpcElement.js';
import './leaderboardItem.js';

const leaderboardTemplate = document.createElement('template');
leaderboardTemplate.innerHTML = `
<ul class="leaderboards list-unstyled">
</ul>
`;

export class LeaderBoardElement extends RPCElement {
  static observedAttributes = ['data-game-id'];

  constructor() {
    super();

    this.shadow.append(leaderboardTemplate.content.cloneNode(true));
    this.leaderboardListElement = this.shadow.querySelector('.leaderboards');
  }

  get gameId() {
    return this.dataset.gameId;
  }

  set gameId(value) {
    this.dataset.gameId = value;
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.getLeaderBoardData();
  }

  showLeaderboard(results) {
    const users = results.splice(0, 10);
    users.forEach(({ rank, name }) => {
      const item = document.createElement('li');
      item.textContent = `Name: ${name}, Ranked: ${rank}`;
      this.leaderboardListElement.append(item);
    });
  }

  getLeaderBoardData() {
    this.makeRPCCall('games.leaderboard', { gameId: this.gameId });
  }

  onDataLoaded(results, method) {
    switch (method) {
      case 'games.leaderboard':
        this.showLeaderboard(results);
        break;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'data-game-id') {
      this.getLeaderBoardData();
    }
  }
}

customElements.define(
  'trivia-admin-leaderboard',
  LeaderBoardElement,
);
