'use strict';

(function () {
  var MIN_COMMENTS = 5;

  var pictures = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');

  function fillBigPicture(photo) {
    bigPicture.querySelector('.big-picture__img').children[0].src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photo.description;
    var commentCount = bigPicture.querySelector('.social__comment-count').innerHTML;

    if (photo.comments.length >= MIN_COMMENTS) {
      addComments(MIN_COMMENTS, photo);
      bigPicture.querySelector('.social__comment-count').innerHTML = commentCount.replace(commentCount.charAt(0), MIN_COMMENTS + '');
    } else {
      addComments(photo.comments.length, photo);
      bigPicture.querySelector('.social__comment-count').innerHTML = commentCount.replace(commentCount.charAt(0), photo.comments.length);
    }

    bigPicture.querySelector('.comments-loader').classList.add('hidden');
  }

  var generateComment = function (templ, comment) {
    var element = templ.cloneNode(true);
    element.querySelector('.social__picture').src = comment.avatar;
    element.querySelector('.social__text').textContent = comment.message + ' ' + comment.name;
    return element;
  };

  var addComments = function (countComments, photo) {
    var template = document.querySelector('.social__comment');
    var fragment = document.createDocumentFragment();
    var pools = bigPicture.querySelectorAll('.social__comment');

    if (pools.length > photo.comments.length) {
      for (var i = pools.length - 1; i >= photo.comments.length; i--) {
        var child = pools[i];
        child.parentElement.removeChild(child);
      }
    }

    for (var y = 0; y < countComments; y++) {
      if (y < pools.length) {
        pools[y].querySelector('.social__picture').src = photo.comments[y].avatar;
        pools[y].querySelector('.social__text').textContent = photo.comments[y].message + ' ' + photo.comments[y].name;
      } else {
        fragment.appendChild(generateComment(template, photo.comments[y]));
      }
    }
    document.querySelector('.social__comments').appendChild(fragment);
  };

  // some keyboard&mouse shortcuts to big picture
  var bigPictureCancel = bigPicture.querySelector('#picture-cancel');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function (photo) {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
    fillBigPicture(photo);
  };

  var closePopup = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  bigPictureCancel.addEventListener('click', closePopup);

  bigPictureCancel.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      closePopup();
    }
  });

  var onFillBigPictureClick = function (picture, photo) {
    picture.addEventListener('click', function () {
      openPopup(photo);
    });
  };

  var onFillBigPictureEnter = function (picture, photo) {
    picture.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        openPopup(photo);
      }
    });
  };

  var openAndFillBigPicture = function (photos) {
    var arrPictures = pictures.querySelectorAll('.picture');

    for (var i = 0; i < arrPictures.length; i++) {
      onFillBigPictureClick(arrPictures[i], photos[i]);
      onFillBigPictureEnter(arrPictures[i], photos[i]);
    }
  };

  window.preview = {
    openAndFillBigPicture: openAndFillBigPicture
  };
})();
