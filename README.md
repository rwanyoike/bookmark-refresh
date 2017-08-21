# Bookmark Refresh

> Update your bookmarks.

**Bookmark Refresh** allows you to **overwrite** your bookmarks [with website descriptions](#options). This is useful when doing searches or using the address bar -- typing part of a website's description recommends the bookmark.

Tested on Chrome 57+ and Firefox 51+.

![](screenshot.png)

Icon created by [IconDots](https://thenounproject.com/IconDots/) from the [Noun Project](https://thenounproject.com).

## Installation

To install **Bookmark Refresh**, download the [latest release](https://github.com/rwanyoike/bookmark-refresh/releases) and load it as an _unpacked_ (Chrome) or _temporary_ (Firefox) extension.

## Usage

**Remember to make a backup of your bookmarks!**

Open the extension and click **Start**. It will proceed to load your bookmarks and start the update.

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

Will have its title set to: _GoatGoatYo_.

### Options

#### Append website description <meta/> to title (default: True)

When set, the above title becomes: _GoatGoatYo (GoatGoatYo is the search engine that tracks you. We don't protect your search history from anyone – even us! 🐐)_.

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
