'use strict';

const elAppendMeta = document.getElementById('checkbox');

elAppendMeta.addEventListener('change', () => {
  chrome.storage.local.set({ appendMeta: elAppendMeta.checked });
});

document.querySelectorAll('[data-i18n]').forEach((el) => {
  const message = el.getAttribute('data-i18n');
  el.textContent = chrome.i18n.getMessage(message); // eslint-disable-line no-param-reassign
});

chrome.storage.local.get(['appendMeta'], (items) => {
  elAppendMeta.checked = items.appendMeta;
});
