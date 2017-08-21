'use strict';

const elButton = document.getElementById('button');
const elProgressBar = document.getElementById('progress-bar');
const elFound = document.getElementById('found');

document.querySelectorAll('[data-i18n]').forEach((el) => {
  const message = el.getAttribute('data-i18n');
  el.textContent = browser.i18n.getMessage(message); // eslint-disable-line no-param-reassign
});

browser.runtime.getBackgroundPage().then((backgroundPage) => {
  const eventPage = backgroundPage;
  eventPage.popup = { elButton, elProgressBar, elFound };
  eventPage.updatePopupHtml();
  elButton.addEventListener('click', () => {
    eventPage.startStopAction();
  });
});
