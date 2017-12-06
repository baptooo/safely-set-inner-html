import React from 'react';
import renderer from 'react-test-renderer';
import safelySetInnerHtml, { config } from './safelySetInnerHtml';

const defaultConfig = { ...config };

describe('safelySetInnerHtml', () => {
  beforeEach(() => {
    Object.assign(config, defaultConfig);
  });

  it('renders correctly', () => {
    const dom = safelySetInnerHtml('Hello <strong>World !</strong>');
    const tree = renderer.create(<p>{dom}</p>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders only allowedTags', () => {
    config.ALLOWED_TAGS = [];

    const dom = safelySetInnerHtml('Hello <strong>World !</strong>');
    const tree = renderer.create(<p>{dom}</p>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const dom = safelySetInnerHtml('About the <a href="http://example.com">Author !</a>');
    const tree = renderer.create(<cite>{dom}</cite>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
