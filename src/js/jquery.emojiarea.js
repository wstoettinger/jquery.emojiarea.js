

import $ from 'jquery';
import generatePlugin from './generate-plugin';
import EmojiArea from 'EmojiArea';

generatePlugin('emojiarea', EmojiArea);

/**
 * call auto initialization. This can be supresst by setting the static EmojiArea.AUTOINIT parameter to false
 */
$(() => {
  if (EmojiArea.AUTOINIT) {
    $('[data-emojiarea]').emojiarea();
  }
  if (EmojiArea.INJECT_STYLES) {
    EmojiArea.injectImageStyles();
  }
});