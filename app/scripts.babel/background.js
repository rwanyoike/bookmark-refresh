'use strict';

const bookmarks = [];
const els = null;
let appendMeta = false;
let running = false;
let pending = false;
let bookmarksQueue = [];
let saved = 0;
let errors = 0; // eslint-disable-line no-unused-vars

function updatePopup() {
  const progress = bookmarks.length - bookmarksQueue.length;
  const progressWidth = (progress / bookmarks.length) * 100;

  if (running) {
    els.elButton.classList = 'btn btn-danger';
    els.elButton.textContent = chrome.i18n.getMessage('btnStopAction');
  } else if (pending) {
    els.elButton.disabled = true;
    els.elButton.classList = 'btn btn-danger';
    els.elButton.textContent = chrome.i18n.getMessage('btnStopAction');
  } else {
    els.elButton.disabled = false;
    els.elButton.classList = 'btn btn-warning';
    els.elButton.textContent = chrome.i18n.getMessage('btnStartAction');
  }

  els.elProgressBar.style.width = `${progressWidth}%`;
  // elProgressBar.textContent = `${progress}/${bookmarks.length}`;
  els.elFound.textContent = chrome.i18n.getMessage(
    'bookmarksFound', [bookmarks.length]);
  els.elSaved.textContent = chrome.i18n.getMessage(
    'bookmarksSaved', [saved]);
}

function updateNode(node, text) {
  const html = new DOMParser().parseFromString(text, 'text/html');
  const elTitle = html.querySelector('title');
  if (elTitle) {
    const elMeta = html.querySelector('meta[name="description"]');
    let title = elTitle.textContent.trim();
    if (appendMeta && elMeta) {
      const meta = elMeta.content.replace(/\r?\n|\r/g, ' ').trim();
      if (meta.length > 0) {
        title = `${title} (${meta})`;
      }
    }
    chrome.bookmarks.update(node.id, { title }, () => {
      saved += 1;
    });
  }
}

function nextRequest() {
  if (!bookmarksQueue.length > 0) {
    running = false;
  }

  if (!running) {
    pending = false;
    chrome.browserAction.setBadgeText({ text: '' });
    updatePopup();
  } else {
    updatePopup();
    const node = bookmarksQueue.shift();
    // Skip over non-http urls
    if (!node.url.startsWith('http')) {
      errors += 1;
      nextRequest();
      return;
    }
    fetch(node.url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.text();
      }).then((text) => {
        updateNode(node, text);
        nextRequest();
      }).catch(() => {
        errors += 1;
        nextRequest();
      });
  }
}

function startOrStop() { // eslint-disable-line no-unused-vars
  if (running) {
    running = false;
    pending = true;
    updatePopup();
  } else {
    chrome.storage.local.get(['appendMeta'], (items) => {
      appendMeta = items.appendMeta;
    });
    running = true;
    pending = false;
    chrome.browserAction.setBadgeText({ text: '↻' });
    nextRequest();
  }
}

function getTreeNodes(nodes) {
  nodes.forEach((node) => {
    if (node.title && node.url) {
      bookmarks.push(node);
    }
    if (node.children && node.children.length > 0) {
      getTreeNodes(node.children);
    }
  });
}

chrome.bookmarks.getTree((nodes) => {
  getTreeNodes(nodes);
  bookmarksQueue = bookmarks.slice();
});

