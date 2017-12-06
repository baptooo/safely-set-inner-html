import React from 'react';
import {html2json} from 'html2json';

/**
 * Default config
 * @type {{ALLOWED_TAGS: string[]}}
 */
export const config = {
  ALLOWED_TAGS: [
    'strong',
    'a'
  ]
};

let tagId = 0;

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
const generateDom = ({
  node = '',
  child = [],
  text = '',
  tag = '',
  attr = {}
}) => {
  const children = child.length ? child.map(generateDom) : text;

  if (node === 'element' && config.ALLOWED_TAGS.includes(tag)) {
    return React.createElement(tag, { ...attr, key: `safely-tag-${tagId++}` }, children);
  }

  return children;
};

/**
 * Basic API, will transform the given string in React DOM
 * @param str - html string to transform
 * @param allowedTags - custom authorized tags, not mandatory
 * @returns {Object}
 */
const safelySetInnerHtml = (str) => generateDom(html2json(str));

export default safelySetInnerHtml;
