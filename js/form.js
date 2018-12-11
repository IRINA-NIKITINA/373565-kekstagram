'use strict';

(function () {
  var MAX_EFFECT = 3;
  var MIN_EFFECT = 1;
  var MAX_PERCENT = 100;

  var pictures = document.querySelector('.pictures');
  var imgUploadPreview = pictures.querySelector('.img-upload__preview').children[0];
  var effectsRadio = pictures.querySelectorAll('.effects__radio');
  var hashTagsInput = document.querySelector('.text__hashtags');

  // upload and edit pictures
  function uploadAndEditPictures() {
    var effectLevelPin = pictures.querySelector('.effect-level__pin');
    var effectLevelLine = pictures.querySelector('.effect-level__line');
    var depth = pictures.querySelector('.effect-level__depth');
    var effectLevelValue = pictures.querySelector('.effect-level__value');

    var getWidthPin = function (pin) {
      return pin.right - pin.left;
    };

    var getLine = function () {
      return effectLevelLine.getBoundingClientRect();
    };

    var getPin = function () {
      return effectLevelPin.getBoundingClientRect();
    };

    var getActiveRadio = function () {
      for (var i = 0; i < effectsRadio.length; i++) {
        if (effectsRadio[i].checked) {
          return effectsRadio[i];
        }
      }
      return null;
    };

    var getEffectLevelValue = function () {
      var centerPin = getPin().left + getWidthPin(getPin()) / 2;

      return Math.round((centerPin - getLine().left) * MAX_PERCENT / (getLine().right - getLine().left));
    };

    effectLevelPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX
        };

        startCoords = {
          x: moveEvt.clientX
        };

        var coords = effectLevelPin.offsetLeft - shift.x;

        if (coords > 0 && coords < (getLine().right - getLine().left)) {
          effectLevelPin.style.left = coords + 'px';
          depth.style.width = getEffectLevelValue() + '%';
        }
        effectLevelValue.setAttribute('value', getEffectLevelValue());
        addFilter(effectLevelValue.value);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        effectLevelValue.setAttribute('value', getEffectLevelValue());
        addFilter(effectLevelValue.value);

        pictures.removeEventListener('mousemove', onMouseMove);
        pictures.removeEventListener('mouseup', onMouseUp);
      };

      pictures.addEventListener('mousemove', onMouseMove);
      pictures.addEventListener('mouseup', onMouseUp);
    });

    var addFilter = function (effectLevel) {
      var effect = getActiveRadio().value;

      if (effect === 'chrome') {
        imgUploadPreview.style.filter = 'grayscale(' + effectLevel / MAX_PERCENT + ')';
      } else if (effect === 'sepia') {
        imgUploadPreview.style.filter = 'sepia(' + effectLevel / MAX_PERCENT + ')';
      } else if (effect === 'marvin') {
        imgUploadPreview.style.filter = 'invert(' + effectLevel + '%)';
      } else if (effect === 'phobos') {
        imgUploadPreview.style.filter = 'blur(' + effectLevel / MAX_PERCENT * MAX_EFFECT + 'px)';
      } else if (effect === 'heat') {
        imgUploadPreview.style.filter = 'brightness(' + (effectLevel / MAX_PERCENT * (MAX_EFFECT - MIN_EFFECT) + MIN_EFFECT) + ')';
      }
    };

    var onAddEffectsPreview = function (effectRadio, effectName) {
      effectRadio.addEventListener('click', function () {

        for (var i = 0; i < effectsRadio.length; i++) {
          imgUploadPreview.classList.remove('effects__preview--' + effectsRadio[i].value);
          imgUploadPreview.style = null;
        }

        imgUploadPreview.classList.add('effects__preview--' + effectName);

        if (effectName === 'none') {
          document.querySelector('.effect-level').classList.add('hidden');
        } else {
          document.querySelector('.effect-level').classList.remove('hidden');
          effectLevelPin.style.left = (getLine().right - getLine().left) + 'px';
          depth.style.width = MAX_PERCENT + '%';
          effectLevelValue.setAttribute('value', MAX_PERCENT);
          addFilter(effectLevelValue.value);
        }
      });
    };

    for (var i = 0; i < effectsRadio.length; i++) {
      onAddEffectsPreview(effectsRadio[i], effectsRadio[i].value + '');
    }
  }

  // form validation
  function validForm() {
    var submitButton = document.querySelector('#upload-submit');
  
    submitButton.addEventListener('click', function () {
      var hashTags = hashTagsInput.value.split(/[\s]+/);

      for (var i = 0; i < hashTags.length; i++) {
        var tag = hashTags[i];

        if (tag !== '') {
          var count = 0;
          for (var y = 0; y < hashTags.length; y++) {
            if (tag.toLowerCase() === hashTags[y].toLowerCase()) {
              count++;
            }
          }

          if (tag.charAt(0) !== '#') {
            hashTagsInput.setCustomValidity('Тег должен начинаться с символа #');
            break;
          } else if (tag === '#') {
            hashTagsInput.setCustomValidity('Тег не должен состоять из одного символа #');
            break;
          } else if (tag.lastIndexOf('#') > 0) {
            hashTagsInput.setCustomValidity('Теги должны разделяться пробелами');
            break;
          } else if (hashTags.length > 5) {
            hashTagsInput.setCustomValidity('Нельзя указывать больше пяти хэш-тегов');
            break;
          } else if (tag.length > 20) {
            hashTagsInput.setCustomValidity('Максимальная длина хэш-тега 20 символов, включая #');
            break;
          } else if (count > 1) {
            hashTagsInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
            break;
          } else {
            hashTagsInput.setCustomValidity('');
          }
        }
      }
    });

    hashTagsInput.addEventListener('input', function (evt) {
      var target = evt.target;
      target.setCustomValidity('');
    });
  }

  // some keyboard&mouse shortcuts to upload
  function uploadKeyAndMouseBindings() {
    var uploadFile = pictures.querySelector('#upload-file');
    var imgUploadOverlay = pictures.querySelector('.img-upload__overlay');
    var uploadCancel = pictures.querySelector('#upload-cancel');

    var onPopupEscPress = function (evt) {
      if (hashTagsInput !== document.activeElement) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          closePopup();
        }
      }
    };

    var openPopup = function () {
      imgUploadOverlay.classList.remove('hidden');
      imgUploadOverlay.querySelector('#effect-none').checked = true;

      if (imgUploadPreview.classList.value !== '') {
        imgUploadPreview.classList.remove(imgUploadPreview.classList.value);
      }

      imgUploadPreview.classList.add('effects__preview--none');
      imgUploadOverlay.querySelector('.effect-level').classList.add('hidden');
      imgUploadPreview.style = null;

      document.addEventListener('keydown', onPopupEscPress);
    };

    var closePopup = function () {
      imgUploadOverlay.classList.add('hidden');
      uploadFile.value = null;
      document.removeEventListener('keydown', onPopupEscPress);
    };

    uploadFile.addEventListener('change', openPopup);

    uploadCancel.addEventListener('click', closePopup);

    uploadCancel.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        closePopup();
      }
    });
  }

  uploadAndEditPictures();
  uploadKeyAndMouseBindings();
  validForm();
})()
