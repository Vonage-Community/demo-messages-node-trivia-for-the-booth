import { rpc } from '../rpc.js';
import { dispatchEvent as emitEvent } from '../events.js';

export class RPCElement extends HTMLElement {
  static observedAttributes = ['data-rpc-id', 'data-rpc-method'];

  constructor() {
    super();
    if (new.target === RPCElement) {
      throw new TypeError('Cannot instantiate RPCElement directly');
    }

    this.hasConnected = false;
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;

    if (this.rpcMethod) {
      this.loadData();
      return;
    }

    this.render();
  }

  get rpcMethod() {
    return this.getAttribute('data-rpc-method');
  }

  get rpcId() {
    return this.getAttribute('data-rpc-id');
  }

  get rpcError() {
    return this.getAttribute('data-rpc-error') || 'Error with RPC call';
  }

  get rpcParams() {
    return {
      id: this.idValue,
    };
  }

  async loadData() {
    const eventParams = {
      id: this.rpcId,
      method: this.rpcMethod,
      params: this.rpcParams,
      element: this,
    };

    try {
      emitEvent(
        'element:loading',
        eventParams,
      );

      console.debug('RPC Element making RPC call', this.rpcMethod, this.rpcParams);

      const [id, result] = await rpc(
        this.rpcMethod,
        this.rpcParams,
      );

      this.onDataLoaded(result);
      emitEvent(
        'element:loaded',
        {
          ...eventParams,
          id,
          result,
        },
      );
    } catch (err) {
      console.error(`RPC load failed for ${this.rpcMethod}`, err);
      this.onDataError(err);
      emitEvent(
        'element:error',
        {
          ...eventParams,
          error: err,
        },
      );
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-rpc-id' && newValue && newValue !== oldValue && this.rpcMethod) {
      this.loadData();
    }
  }

  render() {
    throw new Error('RPCElement must implement render');
  }

  onDataLoaded() { }

  onDataError() {
    this.shadow.innerHTML = `<div class="alert alert-danger" role="alert">${this.rpcError}</div>`;
  }
}
