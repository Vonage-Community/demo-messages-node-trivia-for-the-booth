import { storeMessage } from '../toast.js';
import { registerEvent } from '../events.js';

registerEvent(
  'form:submitted',
  (event) => {
    if (event.detail.form.id !== 'login-form') {
      return;
    };

    storeMessage('Login in successful');
    window.sessionStorage.setItem('auth_token', event.detail.data.token);
    window.location.href = '/';
  },
);
