'use strict';

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

var pictures = document.querySelector('.pictures');
var template = document.querySelector('#picture').content.querySelector('a');
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancel = bigPicture.querySelector('#picture-cancel');
var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancel = document.querySelector('#upload-cancel');
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelValue = document.querySelector('.effect-level__value');
var effectLevelLine = document.querySelector('.effect-level__line');
var imgUploadPreview = document.querySelector('.img-upload__preview').children[0];
var effectsRadio = document.querySelectorAll('.effects__radio');

var getRandInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomItemsFromArray = function (arrAll) {
  var arr = [];
  var countComments = getRandInRange(MIN_COMMENTS, MAX_COMMENTS);
  for (var i = 0; i < countComments; i++) {
    arr.push(arrAll[getRandInRange(0, arrAll.length - 1)]);
  }
  return arr;
};

var renderPictures = function (templ, arr) {
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

var addElementFromPhotos = function () {
  for (var i = 1; i <= COUNT_PHOTOS; i++) {
    var photo = {
      'url': 'photos/' + i + '.jpg',
      'likes': getRandInRange(MIN_LIKES, MAX_LIKES),
      'comments': getRandomItemsFromArray(testCommentsAll),
      'description': testDescriptions[getRandInRange(0, testDescriptions.length - 1)]
    };

    photos.push(photo);
  }
};

var fillBigPicture = function (picture) {
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
  var line = effectLevelLine.getBoundingClientRect();
  var pin = effectLevelPin.getBoundingClientRect();
  var centerPin = pin.left + ((pin.right - line.left) - (pin.left - line.left)) / 2;

  return Math.round((centerPin - line.left) * MAX_PERCENT / (line.right - line.left));
};

var openPopup = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  if (getActiveRadio.value === 'none') {
    document.querySelector('.effect-level').classList.add('hidden');
}
};

uploadFile.addEventListener('change', function () {
  openPopup();
});

uploadFile.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openPopup();
  }
});

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  imgUploadOverlay.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
};

uploadCancel.addEventListener('click', function () {
  closePopup();
});

uploadCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

var onBigPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPopup();
  }
};

var openBigPopup = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPopupEscPress);
};

var closeBigPopup = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPopup();
});

bigPictureCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeBigPopup();
  }
});

effectLevelPin.addEventListener('mouseup', function () {
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

var addEffectsPreview = function () {
  for (var i = 0; i < effectsRadio.length; i++) {
    onAddEffectsPreview(effectsRadio[i], effectsRadio[i].value + '');
  }
};

var onFillBigPictureClick = function (picture, index) {
  picture.addEventListener('click', function () {
    openBigPopup();
    fillBigPicture(photos[index]);
  });
};

var onFillBigPictureEnter = function (picture, index) {
  picture.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openBigPopup();
      fillBigPicture(photos[index]);
    }
  });
};

var fillBigPictureFromArray = function () {
  var arrPictures = pictures.querySelectorAll('.picture');
  for (var i = 0; i < arrPictures.length; i++) {
    onFillBigPictureClick(arrPictures[i], i);
    onFillBigPictureEnter(arrPictures[i], i);
  }
};

addElementFromPhotos();
addPictures(renderPictures(template, photos), pictures);
addEffectsPreview();
fillBigPictureFromArray();
