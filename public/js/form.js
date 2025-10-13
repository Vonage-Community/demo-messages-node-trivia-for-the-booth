import { rpc } from './rpc.js';
import { emitEvent } from './events.js';

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
    const inputFieldElement = form.querySelector(`[name="${field}"]`);

    // Custom elements
    if (typeof inputFieldElement.setCustomValidity === 'function') {
      inputFieldElement.setCustomValidity(message);
      return;
    }

    // fallback for plain <input> elements
    inputFieldElement.setCustomValidity(message);
    inputFieldElement.reportValidity();
  });
};

export const submitRPCForm = (form) => async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!form.checkValidity()) {
    emitEvent('form:invald', { form: form });
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
    const [rpcId, rpcResult] = await rpc(method, data);
    emitEvent('form:submitted', {
      form: form,
      rpcMethod: method,
      rpcData: data,
      rpcId: rpcId,
      data: rpcResult,
    });
  } catch (error) {
    updateInvalidFields(form, error.data.error.data);

    emitEvent('form:error', { form: form, error, method, data });
  } finally {
    toggleForm(form, false);
  }
};

