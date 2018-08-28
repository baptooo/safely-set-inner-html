import React from "react";
import { parse } from "himalaya";
import warning from "./warning";
import { isAllowedHref } from "./helpers";

class SafelySetInnerHTML {
  /**
   * safelySetInnerHTML
   * @param config
   */
  constructor(config) {
    this.config = { ...SafelySetInnerHTML.defaultConfig, ...config };
    this.tagId = 0;
    this.cache = [];

    this.generateDom = this.generateDom.bind(this);
    this.transform = this.transform.bind(this);
    this.getCache = this.getCache.bind(this);
    this.formatAttributes = this.formatAttributes.bind(this);
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
      .filter(({ key, value }) => {
        let isAllowed = this.config.ALLOWED_ATTRIBUTES.includes(key);

        if (key === "href") {
          isAllowed = isAllowedHref(value);
        }

        return isAllowed;
      })
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
    type = "",
    children = [],
    content = "",
    tagName = "",
    attributes = []
  }) {
    const { ALLOWED_TAGS, KEY_NAME } = this.config;
    // Group children and content case in one reference
    const innerContent = children.length
      ? children.map(this.generateDom)
      : content;

    if (type === "element" && ALLOWED_TAGS.includes(tagName)) {
      warning(tagName);
      const props = {
        ...this.formatAttributes(attributes),
        key: `${KEY_NAME}${this.tagId++}`
      };

      if (!innerContent) {
        return React.createElement(tagName, props);
      }

      return React.createElement(tagName, props, innerContent);
    }

    return innerContent;
  }

  /**
   * Find in cache if the given str exists
   * @param str
   * @returns {*}
   */
  getCache(str) {
    return this.cache.find(entry => entry.str === str);
  }

  /**
   * Basic API, will transform the given string in React DOM
   * @param str - html string to transform
   * @returns {Object}
   */
  transform(str) {
    // Retrieve cache
    const foundCache = this.getCache(str);

    if (foundCache) {
      return foundCache.dom;
    }

    // Process dom generation
    const dom = parse(str).map(this.generateDom);

    // Store in cache
    this.cache.push({ str, dom });

    return dom;
  }
}

/**
 * Default config
 * @type {{ALLOWED_TAGS: string[], ALLOWED_ATTRIBUTES: string[], KEY_NAME: string}}
 */
SafelySetInnerHTML.defaultConfig = {
  ALLOWED_TAGS: ["strong", "a"],
  ALLOWED_ATTRIBUTES: ["href"],
  KEY_NAME: "ssih-tag-"
};

export default SafelySetInnerHTML;
