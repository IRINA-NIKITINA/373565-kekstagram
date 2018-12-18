'use strict';

(function () {
  var successLoadMessage = function () {
    if (document.querySelector('.success') !== null) {
      document.querySelector('.success').classList.remove('visually-hidden');
    } else {
      var template = document.querySelector('#success').content.querySelector('section');
      var element = template.cloneNode(true);
      document.querySelector('main').appendChild(element);
    }
  };

  var errorLoadMessage = function () {
    if (document.querySelector('.error') !== null) {
      document.querySelector('.error').classList.remove('visually-hidden');
    } else {
      var template = document.querySelector('#error').content.querySelector('section');
      var element = template.cloneNode(true);
      document.querySelector('main').appendChild(element);
    }
  };

  // close message
  var closeSuccessMessage = function () {
    var successMessage = document.querySelector('.success');
    var successButton = successMessage.querySelector('.success__button');

    var addEsc = function () {
      document.addEventListener('keydown', onMessageEscPress);
    };

    var onMessageEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closeMessage();
      }
    };

    var closeMessage = function () {
      successMessage.classList.add('visually-hidden');
      document.removeEventListener('keydown', onMessageEscPress);
    };

    successButton.addEventListener('click', closeMessage);

    successButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        closeMessage();
      }
    });

    document.querySelector('body').addEventListener('click', closeMessage);

    addEsc();
  };

  var closeErrorMessage = function () {
    var errorMessage = document.querySelector('.error');
    var errorButtons = errorMessage.querySelectorAll('.error__button');

    var addEsc = function () {
      document.addEventListener('keydown', onMessageEscPress);
    };

    var onMessageEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closeMessage();
      }
    };

    var closeMessage = function () {
      errorMessage.classList.add('visually-hidden');
      document.removeEventListener('keydown', onMessageEscPress);
    };

    errorButtons.forEach(function (errorButton) {
      errorButton.addEventListener('click', closeMessage);

      errorButton.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ENTER_KEYCODE) {
          closeMessage();
        }
      });
    });

    document.querySelector('body').addEventListener('click', closeMessage);

    addEsc();
  };

  window.messages = {
    successLoadMessage: successLoadMessage,
    errorLoadMessage: errorLoadMessage,
    closeSuccessMessage: closeSuccessMessage,
    closeErrorMessage: closeErrorMessage
  };
})();
