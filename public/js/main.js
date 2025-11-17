import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './components/index.js';
import './handlers/index.js';
import './rpc.js';
import './toast.js';
import { submitRPCForm } from './form.js';
import { registerEvent } from './events.js';
import { storeMessage } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const bootstrapForms = document.querySelectorAll('.needs-validation');

  registerEvent('rpc:error', (errorEvent) => {
    const { code } = errorEvent.detail.error;
    if (code === 401) {
      storeMessage('You need to login to access that page');
      //just in case
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login';
      return;
    }
  });

  // Loop over them and prevent submission
  Array.from(bootstrapForms).forEach(form => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false,
    );
  });

  // Register rpc forms
  const rpcForms = document.querySelectorAll('form[data-rpc-method]');
  Array.from(rpcForms).forEach((form) => {
    form.addEventListener(
      'submit',
      submitRPCForm(form),
      false,
    );
  });
});

