'use strict';

var COUNT_PHOTOS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var photos = [];

var getTestComments = function () {
  var arrAll = [];
  arrAll.push('Всё отлично!');
  arrAll.push('В целом всё неплохо. Но не всё.');
  arrAll.push('Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.');
  arrAll.push('Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.');
  arrAll.push('Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.');
  arrAll.push('Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!');

  var arr = [];
  var countComments = Math.round(Math.random() * 1 + 1);
  for (var i = 0; i < countComments; i++) {
    arr.push(arrAll[Math.round(Math.random() * 5)]);
  }
  return arr;
};

var getTestDescriptions = function () {
  var arr = [];
  arr.push('Тестим новую камеру!');
  arr.push('Затусили с друзьями на море');
  arr.push('Как же круто тут кормят');
  arr.push('Отдыхаем...');
  arr.push('Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......');
  arr.push('Вот это тачка!');

  return arr[Math.round(Math.random() * 5)];
};

for (var i = 1; i <= COUNT_PHOTOS; i++) {
  var photo = {
    'url': 'photos/' + i + '.jpg',
    'likes': Math.round(Math.random() * (MAX_LIKES - MIN_LIKES) + MIN_LIKES),
    'comments': getTestComments(),
    'description': getTestDescriptions()
  };
  photos.push(photo);
}

var pictures = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();
var template = document.querySelector('#picture').content.querySelector('a');

for (var i = 0; i < COUNT_PHOTOS; i++) {
  var element = template.cloneNode(true);
  element.querySelector('.picture__img').src = photos[i].url;
  element.querySelector('.picture__likes').textContent = photos[i].likes + '';
  element.querySelector('.picture__comments').textContent = photos[i].comments.length + '';

  fragment.appendChild(element);
}

pictures.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

bigPicture.querySelector('.big-picture__img').children[0].src = photos[0].url;
bigPicture.querySelector('.likes-count').textContent = photos[0].likes + '';
bigPicture.querySelector('.comments-count').textContent = photos[0].comments.length + '';

var pools = bigPicture.querySelectorAll('.social__comment');
for (var i = 0; i < photos[0].comments.length; i++) {
  pools[i].querySelector('.social__picture').src = 'img/avatar-' + Math.round(Math.random() * 5 + 1) + '.svg';
  pools[i].querySelector('.social__text').textContent = photos[0].comments[i];
  if (photos[0].comments.length === 1) {
    bigPicture.querySelector('.social__comments').removeChild(pools[1]);
  }
}

bigPicture.querySelector('.social__caption').textContent = photos[0].description;
bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
