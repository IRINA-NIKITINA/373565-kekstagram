"use strict";

(function() {
  var MAX_EFFECT = 3;
  var MIN_EFFECT = 1;
  var MAX_PERCENT = 100;
  var STEP = 25;

  var pictures = document.querySelector('.pictures');
  var form = document.querySelector('.img-upload__form');
  var imgUploadOverlay = pictures.querySelector('.img-upload__overlay');
  var imgUploadPreview = pictures.querySelector('.img-upload__preview').children[0];
  var effectsRadio = pictures.querySelectorAll('.effects__radio');

  var hashTagsInput = document.querySelector('.text__hashtags');
  var description = document.querySelector('.text__description');

  var effectLevelPin = pictures.querySelector('.effect-level__pin');
  var effectLevelLine = pictures.querySelector('.effect-level__line');
  var depth = pictures.querySelector('.effect-level__depth');
  var effectLevelValue = pictures.querySelector('.effect-level__value');

  var scale = pictures.querySelector('.scale__control--value');
  var scaleControlSmaller = pictures.querySelector('.scale__control--smaller');
  var scaleControlBigger = pictures.querySelector('.scale__control--bigger');

  // upload and edit pictures
  scaleControlSmaller.addEventListener('click', function () {
    var number = scale.value.substring(0, scale.value.length - 1);
    if (number > STEP) {
      scale.setAttribute('value', (number - STEP) + '%');
      addTransform(number - STEP);
    }
  });

  scaleControlBigger.addEventListener('click', function () {
    var number = scale.value.substring(0, scale.value.length - 1);
    if (number < MAX_PERCENT) {
      scale.setAttribute('value', Number.parseInt(number, 10) + STEP + '%');
      addTransform(Number.parseInt(number, 10) + STEP);
    }
  });

  var addTransform = function (valueScale) {
    imgUploadPreview.style.transform = 'scale(' + valueScale / MAX_PERCENT + ')';
  };

  var getWidthPin = function (pin) {
    return pin.right - pin.left;
  };

  var getLine = function() {
    return effectLevelLine.getBoundingClientRect();
  };

  var getPin = function() {
    return effectLevelPin.getBoundingClientRect();
  };

  var getActiveRadio = function() {
    for (var i = 0; i < effectsRadio.length; i++) {
      if (effectsRadio[i].checked) {
        return effectsRadio[i];
      }
    }
    return null;
  };

  var getEffectLevelValue = function() {
    var centerPin = getPin().left + getWidthPin(getPin()) / 2;

    return Math.round(
      ((centerPin - getLine().left) * MAX_PERCENT) /
        (getLine().right - getLine().left)
    );
  };

  effectLevelPin.addEventListener("mousedown", function(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var coords = effectLevelPin.offsetLeft - shift.x;

      if (coords > 0 && coords < getLine().right - getLine().left) {
        effectLevelPin.style.left = coords + "px";
        depth.style.width = getEffectLevelValue() + "%";
      }
      effectLevelValue.setAttribute("value", getEffectLevelValue());
      addFilter(effectLevelValue.value);
    };

    var onMouseUp = function(upEvt) {
      upEvt.preventDefault();

      effectLevelValue.setAttribute("value", getEffectLevelValue());
      addFilter(effectLevelValue.value);

      pictures.removeEventListener("mousemove", onMouseMove);
      pictures.removeEventListener("mouseup", onMouseUp);
    };

    pictures.addEventListener("mousemove", onMouseMove);
    pictures.addEventListener("mouseup", onMouseUp);
  });

  var addFilter = function(effectLevel) {
    var effect = getActiveRadio().value;

    if (effect === "chrome") {
      imgUploadPreview.style.filter =
        "grayscale(" + effectLevel / MAX_PERCENT + ")";
    } else if (effect === "sepia") {
      imgUploadPreview.style.filter =
        "sepia(" + effectLevel / MAX_PERCENT + ")";
    } else if (effect === "marvin") {
      imgUploadPreview.style.filter = "invert(" + effectLevel + "%)";
    } else if (effect === "phobos") {
      imgUploadPreview.style.filter =
        "blur(" + (effectLevel / MAX_PERCENT) * MAX_EFFECT + "px)";
    } else if (effect === "heat") {
      imgUploadPreview.style.filter =
        "brightness(" +
        ((effectLevel / MAX_PERCENT) * (MAX_EFFECT - MIN_EFFECT) + MIN_EFFECT) +
        ")";
    }
  };

  var onAddEffectsPreview = function(effectRadio, effectName) {
    effectRadio.addEventListener("click", function() {
      for (var i = 0; i < effectsRadio.length; i++) {
        imgUploadPreview.classList.remove(
          "effects__preview--" + effectsRadio[i].value
        );
        imgUploadPreview.style = null;
      }

      imgUploadPreview.classList.add("effects__preview--" + effectName);

      if (effectName === "none") {
        document.querySelector(".effect-level").classList.add("hidden");
      } else {
        document.querySelector('.effect-level').classList.remove('hidden');
        effectLevelPin.style.left = getLine().right - getLine().left + 'px';
        depth.style.width = MAX_PERCENT + '%';
        effectLevelValue.setAttribute('value', MAX_PERCENT);
        addFilter(effectLevelValue.value);
      }
    });
  };

  var addEffectRadioClick = function () {
    scale.setAttribute('value', MAX_PERCENT + '%');
    for (var i = 0; i < effectsRadio.length; i++) {
      onAddEffectsPreview(effectsRadio[i], effectsRadio[i].value + "");
    }
  };

  // form validation
  var submitButton = document.querySelector("#upload-submit");
  var coordX = effectLevelPin.style.left;
  var effectRadioActive = getActiveRadio();
  var valueEffect = pictures.querySelector('.effect-level__value').value;

  var validHashTags = function() {
    var hashTags = hashTagsInput.value.split(/[\s]+/);

    for (var i = 0; i < hashTags.length; i++) {
      var tag = hashTags[i];

      if (tag !== "") {
        var count = 0;
        for (var y = 0; y < hashTags.length; y++) {
          if (tag.toLowerCase() === hashTags[y].toLowerCase()) {
            count++;
          }
        }

        if (tag.charAt(0) !== '#') {
          hashTagsInput.setCustomValidity('Тег должен начинаться с символа #');
          return false;
        } else if (tag === '#') {
          hashTagsInput.setCustomValidity('Тег не должен состоять из одного символа #');
          return false;
        } else if (tag.lastIndexOf('#') > 0) {
          hashTagsInput.setCustomValidity('Теги должны разделяться пробелами');
          return false;
        } else if (hashTags.length > 5) {
          hashTagsInput.setCustomValidity('Нельзя указывать больше пяти хэш-тегов');
          return false;
        } else if (tag.length > 20) {
          hashTagsInput.setCustomValidity('Максимальная длина хэш-тега 20 символов, включая #');
          return false;
        } else if (count > 1) {
          hashTagsInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
          return false;
        } else {
          hashTagsInput.setCustomValidity("");
        }
      }
    }
    return true;
  };

  hashTagsInput.addEventListener("invalid", function() {
    hashTagsInput.style.border = "2px solid red";
  });

  hashTagsInput.addEventListener("input", function(evt) {
    var target = evt.target;
    target.setCustomValidity("");
    hashTagsInput.style.border = "none";
  });

  submitButton.addEventListener("click", function(evt) {
    if (validHashTags()) {
      evt.preventDefault();
    }
    window.backend.save(new FormData(form), onLoad, window.util.onError);
  });

  var clearForm = function() {
    effectRadioActive.checked = true;

    if (imgUploadPreview.classList.value !== "") {
      imgUploadPreview.classList.remove(imgUploadPreview.classList.value);
    }

    imgUploadPreview.classList.add(
      "effects__preview--" + effectRadioActive.value
    );
    imgUploadPreview.style = null;

    effectLevelPin.style.left = coordX;
    effectLevelValue.setAttribute("value", valueEffect);
    addFilter(effectLevelValue.value);

    depth.style.width = effectLevelValue.value + '%';
    hashTagsInput.value = '';
    hashTagsInput.style.border = 'none';
    description.value = '';
    scale.setAttribute('value', MAX_PERCENT + '%');
  };

  var onLoad = function() {
    imgUploadOverlay.classList.add("hidden");
    clearForm();
    window.messages.successLoadMessage();
    window.messages.closeSuccessMessage();
  };

  // open-close upload
  var uploadFile = pictures.querySelector("#upload-file");
  var uploadCancel = pictures.querySelector("#upload-cancel");

  var onPopupEscPress = function(evt) {
    if (
      hashTagsInput !== document.activeElement &&
      description !== document.activeElement
    ) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closePopup();
      }
    }
  };

  var openPopup = function() {
    imgUploadOverlay.classList.remove("hidden");
    document.addEventListener("keydown", onPopupEscPress);
  };

  var closePopup = function() {
    imgUploadOverlay.classList.add("hidden");
    uploadFile.value = null;
    clearForm();
    document.removeEventListener("keydown", onPopupEscPress);
  };

  uploadFile.addEventListener("change", openPopup);

  uploadCancel.addEventListener("click", closePopup);

  uploadCancel.addEventListener("keydown", function(evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      closePopup();
    }
  });

  addEffectRadioClick();
})();
