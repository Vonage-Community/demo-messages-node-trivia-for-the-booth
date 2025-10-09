import { dispatchEvent } from './events';

export const rpc = async (method, params, requestId = '1') => {
  console.log(`Making ${method} RPC call`);
  const res = await fetch('http://localhost:3000/rpc', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: requestId,
      method: method,
      params: params,
    }),
  });

  if (!res.ok) {
    dispatchEvent('rpc:error', { id, method, params });
    throw new Error(`RPC call for ${method} failed`);
  }

  const { id, error, result } = await res.json();

  if (error) {
    dispatchEvent('rpc:fault', { error, id, method, params });
    throw error;
  }

  dispatchEvent('rpc:success', { id, method, params });
  return [id, result];
};
