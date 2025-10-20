import { emitEvent } from './events';
const BASE_URL = typeof window.API_HOST_URL !== 'undefined'
  ? window.API_HOST_URL
  : window.location.origin;

export const RPC_URL = `${BASE_URL}/rpc`;

export const rpc = async (method, params, requestId = '1') => {
  const token = sessionStorage.getItem('auth_token');

  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { 'authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: requestId,
      method: method,
      params: params,
    }),
  });


  const { id, error, result } = await res.json();

  if (!res.ok) {
    const errorData = {
      id: id,
      method: method,
      params: params,
      error: error,
    };
    emitEvent('rpc:error', errorData);
    throw {
      message: `RPC call for ${method} failed`,
      data: errorData,
    };
  }

  if (error) {
    emitEvent('rpc:fault', { error, id, method, params });
    throw error;
  }

  emitEvent('rpc:success', { id, method, params, result });
  return [id, result];
};
