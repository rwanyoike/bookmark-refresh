# Bookmark Refresh

> Update your bookmarks

This WebExtenstion lets you update your bookmarks, specifically your bookmark titles. It loads each bookmark location, picks the `<title/>`, and updates the bookmark. Useful when used with the [append website description](#append-website-description) option. Tested on Chrome and Firefox:

![](screenshot.png)

For example, this bookmark location:

```html
<!DOCTYPE html>
<html>

<head>
  <title>GoatGoatYo</title>
  <meta name="description" content="GoatGoatYo is the search engine that
  tracks you. We don't protect your search history from anyone – even us!">
</head>

<body>...</body>

</html>
```

Will have its title set to: _GoatGoatYo_.

## Options

### Append website description

When set, the above becomes: _GoatGoatYo (GoatGoatYo is the search engine that tracks you. We don't protect your search history from anyone – even us!)_.

\*\* If you use the address bar to lookup bookmarks, typing _search engine_ will also suggest _GoatGoatYo_.

## Credits

- Scaffolded using [`yo`](https://github.com/yeoman/yo) [`chrome-extension --sass`](https://github.com/yeoman/generator-chrome-extension).
- Icon created by [IconDots](https://thenounproject.com/IconDots/) from the [Noun Project](https://thenounproject.com).

## License

MIT © Raymond Wanyoike
