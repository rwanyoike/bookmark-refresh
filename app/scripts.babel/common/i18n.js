document.querySelectorAll('[data-i18n]').forEach((el) => {
  const key = el.getAttribute('data-i18n');
  // eslint-disable-next-line no-param-reassign
  el.innerHTML = browser.i18n.getMessage(key);
});
