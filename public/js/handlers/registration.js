import { storeMessage } from '../toast.js';
import { registerEvent } from '../events.js';

const afterRegistraionFormRedirect = (event) => {
  if (event.detail.form.id !== 'registration-form') {
    return;
  };

  storeMessage('You have been registered');
  window.location.href = '/';
};


registerEvent('form:submitted', afterRegistraionFormRedirect);


