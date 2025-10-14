import { BootstrapElement } from './bootstrap.js';
import { rpc } from '../rpc.js';
import { emitEvent } from '../events.js';

/**
 * Custom element that can make RPC calls when connected to the DOM
 *
 * @abstract
 */
export class RPCElement extends BootstrapElement {
  static observedAttributes = ['data-rpc-id', 'data-rpc-method'];

  constructor() {
    super();
    if (new.target === RPCElement) {
      throw new TypeError('Cannot instantiate RPCElement directly');
    }
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
    return {};
  }

  async loadData() {
    const eventData = {
      id: this.rpcId,
      method: this.rpcMethod,
      params: this.rpcParams,
      element: this,
    };

    try {
      emitEvent(
        'element:loading',
        eventData,
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
          ...eventData,
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
          ...eventData,
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

  onDataLoaded() { }

  onDataError() {
    this.shadow.innerHTML = `<div class="alert alert-danger" role="alert">${this.rpcError}</div>`;
  }
}
