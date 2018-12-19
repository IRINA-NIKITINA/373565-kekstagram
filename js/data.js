'use strict';

(function () {
  var onLoad = function (allPhotos) {
    window.pictures.loadPictures(allPhotos);
  };

  window.backend.load(onLoad, window.util.onError);

})();
