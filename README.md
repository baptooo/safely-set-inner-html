#  :crown: Keep calm and don't use `dangerouslySetInnerHTML` :gb:

![](https://travis-ci.org/baptooo/safely-set-inner-html.svg?branch=master)

- [Why](#thinking-why-)
- [Demo](#game_die-demo)
- [Install](#inbox_tray-install)
- [Usage](#electric_plug-usage)
  - [Configuration](#gear-configuration)
  - [Cache](#package-cache)
  - [Server-side rendering](#postbox-server-side-rendering)
  - [Blacklist](#warning-blacklist)
- [Feedbacks](#baby_bottle-feedback)

---

## :thinking: Why ?

This Library has **one simple goal**, prevent the use of `dangerouslySetInnerHTML` in React.

A common use case is when you have to **render HTML from a string**, for a multilingual project for example.

If we had to render the following value :

```js
// HTML string

{
    article.about: "About the <a href=\"http://example.com\">Author !</a>"
}
```


 Our only option with React is to render the string above as HTML is by using the `dangerouslySetInnerHTML` prop.

### :rotating_light:  But `dangerouslySetInnerHTML` presents a **High Security Risk** !  :rotating_light:

And React actually [warns you about it](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml).


### :angel: **`safelySetInnerHTML`** :angel: 

Is a tool to solve this issue by filtering and creating automatic the react dom and return it to your component as children elements.

By default, only `<strong>` and `<a>` tags  and only the `href` attribute are allowed. 

```js
// Default config

{
  ALLOWED_TAGS: [
    'strong',
    'a',
  ],
  ALLOWED_ATTRIBUTES: [
    'href',
  ],
  KEY_NAME: 'ssih-tag-',
}
```
You will of course be able [modify this configuration to the scope of your needs](#wrench-configuration).

---

## :game_die: Demo 

### Test & Play on [Webpackbin](https://www.webpackbin.com/bins/-L-wDegp7uIy2ixX--lY)

---

## :inbox_tray: Install

Simply install the library with npm:

```sh
$ npm install -D safely-set-inner-html
```

---

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

### :gear: Configuration 

| Key                    | Type     | Desc.       |
| ---------------------- |:--------:| ----------- |
| **ALLOWED_TAGS**       | `Array`  | Whitelist of tags that will be rendered in ReactDOM. At runtime, whitelisted tags will be generated as React elements, other tags will just return their content. |
| **ALLOWED_ATTRIBUTES** | `Array`  | Whitelist of attributes to apply on rendered tags. At runtime, only whitelisted tags will be applied on the React elements. |
| **KEY_NAME**           | `String` | This is the prefix that will be added to each **[key property](https://reactjs.org/docs/lists-and-keys.html#keys)** of React. |


**I recommend you to setup your config via a helper :**

```js
// mySafelySetInnerHTML.js
import SafelySetInnerHTML from 'safely-set-inner-html';

const mySafelySetInnerHTML = new SafelySetInnerHTML({
  ALLOWED_TAGS: [
    'a',
    'strong',
    //...
  ],
  ALLOWED_ATTRIBUTES: [
    'href',
    'class',
    //...
  ]
});

export default mySafelySetInnerHTML.transform;
```

**And just use it like this inside your project :**

```js
// myComponent.js
import React from 'react';
import safelySetInnerHTML from './mySafelySetInnerHTML';

const MyComponent = ({ HTMLContent }) => (
  <p>{safelySetInnerHTML(HTMLContent)}</p>
);
```

### :package: Cache
`safely-set-inner-html` **caches automatically** the generated DOM every time the `transform` function is called.
Do not fear re-rendering calls, the cache will be retrieved from the given string.

It is a simple javascript Object that belongs to the current instance, you can view it like this if needed:

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

### :postbox: Server-side rendering

`safely-set-inner-html` uses exclusively React's [`createElement`](https://reactjs.org/docs/react-api.html#createelement),
for a smooth server-side render experience. 👍

### :warning: Blacklist

In order to prevent any potential attack, everytime a tag or an attribute is created, it's checked against this [blacklist](https://github.com/baptooo/safely-set-inner-html/blob/master/src/warning.js#L3), and logs a warning in your console if it's present.

**Example**
```js
// Be careful with the use of attribute ontransitionend, it presents a potential XSS risk
```

---

## :baby_bottle: Feedback

This library is young, all feedback are strongly appreciated !
Do not hesitate to create an issue if you like to see a specific features !

Thank you ! :saxophone:
