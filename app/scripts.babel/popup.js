'use strict';

const elButton = document.getElementById('button');
const elProgressBar = document.getElementById('progress-bar');
const elFound = document.getElementById('found');
const elSaved = document.getElementById('saved');
let eventPage = null;

elButton.addEventListener('click', () => {
  eventPage.startOrStop();
});

document.querySelectorAll('[data-i18n]').forEach((el) => {
  const message = el.getAttribute('data-i18n');
  el.textContent = browser.i18n.getMessage(message); // eslint-disable-line no-param-reassign
});

browser.runtime.getBackgroundPage().then((backgroundPage) => {
  eventPage = backgroundPage;
  eventPage.els = { elButton, elProgressBar, elFound, elSaved };
  eventPage.updatePopup();
});
