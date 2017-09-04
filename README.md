# Bookmark Refresh

> Update your bookmarks.

**Bookmark Refresh** lets you to update your bookmarks [with website descriptions](#options). This is useful when using the address bar -- typing a part of a website's description recommends the bookmark.

Tested on Chrome 57+ and Firefox 51+.

![](screenshot.png)

Icon created by [IconDots](https://thenounproject.com/IconDots/) from the Noun Project.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  * [Options](#options)
    + [Append website description to the title](#append-website-description-to-the-title)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Installation

To install **Bookmark Refresh**, download the [latest release](https://github.com/rwanyoike/bookmark-refresh/releases) and load it as an _unpacked_ (Chrome) or _temporary_ (Firefox) extension.

## Usage

**Remember to backup your bookmarks!** Open the extension and click **Start**. It will proceed to load your bookmarks and update them.

For example, a bookmark pointing to this page:

```html
<!DOCTYPE html>
<html>

<head>
  <title>GoatGoatYo</title>
  <meta name="description" content="GoatGoatYo is the search engine that
  tracks you. We don't protect your search history from anyone – even us! 🐐">
</head>

...
```

Will have its title set to:

> GoatGoatYo

### Options

#### Append website description to the title

When set (default: True), the above title becomes:

> GoatGoatYo (GoatGoatYo is the search engine that tracks you. We don't protect your search history from anyone – even us! 🐐)

Descriptions are found in this order:

|    |                     |                                          |
|----|---------------------|------------------------------------------|
| 1. | Meta                | `<meta name="description" ...>`          |
| 2. | Google+ / Schema    | `<meta itemprop="description" ...>`      |
| 3. | Facebook Open Graph | `<meta property="og:description" ...>`   |
| 4. | Twitter Cards       | `<meta name="twitter:description" ...>`  |

## Maintainers

- [@rwanyoike](https://github.com/rwanyoike)

## Contribute

Feel free to dive in. [Open an issue](https://github.com/rwanyoike/bookmark-refresh/issues/new) or submit a PR.

**Bookmark Refresh** follows the [Contributor Covenant](CODE_OF_CONDUCT.md) code of conduct.

## License

[MIT](LICENSE) © Raymond Wanyoike
