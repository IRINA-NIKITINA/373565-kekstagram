'use strict';

(function () {
  var onLoad = function (allPhotos) {
    window.pictures.addPictures(allPhotos);
  };

  window.backend.load(onLoad, window.util.onError);
})();
