/*
Anthony Krivonos
src/scripts/main.js
09.17.2018
*/


let typewriter = (typewriterElement, onInterval, word = null) => {
      if (!typewriterElement.className.split(' ').includes("typewriter")) {
            typewriterElement.className += " typewriter";
      }
      if (!word) {
            word = typewriterElement.innerHTML;
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
            "an iOS developer",
            "a web developer",
            "a VR developer",
            "an AR developer",
            "a full stack guy",
            "a user researcher",
            "a problem solver",
            "an entrepreneur",
            "a tech enthusiast",
            "an author",
            "an engineer",
            "a designer",
            "a student",
            "a project lead",
            "a night owl",
            "an experimenter",
            "a photographer",
            "a graphic designer",
      ];
      bragWords.shuffle();
      var i = 0;
      return setInterval(() => {
            typewriter(typewriterElement, onInterval, bragWords[i]);
            i = i < bragWords.length - 1 ? i + 1 : 0;
      }, onInterval + waitTime);
};

let randomizeHue = (onElement, onInterval = null) => {
      console.log("randomizing")
      let setHue = (to) => {
            onElement.css("-webkit-filter", `hue-rotate(${to}deg)`);
            onElement.css("filter", `hue-rotate(${to}deg)`);
      };
      let getRandomDegree = () => Math.floor(Math.random() * 360) + 1;
      if (onInterval) {
            return setInterval(() => {
                  setHue(getRandomDegree());
            }, onInterval);
      } else {
            setHue(getRandomDegree());
            return null;
      }
};
