import { UserElement } from './user.js';
import './adminBonusForm.js';

const userTemplate = document.createElement('template');
userTemplate.innerHTML = `
<article class="bonus card p-0 m-0 mb-3">
  <h2 class="card-header user-name"></h2>

  <section class="card-body">
    <p class="card-text fw-semibold">Applied bonuses</p>
    <ul class="user-bonuses"></ul>

    <button class="btn btn-primary give-bonus">Give Bonus</button>
  </section>
</article>
`;

export class AdminUserElement extends UserElement {
  constructor() {
    super();
    this.shadow.append(userTemplate.content.cloneNode(true));

    this.bonusElement = this.shadow.querySelector('.bonus');
    this.userNameElement = this.shadow.querySelector('.user-name');
    this.bonusList = this.shadow.querySelector('.user-bonuses');
    this.giveBonusButton = this.shadow.querySelector('.give-bonus');

    this.boundedAddBonus = this.addBonus.bind(this);
  }

  addBonus() {
    const bonusFormElement = document.createElement('trivia-bonus-form');
    this.bonusElement.append(bonusFormElement);


    bonusFormElement.dataset.playerId = this.userId;
    bonusFormElement.toggleModal();

    bonusFormElement.modal.addEventListener('hidden.bs.modal', () => {
      this.bonuses.push(Object.fromEntries(Object.entries(bonusFormElement.dataset)));
      this.updateBonuses();
      bonusFormElement.remove();
    });
  }

  updateUser() {
    this.userNameElement.textContent = this.name;
    this.updateBonuses();
  }

  updateBonuses() {
    this.bonusList.innerHTML = '';

    const bonuses = this.bonuses || [];
    for (const bonus of bonuses) {
      const li = document.createElement('li');
      li.classList.add('bonus-pill');
      li.dataset.scoreId = bonus.scoreId;

      li.innerHTML = `
        <span>+ ${bonus.scorePoints} ${bonus.scoreType}</span>
        <button type="button" title="Remove bonus" aria-label="Remove ${bonus.scoreType}">×</button>
      `;

      li.querySelector('button').addEventListener('click', () =>
        this.removeBonus(bonus),
      );

      this.bonusList.appendChild(li);
    }
  }

  removeBonus(bonus) {
    this.makeRPCCall('players.delete_score', { id: bonus.scoreId });
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.updateUser();
    this.giveBonusButton.addEventListener('click', this.boundedAddBonus);
  }

  onDataLoaded(results, method) {
    if (method !== 'players.delete_score') {
      return;
    }

    this.bonuses = this.bonuses.filter(({ scoreId }) => scoreId !== results.id);
    this.updateBonuses();
  }
}

customElements.define(
  'trivia-admin-user',
  AdminUserElement,
);
