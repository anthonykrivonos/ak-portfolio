/*
      Anthony Krivonos
      src/scripts/main.js
      09.17.2018
*/


let typewriter = (typewriterElement, word, onInterval) => {
      if (!typewriterElement.className.split(' ').includes("typewriter")) {
            typewriterElement.className += " typewriter";
      }
      let timePerLetter = onInterval / word.length;
      typewriterElement.innerHTML = "";
      var i = 0;
      let typeInterval = setInterval(() => {
            if (i < word.length) {
                  typewriterElement.innerHTML = word.slice(0, i + 1);
                  i++;
            } else {
                  clearInterval(typeInterval);
            }
      }, timePerLetter);
};

// Randomly generate brag words into the element.
let brag = (typewriterElement, onInterval, waitTime) => {
      // List of words to generate
      let bragWords = [
            "a coder",
            "a problem solver",
            "an entrepreneur",
            "a tech enthusiast",
            "an author",
            "an engineer",
            "a designer",
            "a student",
            "a project lead"
      ];
      bragWords.shuffle();
      var i = 0;
      return setInterval(() => {
            typewriter(typewriterElement, bragWords[i], onInterval);
            i = i < bragWords.length - 1 ? i + 1 : 0;
      }, onInterval + waitTime);
};
