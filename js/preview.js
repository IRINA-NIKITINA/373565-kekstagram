'use strict';

(function () {
  var MIN_AVATARS = 1;
  var MAX_AVATARS = 6;

  var pictures = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');

  function fillBigPicture(picture) {
    bigPicture.querySelector('.big-picture__img').children[0].src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes + '';
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length + '';

    var pools = bigPicture.querySelectorAll('.social__comment');
    for (var y = 0; y < picture.comments.length; y++) {
      if (picture.comments.length === 1) {
        pools[1].classList.add('visually-hidden');
      } else {
        pools[1].classList.remove('visually-hidden');
      }
      pools[y].querySelector('.social__picture').src = 'img/avatar-' + window.util.getRandInRange(MIN_AVATARS, MAX_AVATARS) + '.svg';
      pools[y].querySelector('.social__text').textContent = picture.comments[y];
    }

    bigPicture.querySelector('.social__caption').textContent = picture.description;
    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
  }

  // some keyboard&mouse shortcuts to big picture
  function bigPictureKeyAndMouseBindings() {
    var bigPictureCancel = bigPicture.querySelector('#picture-cancel');

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closePopup();
      }
    };

    var openPopup = function (index) {
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', onPopupEscPress);
      fillBigPicture(window.pictures.photos[index]);
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

    var onFillBigPictureClick = function (picture, index) {
      picture.addEventListener('click', function () {
        openPopup(index);
      });
    };

    var onFillBigPictureEnter = function (picture, index) {
      picture.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ENTER_KEYCODE) {
          openPopup(index);
        }
      });
    };

    var arrPictures = pictures.querySelectorAll('.picture');

    for (var i = 0; i < arrPictures.length; i++) {
      onFillBigPictureClick(arrPictures[i], i);
      onFillBigPictureEnter(arrPictures[i], i);
    }
  }

  bigPictureKeyAndMouseBindings();
})();
