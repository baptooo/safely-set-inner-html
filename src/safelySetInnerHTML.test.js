import React from 'react';
import renderer from 'react-test-renderer';
import SafelySetInnerHTML from './safelySetInnerHTML';
import mySafelySetInnerHTML from './__mocks__/mySafelySetInnerHTML';

jest.spyOn(console, 'warn');

describe('SafelySetInnerHTML', () => {
  describe('initialization', () => {
    let config = { ALLOWED_TAGS: ['marquee'] };
    let instance = new SafelySetInnerHTML(config);

    it('should merge the config', () => {
      expect(instance.config).toEqual({
        ...SafelySetInnerHTML.defaultConfig,
        ...config
      });
    });

    it('should set tagId to 0', () => {
      expect(instance.tagId).toEqual(0);
    });

    it('should init cache', () => {
      expect(instance.cache).toEqual([]);
    });
  });

  describe('rendering process', () => {
    it('renders correctly', () => {
      const instance = new SafelySetInnerHTML();

      const dom = instance.transform('Hello <strong>World !</strong>');
      const tree = renderer.create(<p>{dom}</p>).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders only allowedTags', () => {
      const instance = new SafelySetInnerHTML({ ALLOWED_TAGS: [] });

      const dom = instance.transform('Hello <strong>World !</strong>');
      const tree = renderer.create(<p>{dom}</p>).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('renders correctly', () => {
      const instance = new SafelySetInnerHTML();

      const dom = instance.transform('About the <a href="http://example.com">Author !</a>');
      const tree = renderer.create(<cite>{dom}</cite>).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('attributes rules', () => {
    it('should format the attributes properly', () => {
      const instance = new SafelySetInnerHTML({
        ALLOWED_ATTRIBUTES: ['href']
      });

      const props = instance.formatAttributes([
        { key: 'foo', value: 'bar' },
        { key: 'href', value: 'http://example.com' }
      ]);

      expect(props).toEqual({
        href: 'http://example.com'
      })
    });

    it('should work with React special properties', () => {
      const instance = new SafelySetInnerHTML({
        ALLOWED_TAGS: ['article', 'h2', 'p'],
        ALLOWED_ATTRIBUTES: ['class']
      });

      const dom = instance.transform(`
      <article class="article">
        <h2 class="article__title">Article title</h2>      
        <p class="article__content">Lorem ipsum dolor sit amet</p>      
      </article>
    `);
      const tree = renderer.create(dom).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('XSS attack prevention', () => {
    /**
     * This case can appear irrelevant but for some cases such as emails
     * it could happen to you
     */
    it('should prevent basic XSS attacks', () => {
      const instance = new SafelySetInnerHTML({
        ALLOWED_TAGS: ['style', 'div'],
        ALLOWED_ATTRIBUTES: ['']
      });

      const dom = instance.transform(`
      <style type="text/css">
        [ontransitionend] {
          transition: all 0.2s;
        }
        [ontransitionend]:hover {
          color: black;
        }
      </style>
      <div ontransitionend="console.log('xss');">XSS Attack</div>
    `);
      const tree = renderer.create(<div>{dom}</div>).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('should warn the user about potential XSS attack', () => {
      const instance = new SafelySetInnerHTML({
        ALLOWED_TAGS: ['div'],
        ALLOWED_ATTRIBUTES: ['ontransitionend']
      });

      instance.transform('<div ontransitionend="alert(true)">Warn me !</div>');

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('cache', () => {
    let cacheInstance = new SafelySetInnerHTML();
    let cacheStr = 'Hello <strong>Cache !</strong>';
    let generateDomSpy;

    beforeEach(() => {
      generateDomSpy = jest.spyOn(cacheInstance, 'generateDom');
    });

    afterEach(() => {
      generateDomSpy.mockReset();
      generateDomSpy.mockRestore();
    });

    it('should render normally and store in cache', () => {
      cacheInstance.transform(cacheStr);
      const [cachedString] = cacheInstance.cache;

      expect(cacheInstance.cache).toHaveLength(1);
      expect(cachedString.str).toEqual(cacheStr);
      expect(cacheInstance.generateDom).toHaveBeenCalled();
    });

    it('should retrieve dom from cache and prevent dom regeneration', () => {
      cacheInstance.transform(cacheStr);
      const [cachedString] = cacheInstance.cache;

      expect(cacheInstance.cache).toHaveLength(1);
      expect(cachedString.str).toEqual(cacheStr);
      expect(cacheInstance.generateDom).not.toHaveBeenCalled();
    });
  });

  describe('configuration file', () => {
    it('should render normally', () => {
      const dom = mySafelySetInnerHTML('Configuration <strong>File !</strong>');
      const tree = renderer.create(<p>{dom}</p>).toJSON();

      expect(tree).toMatchSnapshot();
    })
  });

  describe('empty elements', () => {
    it('should render br', () => {
      const instance = new SafelySetInnerHTML({ ALLOWED_TAGS: ['br'] });
      const dom = instance.transform('Hello <br /> there');
      const tree = renderer.create(<p>{dom}</p>).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('should render input', () => {
      const instance = new SafelySetInnerHTML({ ALLOWED_TAGS: ['input'] });
      const dom = instance.transform('<input type="text" />');
      const tree = renderer.create(<p>{dom}</p>).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
