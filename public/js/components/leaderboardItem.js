import { BootstrapElement } from './bootstrap.js';

const leaderboardItemTemplate = document.createElement('template');
leaderboardItemTemplate.innerHTML = `
<article class="leaderboard-item d-flex justify-content-between border mt-2 rounded p-3">
  <h2 class="name">name</h2>
  <h5 class="points align-self-center">points</h5>
</article>
`;

export class LeaderBoardItemElement extends BootstrapElement {
  static observedAttributes = [
    'data-name',
    'data-total-points',
  ];

  constructor() {
    super();

    this.shadow.append(leaderboardItemTemplate.content.cloneNode(true));
    this.sectionElement = this.shadow.querySelector('.leaderboard-item');
    this.nameElement = this.shadow.querySelector('.name');
    this.pointsElement = this.shadow.querySelector('.points');
  }

  get name() {
    return this.dataset.name;
  }

  set name(value) {
    this.dataset.name = value;
  }

  get totalPoints() {
    return this.dataset.totalPoints || 0;
  }

  set totalPoints(value) {
    this.dataset.totalPoints = value;
  }

  get rank() {
    return this.dataset.rank;
  }

  set rank(value) {
    this.dataset.rank = value;
  }

  updateItem() {
    this.sectionElement.classList.add(`rank-${this.rank}`);
    this.nameElement.textContent = this.name;
    this.pointsElement.textContent = `Ranked: #${this.rank} Points: ${this.totalPoints}`;
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.updateItem();
  }

  onAttributeChanged() {
    this.updateItem();

  }
}

customElements.define(
  'trivia-leaderboard-item',
  LeaderBoardItemElement,
);
