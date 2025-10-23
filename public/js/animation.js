export const slideOutAndHide = (animationClass = 'slide-out') => (element) => {
  element.classList.add(animationClass);
  element.addEventListener(
    'animationend',
    () => {
      element.style.display = 'none';
    },
    { once: true });
};

export const staggerAnimation = (animationClass, baseDelay = 100, step = 200) =>
  (elements) => {
    elements.forEach((element, index) => {
      element.classList.add(animationClass);
      element.style.animationDelay = `${baseDelay + index * step}ms`;
    });
  };
