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

    this.isLoading = false;
    this.spinnerElement = null;
  }

  get rpcMethod() {
    return this.getAttribute('data-rpc-method');
  }

  get rpcId() {
    return this.getAttribute('data-rpc-id') || undefined;
  }

  get rpcError() {
    return this.getAttribute('data-rpc-error') || 'Error with RPC call';
  }

  get rpcParams() {
    return {};
  }

  get loadingTargetElement() {
    return null;
  }

  toggleSpinner() {
    if (!this.loadingTargetElement) {
      return;
    }

    if (this.spinnerTimeoutId) {
      return;
    }

    if (!this.isLoading) {
      clearTimeout(this.spinnerTimeoutId);
      this.spinnerElement?.remove();
      this.spinnerElement = null;
      return;
    }

    this.spinnerTimeoutId = setTimeout(() => {
      // stop race condition
      if (this.isLoading) {
        this.spinnerElement = document.createElement('trivia-spinner');
        this.loadingTargetElement.append(this.spinnerElement);
        return;
      }

      if (this.spinnerElement) {
        this.spinnerElement.remove();
      }

    }, 300);
  }

  async makeRPCCall(rpcMethod, rpcParams, rpcId) {
    rpcMethod = rpcMethod ?? this.rpcMethod;
    rpcParams = rpcParams ?? this.rpcParams;
    rpcId = rpcId ?? this.rpcId;
    this.isLoading = true;
    this.toggleSpinner();

    const eventData = {
      id: rpcId,
      method: rpcMethod,
      params: rpcParams,
      element: this,
    };

    try {
      emitEvent(
        'element:loading',
        eventData,
      );

      this.onDataLoading(eventData);

      console.debug(`RPC Element making RPC call from ${this.tagName}`, rpcMethod, rpcParams);

      const [id, result] = await rpc(
        rpcMethod,
        rpcParams,
        rpcId,
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

      return result;
    } catch (err) {
      console.error(`RPC load failed for ${rpcMethod}`, err);
      this.onDataError(err);
      emitEvent(
        'element:error',
        {
          ...eventData,
          error: err,
        },
      );
    } finally {
      this.isLoading = false;
      this.toggleSpinner();
    }
  }

  onDataLoading() { }

  onDataLoaded() { }

  onDataError() {
    this.shadow.innerHTML = `<div class="alert alert-danger" role="alert">${this.rpcError}</div>`;
  }
}
