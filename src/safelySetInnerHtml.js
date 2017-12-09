import React from 'react';
import {html2json} from 'html2json';

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
   * Based on html2json api, recursive function used to generate the react dom
   * @param node - node type (can be : root, element, text)
   * @param child - if the current node has children, it will be a filled array
   * @param text - if the current node has text
   * @param tag - if the current node is a tag
   * @param attr - if the current node has html attributes
   * @param allowedTags - map of authorized tags
   * @returns {Object}
   */
  generateDom({
    node = '',
    child = [],
    text = '',
    tag = '',
    attr = {}
  }) {
    const { ALLOWED_TAGS, KEY_NAME } = this.config;
    const children = child.length ? child.map(this.generateDom) : text;

    if (node === 'element' && ALLOWED_TAGS.includes(tag)) {
      return React.createElement(tag, { ...attr, key: `${KEY_NAME}${this.tagId++}` }, children);
    }

    return children;
  };

  /**
   * Basic API, will transform the given string in React DOM
   * @param str - html string to transform
   * @returns {Object}
   */
  transform(str) {
    return this.generateDom(html2json(str));
  }
}

/**
 * Default config
 * @type {{ALLOWED_TAGS: string[], KEY_NAME: string}}
 */
SafelySetInnerHtml.defaultConfig = {
  ALLOWED_TAGS: [
    'strong',
    'a'
  ],
  KEY_NAME: 'ssih-tag-'
};

export default SafelySetInnerHtml;
