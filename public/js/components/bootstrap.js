import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';

const sheet = new CSSStyleSheet();
sheet.replaceSync(bootstrap);

export class BootstrapElement extends HTMLElement {
  constructor() {
    super();
    if (new.target === BootstrapElement) {
      throw new TypeError('Cannot instantiate BootstrapElement directly');
    }

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];
    this.hasConnected = false;
  }
}


