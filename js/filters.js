'use strict';

(function () {
  var COUNT_PHOTOS = 25;
  var COUNT_NEW_PHOTOS = 10;
  var photos = [];
  var pictures = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');
  var buttonsFilters = imgFilters.querySelectorAll('.img-filters__button');

  var loadPictures = function (allPhotos) {
    imgFilters.classList.remove('img-filters--inactive');
    photos = allPhotos;
    updatePhotos();
    addButtonClick();
  };

  var onButtonClick = function (buttonFilter) {
    buttonFilter.addEventListener('click', function () {
      buttonFilter.classList.add('img-filters__button--active');
      for (var i = 0; i < buttonsFilters.length; i++) {
        if (buttonsFilters[i] !== buttonFilter) {
          buttonsFilters[i].classList.remove('img-filters__button--active');
        }
      }
      window.util.debounce(updatePhotos);
    });
  };

  var addButtonClick = function () {
    for (var i = 0; i < buttonsFilters.length; i++) {
      onButtonClick(buttonsFilters[i]);
    }
  };

  var getButtonActive = function () {
    for (var i = 0; i < buttonsFilters.length; i++) {
      if (buttonsFilters[i].classList.contains('img-filters__button--active')) {
        return buttonsFilters[i];
      }
    }
    return null;
  };

  var updatePhotos = function () {
    removePhotos();
    window.pictures.addPictures(getArrayPhoto(getButtonActive(), photos));
  };

  var getArrayPhoto = function (buttonFilter, allPhotos) {
    if (buttonFilter.id === 'filter-popular') {
      return getPopularPhotos(allPhotos);
    } else if (buttonFilter.id === 'filter-new') {
      return getNewPhotos(allPhotos);
    } else if (buttonFilter.id === 'filter-discussed') {
      return getDiscussedPhotos(allPhotos);
    } else {
      return allPhotos;
    }
  };

  var getPopularPhotos = function (allPhotos) {
    var popularPhotos = [];
    for (var i = 0; i < COUNT_PHOTOS; i++) {
      popularPhotos.push(allPhotos[i]);
    }
    return popularPhotos;
  };

  var getNewPhotos = function (allPhotos) {
    var newPhotos = [];
    while (newPhotos.length < COUNT_NEW_PHOTOS) {
      newPhotos = getArrayRandomPhoto(allPhotos, newPhotos);
      newPhotos = newPhotos.filter(function (it, i) {
        return newPhotos.indexOf(it) === i;
      });
    }
    return newPhotos;
  };

  var getDiscussedPhotos = function (allPhotos) {
    var discussedPhotos = [];
    for (var i = 0; i < COUNT_PHOTOS; i++) {
      discussedPhotos.push(allPhotos[i]);
    }
    discussedPhotos.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
    return discussedPhotos;
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

  window.filters = {
    loadPictures: loadPictures
  };
})();
