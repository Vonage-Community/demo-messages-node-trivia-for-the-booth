import { RPCElement } from './rpcElement.js';

export class AdmiSettingsElement extends RPCElement {
  constructor() {
    super();

    this.apiKey = null;
    this.apiSecret = null;
    this.applicationId = null;
    this.applicationName = null;
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;

    this.makeRPCCall('settings.get');
  }

  onDataLoaded(data, method) {
    if (method === 'settings.get') {
      this.apiKey = data.apiKey;
      this.apiSecret = data.apiSecret;
      this.applicationId = data.applicationId;
      this.applicationName = data.applicationName;
    }
  }
}

