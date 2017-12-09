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

By default, only few tags are allowed so you don't need to sanitize the string but just configure
the scope for your needs.

**Default config**
```js
SafelySetInnerHtml.defaultConfig = {
  ALLOWED_TAGS: [
    'strong',
    'a'
  ],
  ALLOWED_ATTRIBUTES: [
    'href'
  ],
  KEY_NAME: 'ssih-tag-'
};
```

**ALLOWED_TAGS**
- Type: (array)
- Description: This is the whitelist of tags that will be rendered in ReactDOM

**ALLOWED_ATTRIBUTES**
- Type: (array)
- Description: This is the whitelist of allowed attributes for each rendered tag

**KEY_NAME**
- Type: (array)
- Description: This is the prefix that will be added to each **[key property](https://reactjs.org/docs/lists-and-keys.html#keys)** of React.

## Getting started

TODO : publish the library on npm

## Usage

```diff
import React from 'react';
+ import SafelySetInnerHtml from 'safely-set-inner-html';

+ const instance = new SafelySetInnerHtml();

export default class extends React.Component {
  render() {
    return (
      <article>
        <h2>{this.props.title}</h2>
-       <p dangerouslySetInnerHTML={{ __html: this.props.content }} />
+       <p>{instance.transform(this.props.content)}</p>
      </article>
    );
  }
}
```

**Note** as transform is going to parse the given string each time with [himalaya](https://github.com/andrejewski/himalaya)
you could use [componentWillReceiveProps](https://reactjs.org/docs/react-component.html#componentwillreceiveprops) for better performance :

```jsx
import React from 'react';
import SafelySetInnerHtml from 'safely-set-inner-html';

const instance = new SafelySetInnerHtml();

export default class extends React.Component {
  state = {
    $content: '',
  };
  
  componentWillReceiveProps({ content }) {
    if (content !== this.props.content) {
      this.setState({ $content: instance.transform(content) });    
    }  
  }
  
  render() {
    return (
      <article>
        <h2>{this.props.title}</h2>
        <p>{this.state.$content}</p>
      </article>
    );
  }
}
```

## Configuration

You can configure the whitelist of tags and attributes like this :

```js
import SafelySetInnerHtml from 'safely-set-inner-html';

export default new SafelySetInnerHtml({
  ALLOWED_TAGS = [
    'a',
    'strong'
  ],
  ALLOWED_ATTRIBUTES = [
    'href',
    'class'
  ]
});
```
