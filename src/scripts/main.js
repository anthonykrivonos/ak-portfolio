/*
      Anthony Krivonos
      src/scripts/main.js
      09.17.2018
*/

// URL Constants for Contacts
let URL_CONSTANTS = {
      GITHUB: "https://www.github.com/anthonykrivonos/",
      LINKEDIN: "https://www.linkedin.com/in/anthonykrivonos/",
      STACKOVERFLOW: "https://www.stackoverflow.com/users/7432026/anthony-krivonos/",
};

// URL Constants for Messaging
let URL_ENDPOINTS = {
      AUTH: "https://anthonykrivonos.herokuapp.com/auth/",
      CONTACT: "https://anthonykrivonos.herokuapp.com/contact/"
}

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
            "a LinkedIn author",
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
      let SIZE = "100px";
      var ctx = document.getElementById('skillsChart').getContext('2d');
      ctx.canvas.width = SIZE;
      ctx.canvas.height = SIZE;
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

// Sends any kind of XHR request to the specified url
// type: 'GET', 'POST', etc.
// url: (request endpoint)
// headers: (2d array of options to values) [ ["", ""], ["", ""], ... ]
// callbacks: functions with args (onSuccess:(response), onFail(response, code))
// body: request body
let sendRequest = (type, url, headers = [], onSuccess = null, onFail = null, body = null) => {
      var xhr = new XMLHttpRequest();
      xhr.open(type, url, true);
      headers.forEach((header) => xhr.setRequestHeader(header[0], header[1]));
      xhr.onreadystatechange = () => {
            if (xhr.readyState === xhr.DONE) {
                  if (xhr.status === 200 && onSuccess != null) {
                        try {
                              onSuccess(JSON.parse(xhr.response));
                        } catch (e) {
                              onSuccess(xhr.response);
                        }
                  } else if (onSuccess != null) {
                        try {
                              onSuccess(JSON.parse(xhr.response), xhr.status);
                        } catch (e) {
                              onSuccess(xhr.response, xhr.status);
                        }
                  }
            }
      };
      xhr.send(body);
};

let openInConsole = (url) => {
      let cs = document.getElementById("consoleWindow");
      let editor = document.getElementById("consoleEditor");

      let openInNewTab = () => {
            console.error(`Error: Could not load ${url} in console. Opened new tab.`);
            window.open(url, '_blank');
            window.focus();
      }

      let hideEditor = () => {
            console.log(`Success: Loaded ${url} in console.`);
            editor.style.display = "none";
            cs.style.display = "inline-block";
      }

      // Send request
      sendRequest('GET', url, [
            ['Access-Control-Allow-Origin', '*'],
            ['Access-Control-Allow-Headers', 'Content-Type, Content-Security-Policy'],
            ['Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS'],
            ['Content-Type', `text/html; charset=utf-8`],
            ['Content-Security-Policy', `frame-ancestors 'self'`]
      ], (res) => {
            // Success: 200
            if (res != null && res != "") {
                  var url = URL.createObjectURL(res);
                  cs.src = url;
                  hideEditor();
            } else {
                  // Failure
                  openInNewTab();
            }
      }, (res, errorCode) => {
            // Failure
            openInNewTab();
      });
};

let sendMessage = () => {

      // Request body for auth
      let uid = { uid: `${Date.now()}` };

      // Request body for mail
      let fields = {
            name: document.getElementsByName("from")[0].value,
            email: document.getElementsByName("email")[0].value,
            subject: document.getElementsByName("subject")[0].value,
            body: document.getElementsByName("message")[0].value
      };

      // Send auth request
      sendRequest('POST', URL_ENDPOINTS.AUTH, [
            ['Content-Type', 'application/json']
      ], (res) => {
            // Success: 200
            // Authenticated, now send message
            console.log(`Authenticated: ${res}`)
            console.log(`Token: ${res["auth-token"]}`);
            sendRequest('POST', URL_ENDPOINTS.CONTACT, [
                  ['Content-Type', 'application/json'],
                  ['auth-token', res["auth-token"]]
            ], (res) => {
                  // Success: 200
                  console.log('Message sent!');
            }, (res, errorCode) => {
                  // Failure
                  console.error(`Couldn't send message: mail error.\n${res}`);
            }, JSON.stringify(fields));

      }, (res, errorCode) => {
            // Failure
            console.error(`Couldn't send message: authentication error.\n${res}`);
      }, JSON.stringify(uid));

}
