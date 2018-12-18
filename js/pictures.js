'use strict';

(function () {
  var COUNT_PHOTOS = 25;
  var pictures = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');
  var buttonsFilters = imgFilters.querySelectorAll('.img-filters__button');

  var generatePictures = function (templ, photo) {
    var element = templ.cloneNode(true);
    element.querySelector('.picture__img').src = photo.url;
    element.querySelector('.picture__likes').textContent = photo.likes + '';
    element.querySelector('.picture__comments').textContent = photo.comments.length + '';
    return element;
  };

  var addPictures = function (allPhotos, photos) {
    var template = document.querySelector('#picture').content.querySelector('a');
    var fragment = document.createDocumentFragment();

    if (typeof photos === 'undefined') {
      photos = allPhotos;
    }

    imgFilters.classList.remove('img-filters--inactive');
    addButtonClick(allPhotos);

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(generatePictures(template, photos[i]));
    }
    pictures.appendChild(fragment);
    window.preview.openAndFillBigPicture(photos);
  };

  var onButtonClick = function (buttonFilter, allPhotos) {
    buttonFilter.addEventListener('click', function () {
      buttonFilter.classList.add('img-filters__button--active');
      for (var i = 0; i < buttonsFilters.length; i++) {
        if (buttonsFilters[i] !== buttonFilter) {
          buttonsFilters[i].classList.remove('img-filters__button--active');
        }
      }
      window.util.debounce(updatePhotos(buttonFilter, allPhotos));
    });
  };

  var addButtonClick = function (allPhotos) {
    for (var i = 0; i < buttonsFilters.length; i++) {
      onButtonClick(buttonsFilters[i], allPhotos);
    }
  };

  var updatePhotos = function (buttonFilter, allPhotos) {
    removePhotos();
    addPictures(allPhotos, getArrayPhoto(buttonFilter, allPhotos));
  };

  var getArrayPhoto = function (buttonFilter, allPhotos) {
    if (buttonFilter.id === 'filter-popular') {
      var popularPhotos = [];
      for (var i = 0; i < COUNT_PHOTOS; i++) {
        popularPhotos.push(allPhotos[i]);
      }
      return popularPhotos;
    } else if (buttonFilter.id === 'filter-new') {
      var newPhotos = [];
      while (newPhotos.length < 10) {
        newPhotos = getArrayRandomPhoto(allPhotos, newPhotos);
        newPhotos = newPhotos.filter(function (it, k) {
          return newPhotos.indexOf(it) === k;
        });
      }
      return newPhotos;
    } else if (buttonFilter.id === 'filter-discussed') {
      var discussedPhotos = [];
      for (var y = 0; y < COUNT_PHOTOS; y++) {
        discussedPhotos.push(allPhotos[y]);
      }
      discussedPhotos.sort(function (first, second) {
        return first.comments.length - second.comments.length;
      });
      return discussedPhotos;
    } else {
      return allPhotos;
    }
  };

  var getArrayRandomPhoto = function (allPhotos, arr) {
    var photo = allPhotos[window.util.getRandInRange(0, allPhotos.length - 1)];
    arr.push(photo);
    return arr;
  };

  var removePhotos = function () {
    var photosElements = pictures.querySelectorAll('.picture');

    if (photosElements.length > 0) {
      for (var i = photosElements.length - 1; i >= 0; i--) {
        var child = photosElements[i];
        child.parentElement.removeChild(child);
      }
    }
  };

  window.pictures = {
    addPictures: addPictures
  };
})();
