import React from 'react';
import {parse} from 'himalaya';
import warning from './warning';

class SafelySetInnerHtml {
  /**
   * SafelySetInnerHTML
   * @param config
   */
  constructor(config) {
    this.config = { ...SafelySetInnerHtml.defaultConfig, ...config };
    this.tagId = 0;

    this.generateDom = this.generateDom.bind(this);
  }

  /**
   * Filter and format allowed attributes in order to return an object of props
   * for the currently rendered React tag
   * @param attributes - from himalaya syntax
   * @returns {object}
   */
  formatAttributes(attributes) {
    const props = {};

    attributes
      .filter(({ key }) => this.config.ALLOWED_ATTRIBUTES.includes(key))
      .forEach(({ key, value }) => {
        warning(key);
        props[key] = value;
      });

    return props;
  }

  /**
   * Based on himalaya api, recursive function used to generate the react dom
   * @param type - type type (can be : root, element, content)
   * @param children - if the current type has children, it will be a filled array
   * @param content - if the current type has content
   * @param tagName - if the current type is a tagName
   * @param attributes - if the current type has html attributes
   * @param allowedTags - map of authorized tags
   * @returns {Object}
   */
  generateDom({
    type = '',
    children = [],
    content = '',
    tagName = '',
    attributes = []
  }) {
    const { ALLOWED_TAGS, KEY_NAME } = this.config;
    // Group children and content case in one reference
    const innerContent = children.length ? children.map(this.generateDom) : content;
    const props = this.formatAttributes(attributes);

    if (type === 'element' && ALLOWED_TAGS.includes(tagName)) {
      warning(tagName);
      return React.createElement(tagName, { ...props, key: `${KEY_NAME}${this.tagId++}` }, innerContent);
    }

    return innerContent;
  };

  /**
   * Basic API, will transform the given string in React DOM
   * @param str - html string to transform
   * @returns {Object}
   */
  transform(str) {
    return parse(str).map(this.generateDom);
  }
}

/**
 * Default config
 * @type {{ALLOWED_TAGS: string[], ALLOWED_ATTRIBUTES: string[], KEY_NAME: string}}
 */
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

export default SafelySetInnerHtml;
