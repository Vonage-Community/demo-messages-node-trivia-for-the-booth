import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?inline';
import appStyles from '../../css/app.scss?inline';
import adminStyles from '../../css/admin.scss?inline';

const mode = document.documentElement.dataset.theme;

const bsSheet = new CSSStyleSheet();
bsSheet.replaceSync(bootstrap);

const appSheet = new CSSStyleSheet();
appSheet.replaceSync(appStyles);

const adminSheet = new CSSStyleSheet();
adminSheet.replaceSync(adminStyles);

export class BootstrapElement extends HTMLElement {
  constructor() {
    super();
    if (new.target === BootstrapElement) {
      throw new TypeError('Cannot instantiate BootstrapElement directly');
    }

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [bsSheet, mode === 'admin' ? adminSheet : appSheet];
    this.hasConnected = false;
  }
}


