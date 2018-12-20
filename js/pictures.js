'use strict';

(function () {
  var pictures = document.querySelector('.pictures');

  var generatePictures = function (templ, photo) {
    var element = templ.cloneNode(true);
    element.querySelector('.picture__img').src = photo.url;
    element.querySelector('.picture__likes').textContent = photo.likes + '';
    element.querySelector('.picture__comments').textContent = photo.comments.length + '';
    return element;
  };

  var addPictures = function (filterPhotos) {
    var template = document.querySelector('#picture').content.querySelector('a');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < filterPhotos.length; i++) {
      fragment.appendChild(generatePictures(template, filterPhotos[i]));
    }
    pictures.appendChild(fragment);
    window.preview.openAndFillBigPicture(filterPhotos);
  };

  window.pictures = {
    addPictures: addPictures
  };
})();
