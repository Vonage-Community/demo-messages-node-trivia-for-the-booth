import '../css/app.scss';
import 'bootstrap';
import './components/index.js';
import './handlers/index.js';
import './rpc.js';
import { submitRPCForm } from './form.js';
import './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const bootstrapForms = document.querySelectorAll('.needs-validation');

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

