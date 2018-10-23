/*
      Anthony Krivonos
      src/scripts/extensions.js
      09.17.2018
*/

'use strict';

/*
      Array Methods
*/

// Returns a random element from the array
Array.prototype.getRandom = function() {
      return this[Math.floor(Math.random() * this.length)];
};

// Returns the same array, but shuffled
Array.prototype.shuffle = function() {
      var j, x, i;
      for (i = this.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this[i];
            this[i] = this[j];
            this[j] = x;
      }
};

/*
      JQuery Methods
*/

$.fn.extend({

      // Animate element using Animate.css
      animate: function(withName, callback) {

            var animationEnd = (function(el) {
                  var animations = {
                        animation: 'animationend',
                        OAnimation: 'oAnimationEnd',
                        MozAnimation: 'mozAnimationEnd',
                        WebkitAnimation: 'webkitAnimationEnd',
                  };

                  for (var t in animations) {
                        if (el.style[t] !== undefined) {
                              return animations[t];
                        }
                  }
            })(document.createElement('div'));

            this.addClass('animated ' + withName).one(animationEnd, function() {
                  $(this).removeClass('animated ' + withName);
                  if (typeof callback === 'function') callback();
            });

            return this;
      },
});
