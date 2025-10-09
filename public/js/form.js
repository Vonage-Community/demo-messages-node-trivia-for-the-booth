import { rpc } from './rpc.js';
import { dispatchEvent } from './events.js';

const spinnerTemplate = document.createElement('template');
spinnerTemplate.innerHTML = '<div class="ms-2 spinner-grow spinner-grow-sm" role="status"></div>';

const toggleForm = (form, which) => {
  Array.from(form.querySelectorAll('button, input, select')).forEach((element) => {
    element.disabled = which;
    if (element.type !== 'submit') {
      return;
    }

    if (which) {
      element.appendChild(spinnerTemplate.content.cloneNode(true));
      return;
    }

    element.querySelector('div.spinner-grow').remove();
  });
};

const updateInvalidFields = (form, errorData = {}) => {
  const errorFields = Object.entries(errorData);
  errorFields.forEach(([field, message]) => {
    const inputFieldElement = form.querySelector(`[name=${field}`);
    inputFieldElement.setValidity({ customError: true }, message);
  });
};

export const submitRPCForm = (form) => async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!form.checkValidity()) {
    dispatchEvent('form:invald', { form: form });
    form.classList.add('was-validated');
    return;
  }

  toggleForm(form, true);

  const method = form.dataset.rpcMethod;
  const formData = new FormData(form);

  const data = {};
  for (const [name, value] of formData.entries()) {
    data[name] = value;
  };

  try {
    const result = await rpc(method, data);
    dispatchEvent('form:submitted', { form: form, result, method, data });
  } catch (error) {
    console.error('RPC error', error);
    updateInvalidFields(form, error.data);

    dispatchEvent('form:error', { form: form, error, method, data });
  } finally {
    toggleForm(form, false);
  }
};

