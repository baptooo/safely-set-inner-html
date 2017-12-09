const XSS_ATTACK = 'Be careful with the use of %s, it presents a potential XSS risk';

export const messages = {
  attributes: {
    ontransitionend: XSS_ATTACK,
    ontransitioncancel: XSS_ATTACK,
    onblur: XSS_ATTACK,
    ondrag: XSS_ATTACK,
    ondrop: XSS_ATTACK,
  },
  tags: {
    script: XSS_ATTACK,
    style: XSS_ATTACK,
  }
};

export default function(attributeOrTag) {
  if (attributeOrTag in messages.attributes) {
    console.warn(messages.attributes[attributeOrTag].replace('%s', `attribute ${attributeOrTag}`));
  }

  if (attributeOrTag in messages.tags) {
    console.warn(messages.tags[attributeOrTag].replace('%s', `tag <${attributeOrTag} />`));
  }
}
