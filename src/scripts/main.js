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
// Generates a color from a given string value
let colorFromString = (str) => {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
}

let graphizeSkills = (skills) => {
      console.log("graphizing")
      var ctx = document.getElementById('skillsChart').getContext('2d');
      ctx.canvas.width = '100px';
      ctx.canvas.height = '100px';
      var data = {
            datasets: [{
                  data: [],
                  backgroundColor: []
            }],
            labels: []
      };
      skills.sort((a, b) => a.name > b.name);
      skills.forEach((skill) => {
            data.datasets[0].data.push(skill.projects.length);
            data.datasets[0].backgroundColor.push(colorFromString(skill.name));
            data.labels.push(skill.name);
      });
      var options = {
            cutoutPercentage: 50,
            responsiveAnimationDuration: 500,
            responsive: true
      };
      new Chart(ctx, {
            data: data,
            type: 'polarArea',
            options: options
      });
};
