'use strict';

(function () {
  var onLoad = function (allPhotos) {
    window.filters.loadPictures(allPhotos);
  };

  window.backend.load(onLoad, window.util.onError);

})();
