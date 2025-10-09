
export const registerEvent = (type, listener) => {
  console.log('register event', type);
  window.addEventListener(type, listener);

};

export const dispatchEvent = (type, data) => {
  console.log('dispatch event', type);
  window.dispatchEvent(new CustomEvent(type, { detail: data }));
};
