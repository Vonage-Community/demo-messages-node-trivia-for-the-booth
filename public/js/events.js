
export const registerEvent = (type, listener) => {
  window.addEventListener(type, listener);

};

export const emitEvent = (type, data) => {
  window.dispatchEvent(new CustomEvent(type, { detail: data }));
};
