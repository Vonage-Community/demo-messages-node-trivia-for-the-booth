export class AppNav extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <ul class="navbar-nav bg-body-tertiary me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Admin
              </a>
            </li>
          </ul>
        </div>
      </nav>
    `;
  }
}

customElements.define('trivia-nav', AppNav);
