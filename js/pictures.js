'use strict';

var COUNT_PHOTOS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 2;
var MIN_AVATARS = 1;
var MAX_AVATARS = 6;
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

for (var i = 1; i <= COUNT_PHOTOS; i++) {
  var photo = {
    'url': 'photos/' + i + '.jpg',
    'likes': getRandInRange(MIN_LIKES, MAX_LIKES),
    'comments': getRandomItemsFromArray(testCommentsAll),
    'description': testDescriptions[getRandInRange(0, testDescriptions.length - 1)]
  };

  photos.push(photo);
}

var pictures = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();
var template = document.querySelector('#picture').content.querySelector('a');

for (var y = 0; y < COUNT_PHOTOS; y++) {
  var element = template.cloneNode(true);
  element.querySelector('.picture__img').src = photos[y].url;
  element.querySelector('.picture__likes').textContent = photos[y].likes + '';
  element.querySelector('.picture__comments').textContent = photos[y].comments.length + '';

  fragment.appendChild(element);
}

pictures.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

bigPicture.querySelector('.big-picture__img').children[0].src = photos[0].url;
bigPicture.querySelector('.likes-count').textContent = photos[0].likes + '';
bigPicture.querySelector('.comments-count').textContent = photos[0].comments.length + '';

var pools = bigPicture.querySelectorAll('.social__comment');
for (var k = 0; k < photos[0].comments.length; k++) {
  pools[k].querySelector('.social__picture').src = 'img/avatar-' + getRandInRange(MIN_AVATARS, MAX_AVATARS) + '.svg';
  pools[k].querySelector('.social__text').textContent = photos[0].comments[k];
  if (photos[0].comments.length === 1) {
    bigPicture.querySelector('.social__comments').removeChild(pools[1]);
  }
}

bigPicture.querySelector('.social__caption').textContent = photos[0].description;
bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
