const elProgressBar = document.getElementById('progress-bar');
const elActionButton = document.getElementById('action-button');
const elNodesUpdated = document.getElementById('nodes-updated');
const elNodesOk = document.getElementById('nodes-ok');
const elNodesFailed = document.getElementById('nodes-failed');
const elNodesSkipped = document.getElementById('nodes-skipped');

function updateProgressBar(state) {
  const progress = state.nodes.length - state.nodeQueue.length;
  const progressWidth = (progress / state.nodes.length) * 100;
  elProgressBar.style.width = progressWidth ? `${progressWidth}%` : '0%';
  elProgressBar.textContent = `${progress}/${state.nodes.length}`;
}

function updateActionButton(state) {
  if (state.isRunning || state.isPending) {
    elActionButton.classList.remove('btn-primary');
    elActionButton.classList.add('btn-secondary');
    elActionButton.innerHTML = browser.i18n.getMessage('btnStopAction');
    if (state.isPending) {
      elActionButton.disabled = true;
    }
  } else {
    elActionButton.classList.remove('btn-secondary');
    elActionButton.classList.add('btn-primary');
    elActionButton.innerHTML = browser.i18n.getMessage('btnStartAction');
    elActionButton.disabled = false;
  }
}

function updateProgressInfo(state) {
  elNodesUpdated.innerHTML = browser.i18n.getMessage('nodesUpdated', [
    state.nodesUpdated,
  ]);
  elNodesOk.innerHTML = browser.i18n.getMessage('nodesOk', [
    state.nodesOk,
  ]);
  elNodesFailed.innerHTML = browser.i18n.getMessage('nodesFailed', [
    state.nodesFailed,
  ]);
  elNodesSkipped.innerHTML = browser.i18n.getMessage('nodesSkipped', [
    state.nodesSkipped,
  ]);
}

const port = browser.runtime.connect({});
port.onMessage.addListener((message) => {
  updateProgressBar(message);
  updateActionButton(message);
  updateProgressInfo(message);
});

elActionButton.addEventListener('click', () => {
  port.postMessage({});
});
