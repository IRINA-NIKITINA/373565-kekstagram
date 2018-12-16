'use strict';

(function () {

  var pictures = document.querySelector('.pictures');
  var template = document.querySelector('#picture').content.querySelector('a');

  var generatePictures = function (templ, photo) {
      var element = templ.cloneNode(true);
      element.querySelector('.picture__img').src = photo.url;
      element.querySelector('.picture__likes').textContent = photo.likes + '';
      element.querySelector('.picture__comments').textContent = photo.comments.length + '';
      return element;
  };

  var addPictures = function (photos) {
    var fragment = document.createDocumentFragment();
    
    for (var i = 0; i < COUNT_PHOTOS; i++) {
      fragment.appendChild(generatePictures(template, photos[i]));
    }
    pictures.appendChild(fragment);
    window.preview.openAndFillBigPicture(photos);
  };

  window.pictures = {
    addPictures: addPictures
  };
})();
