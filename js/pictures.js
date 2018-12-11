'use strict';

(function () {
  var COUNT_PHOTOS = 25;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENTS = 1;
  var MAX_COMMENTS = 2;

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

  // generating pictures dom elements and pushing them to .pictures element

  var getRandomItemsFromArray = function (arrAll) {
    var arr = [];
    var countComments = window.util.getRandInRange(MIN_COMMENTS, MAX_COMMENTS);
    for (var i = 0; i < countComments; i++) {
      arr.push(arrAll[window.util.getRandInRange(0, arrAll.length - 1)]);
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
      'likes': window.util.getRandInRange(MIN_LIKES, MAX_LIKES),
      'comments': getRandomItemsFromArray(testCommentsAll),
      'description': testDescriptions[window.util.getRandInRange(0, testDescriptions.length - 1)]
    };

    photos.push(photo);
  }

  addPictures(generatePictures(template, photos), pictures);

  window.pictures = {
    photos: photos
  };
})();
