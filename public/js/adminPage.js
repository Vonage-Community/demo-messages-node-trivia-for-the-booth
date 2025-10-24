import { BootstrapElement } from './components/bootstrap';
import './components/games/adminGamesList.js';
import './components/users/adminUsersList.js';

const adminPageTemplate = document.createElement('template');
adminPageTemplate.innerHTML = `
<aside class="admin-sidebar">
  <h2 class="sidebar-header fs-5 fw-semibold mb-0">Admin</h2>

  <nav class="nav flex-column" id="admin-nav">
    <a href="#games" class="nav-link mb-3">
      <i class="bi bi-controller me-2"></i> Games
    </a>

    <a href="#users" class="nav-link">
      <i class="bi bi-person-badge me-2"></i> Users
    </a>
  </nav>

</aside>

<nav class="navbar navbar-expanded-lg bg-body-tertiary container-fluid">
  <h1 class="page-title navbar-brand"></h1>
</nav>

<section id="adminSection">
</section>
`;
export class AdminPageElement extends BootstrapElement {
  constructor() {
    super();
    this.shadow.append(adminPageTemplate.content.cloneNode(true));
    this.pageTitleElement = this.shadow.querySelector('.page-title');
    this.gamesLink = this.shadow.querySelector('a[href="#games"]');
    this.usersLink = this.shadow.querySelector('a[href="#users"]');
    this.adminSection = this.shadow.querySelector('#adminSection');

    this.boundedSwitchPage = this.switchPage.bind(this);
    const currentUrl = new URL(window.location.href);
    const windowPage = currentUrl.hash.replace('#', '');
    this.currentPage = windowPage ? windowPage : 'games';
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.updatePage();
    this.gamesLink.addEventListener('click', this.boundedSwitchPage);
    this.usersLink.addEventListener('click', this.boundedSwitchPage);
  }

  switchPage(event) {
    const href = new URL(event.target.href);
    const page = href.hash.replace('#', '');
    console.log('page', page);
    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    this.adminSection.innerHTML = '';
    if (this.currentPage === 'users') {
      this.pageTitleElement.textContent = 'Users';
      this.gamesLink.classList.toggle('active', false);
      this.usersLink.classList.toggle('active', true);
      this.adminSection.append(document.createElement('trivia-admin-users'));
      return;
    }

    this.pageTitleElement.textContent = 'Games';
    this.gamesLink.classList.toggle('active', true);
    this.usersLink.classList.toggle('active', false);
    this.adminSection.append(document.createElement('trivia-admin-games'));
  }
}


customElements.define(
  'trivia-admin-page',
  AdminPageElement,
);
