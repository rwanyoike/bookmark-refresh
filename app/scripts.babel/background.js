const STATE = {
  isRunning: false,
  isPending: false,
  nodeQueue: [],
  nodes: [],
  nodesUpdated: 0,
  nodesOk: 0,
  nodesFailed: 0,
  nodesSkipped: 0,
};

let portFromBA;

function saveBookmarkNode(opts, node, text) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  let title = extractPageTitle(doc); // eslint-disable-line no-undef
  if (title) {
    if (opts[OPT_APPEND_DESC]) { // eslint-disable-line no-undef
      // eslint-disable-next-line no-undef
      const desc = extractPageDesc(doc);
      if (desc) {
        title = `${title} (${desc})`;
      }
    }
    if (node.title === title) {
      STATE.nodesOk += 1;
    } else {
      browser.bookmarks.update(node.id, { title }).then(() => {
        STATE.nodesUpdated += 1;
      });
    }
  } else {
    // Missing or empty <title/> ¯\_(ツ)_/¯
    STATE.nodesSkipped += 1;
  }
}

function updatePopupHtml() {
  if (portFromBA) {
    portFromBA.postMessage(STATE);
  }
}

function loadNextRequest(opts) {
  if (!STATE.nodeQueue.length) {
    STATE.isRunning = false;
  }
  if (!STATE.isRunning) {
    STATE.isPending = false;
    browser.browserAction.setBadgeText({ text: '' });
    updatePopupHtml();
  } else {
    updatePopupHtml();
    const node = STATE.nodeQueue.shift();
    // Skip over non-http(s) urls
    if (!node.url.startsWith('http')) {
      STATE.nodesSkipped += 1;
      loadNextRequest(opts);
    } else {
      fetch(node.url)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then((text) => {
          saveBookmarkNode(opts, node, text);
        })
        .catch(() => {
          STATE.nodesFailed += 1;
        })
        .then(() => {
          loadNextRequest(opts);
        });
    }
  }
}

function startStopAction() { // eslint-disable-line no-unused-vars
  if (STATE.isRunning) {
    STATE.isRunning = false;
    STATE.isPending = true;
    updatePopupHtml();
  } else {
    browser.browserAction.setBadgeText({ text: '↻' });
    STATE.isRunning = true;
    STATE.isPending = false;
    // Restart the refresh process
    if (!STATE.nodeQueue.length) {
      // FIXME: Reload the bookmarks tree
      STATE.nodeQueue = STATE.nodes.slice();
      STATE.nodesUpdated = 0;
      STATE.nodesOk = 0;
      STATE.nodesFailed = 0;
      STATE.nodesSkipped = 0;
    }
    // eslint-disable-next-line no-undef
    browser.storage.local.get([OPT_APPEND_DESC]).then((items) => {
      loadNextRequest(items);
    });
  }
}

// Fired when a connection is made from popup.js
browser.runtime.onConnect.addListener((port) => {
  portFromBA = port;
  portFromBA.onMessage.addListener(() => {
    startStopAction();
  });
  port.onDisconnect.addListener(() => {
    portFromBA = null;
  });
  updatePopupHtml();
});

// Fired when the extension is first installed
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // eslint-disable-next-line no-undef
    browser.storage.local.set({ [OPT_APPEND_DESC]: true });
  }
});

// Load the entire bookmarks tree
browser.bookmarks.getTree().then((nodes) => {
  // eslint-disable-next-line no-undef
  STATE.nodes = getBookmarkNodes(nodes);
  STATE.nodeQueue = STATE.nodes.slice();
});
