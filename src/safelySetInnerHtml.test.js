import React from 'react';
import renderer from 'react-test-renderer';
import SafelySetInnerHtml from './safelySetInnerHtml';

describe('safelySetInnerHtml', () => {
  it('renders correctly', () => {
    const instance = new SafelySetInnerHtml();

    const dom = instance.transform('Hello <strong>World !</strong>');
    const tree = renderer.create(<p>{dom}</p>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders only allowedTags', () => {
    const instance = new SafelySetInnerHtml({ ALLOWED_TAGS: [] });

    const dom = instance.transform('Hello <strong>World !</strong>');
    const tree = renderer.create(<p>{dom}</p>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const instance = new SafelySetInnerHtml();

    const dom = instance.transform('About the <a href="http://example.com">Author !</a>');
    const tree = renderer.create(<cite>{dom}</cite>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
