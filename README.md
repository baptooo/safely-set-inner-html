# Safely set inner html

- [Presentation](#presentation)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)

## Presentation

**safelySetInnerHtml** is a library for React with a very simple goal : prevent the use
of React's **dagerouslySetInnerHtml** function.

Typical use cases are when you are working on a multi language project and there is html
in your bundles values !

```json
{
    "article.cite": "About the <a href=\"http://example.com\">Author !</a>"
}
```

**safelySetInnerHtml** will solve this issue by creating automatically the react dom and return
it to your component.

## Getting started

TODO : publish the library on npm

## Usage

```jsx
import React from 'react';
import safelySetInnerHtml from 'safely-set-inner-html';

export default function({ i18nValue }) {
    return <p>{safelySetInnerHtml(i18nValue)}</p>
}
```

## Configuration

You can configure the whitelist of tags like this :

```js
import { config } from 'safely-set-inner-html';

config.ALLOWED_TAGS = [
    'a',
    'strong'
];
```
