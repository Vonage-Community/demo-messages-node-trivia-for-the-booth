import { BootstrapElement } from './components/bootstrap';
import './components/games/adminGamesList.js';
import './components/users/adminUsersList.js';
import './components/adminSetup.js';
import { getRole } from './auth.js';

const adminPageTemplate = document.createElement('template');
adminPageTemplate.innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Admin</a>

    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item">
        <a href="#games" class="nav-link">
          <i class="bi bi-controller me-2"></i> Games
        </a>
      </li>

      <li class="nav-item">
        <a href="#users" class="nav-link">
          <i class="bi bi-person-badge me-2"></i> Users
        </a>
      </li>

      <li class="nav-item">
        <a href="#setup" class="nav-link">
          <i class="bi bi-gear-fill me-2"></i> Setup
        </a>
      </li>
    </ul>
  </div>
</nav>

<h1 class="page-title ms-3 "></h1>

<section id="adminSection" class="m-3">

</section>
`;
export class AdminPageElement extends BootstrapElement {
  constructor() {
    super();
    this.shadow.append(adminPageTemplate.content.cloneNode(true));
    this.pageTitleElement = this.shadow.querySelector('.page-title');
    this.gamesLink = this.shadow.querySelector('a[href="#games"]');
    this.usersLink = this.shadow.querySelector('a[href="#users"]');
    this.setupLink = this.shadow.querySelector('a[href="#setup"]');
    this.adminLinks = this.shadow.querySelectorAll('a');
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

    if (getRole() !== 'admin') {
      window.location.href = '/';
      return;
    }

    this.hasConnected = true;
    this.updatePage();
    this.adminLinks.forEach(
      (linkElement) => linkElement.addEventListener('click', this.boundedSwitchPage),
    );
  }

  switchPage(event) {
    const href = new URL(event.target.href);
    const page = href.hash.replace('#', '');
    if (this.currentPage === page) {
      return;
    }

    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    this.adminSection.innerHTML = '';
    this.adminLinks.forEach(
      (linkElement) => linkElement.classList.remove('active'),
    );
    switch (this.currentPage) {
      case 'users':
        this.pageTitleElement.textContent = 'Users';
        this.usersLink.classList.toggle('active', true);
        this.adminSection.append(document.createElement('trivia-admin-users'));
        break;

      case 'setup':
        this.pageTitleElement.textContent = 'Setup Application';
        this.setupLink.classList.toggle('active', true);
        this.adminSection.append(document.createElement('trivia-admin-setup'));
        break;

      case 'games':
      // falls through
      default:
        this.pageTitleElement.textContent = 'Games';
        this.gamesLink.classList.toggle('active', true);
        this.adminSection.append(document.createElement('trivia-admin-games'));
    }
  }
}


customElements.define(
  'trivia-admin-page',
  AdminPageElement,
);
