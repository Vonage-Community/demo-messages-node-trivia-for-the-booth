import { emitEvent } from './events';

export const rpc = async (method, params, requestId = '1') => {
  const token = sessionStorage.getItem('auth_token');

  const res = await fetch('http://localhost:3000/rpc', {
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

  emitEvent('rpc:success', { id, method, params });
  return [id, result];
};
