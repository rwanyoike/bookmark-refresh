'use strict';

const elAppendMeta = document.getElementById('checkbox');

elAppendMeta.addEventListener('change', () => {
  browser.storage.local.set({ appendMeta: elAppendMeta.checked });
});

document.querySelectorAll('[data-i18n]').forEach((el) => {
  const message = el.getAttribute('data-i18n');
  el.textContent = browser.i18n.getMessage(message); // eslint-disable-line no-param-reassign
});

browser.storage.local.get(['appendMeta']).then((results) => {
  elAppendMeta.checked = results.appendMeta;
});
