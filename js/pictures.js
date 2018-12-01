'use strict';

// initializing data&constants
var COUNT_PHOTOS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 2;
var MIN_AVATARS = 1;
var MAX_AVATARS = 6;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MAX_EFFECT = 3;
var MIN_EFFECT = 1;
var MAX_PERCENT = 100;
var photos = [];
var testCommentsAll = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var testDescriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

// getting main element
var pictures = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');

// some global function
var getRandInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// generating pictures dom elements and pushing them to .pictures element
function generateAndAddPictures() {
  var getRandomItemsFromArray = function (arrAll) {
    var arr = [];
    var countComments = getRandInRange(MIN_COMMENTS, MAX_COMMENTS);
    for (var i = 0; i < countComments; i++) {
      arr.push(arrAll[getRandInRange(0, arrAll.length - 1)]);
    }
    return arr;
  };

  var generatePictures = function (templ, arr) {
    var elements = [];
    for (var i = 0; i < COUNT_PHOTOS; i++) {
      var element = templ.cloneNode(true);
      element.querySelector('.picture__img').src = arr[i].url;
      element.querySelector('.picture__likes').textContent = arr[i].likes + '';
      element.querySelector('.picture__comments').textContent = arr[i].comments.length + '';
      elements.push(element);
    }
    return elements;
  };

  var addPictures = function (arr, block) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(arr[i]);
    }
    block.appendChild(fragment);
  };

  for (var i = 1; i <= COUNT_PHOTOS; i++) {
    var photo = {
      'url': 'photos/' + i + '.jpg',
      'likes': getRandInRange(MIN_LIKES, MAX_LIKES),
      'comments': getRandomItemsFromArray(testCommentsAll),
      'description': testDescriptions[getRandInRange(0, testDescriptions.length - 1)]
    };

    photos.push(photo);
  }

  var template = document.querySelector('#picture').content.querySelector('a');

  addPictures(generatePictures(template, photos), pictures);
}

// fill big picture
function fillBigPicture(picture) {
  bigPicture.querySelector('.big-picture__img').children[0].src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes + '';
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length + '';

  var pools = bigPicture.querySelectorAll('.social__comment');
  for (var y = 0; y < picture.comments.length; y++) {
    if (picture.comments.length === 1) {
      pools[1].classList.add('visually-hidden');
    } else {
      pools[1].classList.remove('visually-hidden');
    }
    pools[y].querySelector('.social__picture').src = 'img/avatar-' + getRandInRange(MIN_AVATARS, MAX_AVATARS) + '.svg';
    pools[y].querySelector('.social__text').textContent = picture.comments[y];
  }

  bigPicture.querySelector('.social__caption').textContent = picture.description;
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
}

// upload and edit pictures
function uploadAndEditPictures() {
  var effectLevelPin = pictures.querySelector('.effect-level__pin');

  var getActiveRadio = function () {
    for (var i = 0; i < effectsRadio.length; i++) {
      if (effectsRadio[i].checked) {
        return effectsRadio[i];
      }
    }
    return null;
  };

  var getEffectLevelValue = function () {
    var effectLevelLine = pictures.querySelector('.effect-level__line');
    var line = effectLevelLine.getBoundingClientRect();
    var pin = effectLevelPin.getBoundingClientRect();
    var centerPin = pin.left + ((pin.right - line.left) - (pin.left - line.left)) / 2;

    return Math.round((centerPin - line.left) * MAX_PERCENT / (line.right - line.left));
  };

  effectLevelPin.addEventListener('mouseup', function () {
    var effectLevelValue = pictures.querySelector('.effect-level__value');
    effectLevelValue = getEffectLevelValue();

    var effect = getActiveRadio().value;
    if (effect === 'chrome') {
      imgUploadPreview.style.filter = 'grayscale(' + effectLevelValue / MAX_PERCENT + ')';
    } else if (effect === 'sepia') {
      imgUploadPreview.style.filter = 'sepia(' + effectLevelValue / MAX_PERCENT + ')';
    } else if (effect === 'marvin') {
      imgUploadPreview.style.filter = 'invert(' + effectLevelValue + '%)';
    } else if (effect === 'phobos') {
      imgUploadPreview.style.filter = 'blur(' + effectLevelValue / MAX_PERCENT * MAX_EFFECT + 'px)';
    } else if (effect === 'heat') {
      imgUploadPreview.style.filter = 'brightness(' + effectLevelValue / MAX_PERCENT * MAX_EFFECT + MIN_EFFECT + ')';
    }
  });

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
      }
    });
  };

  var imgUploadPreview = pictures.querySelector('.img-upload__preview').children[0];
  var effectsRadio = pictures.querySelectorAll('.effects__radio');

  for (var i = 0; i < effectsRadio.length; i++) {
    onAddEffectsPreview(effectsRadio[i], effectsRadio[i].value + '');
  }
}

