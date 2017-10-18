/**
 * This is the entry point for the library
 *
 * @author Wolfgang Stöttinger
 */

import $ from 'jquery';
import generatePlugin from './generate-plugin';
import EmojiArea from 'EmojiArea';
import EmojiStyleGenerator from 'EmojiStyleGenerator'

generatePlugin('emojiarea', EmojiArea);

/**
 * call auto initialization. This can be supresst by setting the static EmojiArea.AUTOINIT parameter to false
 */
$(() => {
  if (EmojiArea.AUTOINIT) {
    $('[data-emojiarea]').emojiarea();
  }
  if (EmojiArea.INJECT_STYLES) {
    EmojiStyleGenerator.injectImageStyles(EmojiArea.DEFAULTS);
  }
});

// expose EmojiArea
module.exports = EmojiArea;