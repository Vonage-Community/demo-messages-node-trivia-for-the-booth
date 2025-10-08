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
    throw new Error(`RPC call for ${method} failed`);
  }

  try {
    const { id, error, result } = await res.json();

    if (error) {
      throw new Error(error.message);
    }

    return [id, result];
  } catch {
    throw new Error(`RPC call for ${method} did not return a body!`);
  }
};