// form validation
function validForm() {
  var submitButton = document.querySelector('#upload-submit');

  submitButton.addEventListener('click', function(evt){
    var hashTagsInput = document.querySelector('.text__hashtags');
    var hashTags = hashTagsInput.value.split(' ');

    for (var i = 0; i < hashTags.length; i++){
      var tag = hashTags[i];

      var count = 0;
      for (var y = 0; y < hashTags.length; y++) {
        if (hashTags[i].toLowerCase() === hashTags[y].toLowerCase()) {
          count++;
        }
      }

      if (tag.charAt(0) !== '#') {
        hashTagsInput.setCustomValidity('Тег должен начинаться с символа #');
      } else if (tag === '#') {
        hashTagsInput.setCustomValidity('Тег не должен состоять из одного символа #');
      } else if (tag.lastIndexOf('#') > 0) {
        hashTagsInput.setCustomValidity('Теги должны разделяться пробелами');
      } else if (hashTags.length > 5) {
        hashTagsInput.setCustomValidity('Нельзя указывать больше пяти хэш-тегов');
      } else if (hashTags[i].length > 20) {
        hashTagsInput.setCustomValidity('Максимальная длина хэш-тега 20 символов, включая #');
      } else if (count > 1) {
        hashTagsInput.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      } else {
        hashTagsInput.setCustomValidity('');
      }
    }
  });
}

// some keyboard&mouse shortcuts to upload
function uploadKeyAndMouseBindings() {
  var uploadFile = pictures.querySelector('#upload-file');
  var imgUploadOverlay = pictures.querySelector('.img-upload__overlay');
  var uploadCancel = pictures.querySelector('#upload-cancel');
  var hashTagsInput = document.querySelector('.text__hashtags');
  
  var onPopupEscPress = function (evt) {
    if (hashTagsInput !== document.activeElement){
      if (evt.keyCode === ESC_KEYCODE) {
        closePopup();
      }
    }
  };

  var openPopup = function () {
    imgUploadOverlay.classList.remove('hidden');
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
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup();
    }
  });
}

// some keyboard&mouse shortcuts to big picture
function bigPictureKeyAndMouseBindings() {
  var bigPictureCancel = bigPicture.querySelector('#picture-cancel');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function (index) {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
    fillBigPicture(photos[index]);
  };

  var closePopup = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  bigPictureCancel.addEventListener('click', closePopup);

  bigPictureCancel.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup();
    }
  });

  var onFillBigPictureClick = function (picture, index) {
    picture.addEventListener('click', function () {
      openPopup(index);
    });
  };

  var onFillBigPictureEnter = function (picture, index) {
    picture.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        openPopup(index);
      }
    });
  };

  var arrPictures = pictures.querySelectorAll('.picture');

  for (var i = 0; i < arrPictures.length; i++) {
    onFillBigPictureClick(arrPictures[i], i);
    onFillBigPictureEnter(arrPictures[i], i);
  }
}

// main
generateAndAddPictures();
uploadAndEditPictures();
uploadKeyAndMouseBindings();
bigPictureKeyAndMouseBindings();
validForm();
