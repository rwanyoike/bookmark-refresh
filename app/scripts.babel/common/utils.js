const META_DESC_SELECTORS = [
  'meta[name="description"]', // 1. Meta
  'meta[itemprop="description"]', // 2. Google+ / Schema.org
  'meta[property="og:description"]', // 3. Facebook Open Graph
  'meta[name="twitter:description"]', // 4. Twitter Cards
];

function cleanTextContent(text) {
  // Match any whitespace character [\r\n\t\f\v ]
  return text.replace(/\s{2,}/g, ' ').trim();
}

function getBookmarkNodes(nodes) { // eslint-disable-line no-unused-vars
  let flat = [];
  nodes.forEach((node) => {
    // Append if the node is a bookmark
    if (node.url) {
      flat.push(node);
    }
    // Recurse if the node is a folder
    if (node.children) {
      const n = getBookmarkNodes(node.children);
      flat = flat.concat(n);
    }
  });
  return flat;
}

function extractPageTitle(doc) { // eslint-disable-line no-unused-vars
  const el = doc.querySelector('title');
  if (el) {
    const title = cleanTextContent(el.textContent);
    if (title) {
      return title;
    }
  }
  return null;
}

function extractPageDesc(doc) { // eslint-disable-line no-unused-vars
  for (let i = 0; i < META_DESC_SELECTORS.length; i += 1) {
    const el = doc.querySelector(META_DESC_SELECTORS[i]);
    if (el) {
      const desc = cleanTextContent(el.content);
      if (desc) {
        return desc;
      }
    }
  }
  return null;
}
