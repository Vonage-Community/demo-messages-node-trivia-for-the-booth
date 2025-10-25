const decodeJWT = () => {
  const token = sessionStorage.getItem('auth_token');
  if (!token) {
    return {};
  }

  const [, payload] = token.split('.');
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(jsonPayload);
};

export const getUserName = () => {
  const decoded = decodeJWT();
  return decoded?.name;
};

export const getUserId = () => {
  const decoded = decodeJWT();
  return decoded?.id;
};
