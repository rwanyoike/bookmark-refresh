'use strict';

const elAppendDesc = document.getElementById('checkbox');

document.querySelectorAll('[data-i18n]').forEach((el) => {
  const message = el.getAttribute('data-i18n');
  el.textContent = browser.i18n.getMessage(message); // eslint-disable-line no-param-reassign
});

elAppendDesc.addEventListener('change', () => {
  browser.storage.local.set({ appendDesc: elAppendDesc.checked });
});

// Load the local settings
browser.storage.local.get(['appendDesc']).then((items) => {
  if (Object.prototype.hasOwnProperty.call(items, 'appendDesc')) {
    elAppendDesc.checked = items.appendDesc;
  } else {
    elAppendDesc.checked = true;
  }
});
