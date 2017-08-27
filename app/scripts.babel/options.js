const elAppendDesc = document.getElementById('opt-append-desc');

elAppendDesc.addEventListener('change', () => {
  // eslint-disable-next-line no-undef
  browser.storage.local.set({ [OPT_APPEND_DESC]: elAppendDesc.checked });
});

// eslint-disable-next-line no-undef
browser.storage.local.get([OPT_APPEND_DESC]).then((items) => {
  // eslint-disable-next-line no-undef
  elAppendDesc.checked = items[OPT_APPEND_DESC];
});
