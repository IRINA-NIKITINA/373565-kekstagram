'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500; // ms

  var lastTimeout;
  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

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
    onError: onError,
    debounce: debounce
  };
})();
