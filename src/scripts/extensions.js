/*
      Anthony Krivonos
      src/scripts/extensions.js
      09.17.2018
*/

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
