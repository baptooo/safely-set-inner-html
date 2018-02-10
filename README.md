Keep calm and don't use dangerouslySetInnerHTML anymore

![](https://travis-ci.org/baptooo/safely-set-inner-html.svg?branch=master)

- [Presentation](#thinking-presentation)
- [Getting started](#inbox_tray-getting-started)
- [Usage](#electric_plug-usage)
  - [Cache](#cache)
  - [Server-side rendering](#server-side-rendering)
  - [Blacklist warnings](#blacklist-warnings)
- [Live demo](#joystick-live-demo)
- [Configuration](#wrench-configuration)
- [Feedbacks](#feedbacks)

## :thinking: Presentation

This library for React has a very simple goal: prevent the use of **dangerouslySetInnerHTML** function.

A typical use case is when you are working on a multi language project and there is html
in your bundle values !

```json
{
    "article.cite": "About the <a href=\"http://example.com\">Author !</a>"
}
```

:rotating_light: Actually the only way to keep this HTML tag is the use of **dangerouslySetInnerHTML** but it presents
a high security risk and the team actually warns you about it: [read this to know more](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

:innocent: **safelySetInnerHTML** will solve this issue by filtering and creating automatically the react dom and return
it to your component.

By default, only few tags are allowed so you don't need to sanitize the HTML string yourself, just configure
the scope for your needs.

**Default config**
```js
{
  ALLOWED_TAGS: [
    'strong',
    'a'
  ],
  ALLOWED_ATTRIBUTES: [
    'href'
  ],
  KEY_NAME: 'ssih-tag-'
}
```

**ALLOWED_TAGS**
- Type: (array)
- Description: This is the whitelist of tags that will be rendered in ReactDOM. At runtime, if a desired tag
is not in this list, it won't generate a React element but return its content directly.

**ALLOWED_ATTRIBUTES**
- Type: (array)
- Description: This is the whitelist of allowed attributes for each rendered tag. At runtime, if a desired attribute
is not in this list, it won't be applied to the generated React element.

**KEY_NAME**
- Type: (string)
- Description: This is the prefix that will be added to each **[key property](https://reactjs.org/docs/lists-and-keys.html#keys)** of React.

## :inbox_tray: Getting started

Install the library with npm:

```sh
$ npm install -P safely-set-inner-html
```

## :electric_plug: Usage

```diff
import React from 'react';
+ import SafelySetInnerHTML from 'safely-set-inner-html';

+ const instance = new SafelySetInnerHTML();

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

### Cache
**Note** that safely-set-inner-html is **caching automatically** the generated dom each time the transform function is called.
So don't be afraid of any re-rendering call, the cache will be retrieved from the given string.

It is a simple javascript Object which belongs to the current instance, you can view it like this if needed:

```js
import SafelySetInnerHTML from 'safely-set-inner-html';

const instance = new SafelySetInnerHTML();

instance.transform('Hello <strong>Cache !</strong>');
console.log(instance.cache);

// [{
//   str: 'Hello <strong>Cache !</strong>',
//   dom: [ 'Hello ', [Object] ]
// }]
```

The cached **dom** will always be returned if a cache entry is found.

### Server-side rendering

**Note** that as safely-set-inner-html is using only [React.createElement](https://reactjs.org/docs/react-api.html#createelement),
it will work perfectly with Server-side rendered APP :+1:

### Blacklist warnings

In order to help you preventing any potential attack, a check is done each time an attribute or a tag is created.
If the tag or the attribute is contained inside [this list](https://github.com/baptooo/safely-set-inner-html/blob/master/src/warning.js#L3), it will
log a warning in your console.

**e.g.**
```js
// Be careful with the use of attribute ontransitionend, it presents a potential XSS risk
```

## :joystick: Live demo

You can play with this example on [webpackbin](https://www.webpackbin.com/bins/-L-wDegp7uIy2ixX--lY)

## :wrench: Configuration

Here is a recommended way of configuring SafelySetInnerHTML:

```js
// mySafelySetInnerHTML.js
import SafelySetInnerHTML from 'safely-set-inner-html';

const mySafelySetInnerHTML = new SafelySetInnerHTML({
  ALLOWED_TAGS: [
    'a',
    'strong'
  ],
  ALLOWED_ATTRIBUTES: [
    'href',
    'class'
  ]
});

export default mySafelySetInnerHTML.transform;
```

And just use it like this inside your project:

```js
// myComponent.js
import React from 'react';
import safelySetInnerHTML from './mySafelySetInnerHTML';

const MyComponent = ({ HTMLContent }) => (
  <p>{safelySetInnerHTML(HTMLContent)}</p>
);
```

### Feedbacks

As this library is young, I would appreciate any feedbacks about it and if you
need specific features do not hesitate to create an issue !

Thank you ! :saxophone:
