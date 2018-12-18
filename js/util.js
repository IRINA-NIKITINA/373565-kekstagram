'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var getRandInRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var onError = function () {
    window.messages.errorLoadMessage();
    window.messages.closeErrorMessage();
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    getRandInRange: getRandInRange,
    onError: onError
  };
})();
