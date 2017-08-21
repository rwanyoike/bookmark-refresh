'use strict';

// First come, first served
const metaSelectors = [
  'meta[name="description"]', // 1. Meta
  'meta[itemprop="description"]', // 2. Google+ / Schema.org
  'meta[property="og:description"]', // 3. Facebook Open Graph
  'meta[name="twitter:description"]', // 4. Twitter Cards
];

// Elements are shared with popup.js
const popup = null;

// Our very own "state object"
const state = {
  bookmarks: [],
  nodeQueue: [],
  running: false,
  pending: false,
};

let optAppendDesc = null;

function cleanTextContent(text) {
  // Match any whitespace character (equal to [\r\n\t\f\v ])
  return text.replace(/\s{2,}/g, ' ').trim();
}

function saveBookmarkNode(node, page) {
  const html = new DOMParser().parseFromString(page, 'text/html');
  const elTitle = html.querySelector('title');

  if (!elTitle) {
    console.warn('Missing or empty <title/>:', node.id, node.url);
    return;
  }
  let title = cleanTextContent(elTitle.textContent);
  if (!title) {
    console.warn('Missing or empty <title/>:', node.id, node.url);
    return;
  }

  if (optAppendDesc) {
    for (let i = 0; i < metaSelectors.length; i += 1) {
      const el = html.querySelector(metaSelectors[i]);
      if (el) {
        const description = cleanTextContent(el.content);
        if (description) {
          title = `${title} (${description})`;
          break;
        }
      }
    }
  }

  if (node.title === title) {
    console.warn('Skipped bookmark update:', node.id, node.url);
    return;
  }
  browser.bookmarks.update(node.id, { title }).then(() => {
    console.info('Updated bookmark:', node.id, node.url);
  });
}

function getBookmarkNodes(nodes) {
  let flattened = [];

  nodes.forEach((node) => {
    // Return if node is a bookmark
    if (node.url) {
      flattened.push(node);
    }
    // Recurse if node is a folder
    if (node.children) {
      const n = getBookmarkNodes(node.children);
      flattened = flattened.concat(n);
    }
  });

  return flattened;
}

function updatePopupHtml() {
  const progress = state.bookmarks.length - state.nodeQueue.length;
  const progressWidth = (progress / state.bookmarks.length) * 100;

  if (state.running) {
    // STOP action button
    popup.elButton.classList.add('btn-danger');
    popup.elButton.classList.remove('btn-warning');
    popup.elButton.textContent = browser.i18n.getMessage('btnStopAction');
  } else if (state.pending) {
    // STOP action button
    popup.elButton.disabled = true;
    popup.elButton.classList.add('btn-danger');
    popup.elButton.classList.remove('btn-warning');
    popup.elButton.textContent = browser.i18n.getMessage('btnStopAction');
  } else {
    // PLAY action button
    popup.elButton.disabled = false;
    popup.elButton.classList.add('btn-warning');
    popup.elButton.classList.remove('btn-danger');
    popup.elButton.textContent = browser.i18n.getMessage('btnStartAction');
  }

  popup.elProgressBar.style.width = `${progressWidth}%`;
  popup.elProgressBar.textContent = `${progress}/${state.bookmarks.length}`;
  popup.elFound.textContent = browser.i18n.getMessage('bookmarksFound', [
    state.bookmarks.length,
  ]);
}

function loadNextRequest() {
  if (!state.nodeQueue.length) {
    state.running = false;
  }

  if (!state.running) {
    state.pending = false;
    browser.browserAction.setBadgeText({ text: '' });
    updatePopupHtml();
    return;
  }

  updatePopupHtml();
  const node = state.nodeQueue.shift();
  // Skip over non-http urls (note startsWith())
  if (!node.url.startsWith('http')) {
    loadNextRequest();
    return;
  }

  fetch(node.url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.text();
    })
    .then((text) => {
      saveBookmarkNode(node, text);
      loadNextRequest();
    })
    .catch(() => {
      console.error('Failed HTTP request:', node.id, node.url);
      loadNextRequest();
    });
}

function startStopAction() { // eslint-disable-line no-unused-vars
  if (state.running) {
    state.running = false;
    state.pending = true;
    updatePopupHtml();
    return;
  }

  // Load the local settings
  browser.storage.local.get(['appendDesc']).then((items) => {
    if (Object.prototype.hasOwnProperty.call(items, 'appendDesc')) {
      optAppendDesc = items.appendDesc;
    } else {
      optAppendDesc = true;
    }
  });
  browser.browserAction.setBadgeText({ text: '↻' });
  state.running = true;
  state.pending = false;

  if (!state.nodeQueue.length) {
    // Restart the process
    state.nodeQueue = state.bookmarks.slice();
  }

  loadNextRequest();
}

// Load the entire bookmarks tree
browser.bookmarks.getTree().then((nodes) => {
  state.bookmarks = getBookmarkNodes(nodes);
  state.nodeQueue = state.bookmarks.slice();
});
