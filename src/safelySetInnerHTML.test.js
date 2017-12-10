import React from 'react';
import renderer from 'react-test-renderer';
import SafelySetInnerHTML from './safelySetInnerHTML';

jest.spyOn(console, 'warn');

describe('SafelySetInnerHTML', () => {
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
