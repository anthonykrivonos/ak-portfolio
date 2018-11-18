/*
      Anthony Krivonos
      src/scripts/main.js
      09.17.2018
*/

'use strict';

/*
 *
 *    Constants
 *
 */

// URL Constants for Contacts
let URL_CONSTANTS = {
      GITHUB: "https://www.github.com/anthonykrivonos/",
      LINKEDIN: "https://www.linkedin.com/in/anthonykrivonos/",
      STACKOVERFLOW: "https://www.stackoverflow.com/users/7432026/anthony-krivonos/",
      RESUME: "https://docs.google.com/viewer?url=https://docs.google.com/document/d/1ftyJz3rHQT0U5rJE5VkJjxBgr7y6zOXELJdXfXUkayg/export?format=pdf"
};

// URL Constants for Messaging
let URL_ENDPOINTS = {
      AUTH: "https://anthonykrivonos.herokuapp.com/auth/",
      CONTACT: "https://anthonykrivonos.herokuapp.com/contact/"
}

/*
 *
 *    UI Functions
 *
 */

// Turns an element into a panning view
$.fn.panGesture = function() {
      var attachment = false, lastPosition, position, difference;
      $($(this).selector).on("mousedown mouseup mousemove", function(e) {
            console.log("caught")
            if (e.type == "mousedown") {
                  attachment = true;
                  lastPosition = [e.clientX, e.clientY];
            } else if (e.type == "mouseup" ) {
                  attachment = false;
            } else if (e.type == "mousemove" && attachment) {
                  position = [e.clientX, e.clientY];
                  difference = [ (position[0]-lastPosition[0]), (position[1]-lastPosition[1]) ];
                  $(this).scrollLeft($(this).scrollLeft() - difference[0]);
                  $(this).scrollTop($(this).scrollTop() - difference[1]);
                  lastPosition = [e.clientX, e.clientY];
            }
      });
      $(window).on("mouseup", function() {
            attachment = false;
      });
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

// Initialize skills
let initializeSkills = (skillsMap, canvas) => {
      let skills = Object.keys(skillsMap).map((key) => [key, skillsMap[key]]);
      let SIZE = "100px";
      var ctx = canvas.getContext('2d');
      ctx.canvas.width = SIZE;
      ctx.canvas.height = SIZE;
      var data = {
            datasets: [{
                  data: [],
                  backgroundColor: []
            }],
            labels: []
      };
      skills.sort((a, b) => a[0] > b[0]);
      skills.forEach((skill) => {
            data.datasets[0].data.push(skill[1]);
            data.datasets[0].backgroundColor.push(colorFromString(skill[0]));
            data.labels.push(skill[0]);
      });
      var options = {
            responsiveAnimationDuration: 500,
            responsive: true,
            legend: {
                  display: false
            },
            tooltips: {
                  enabled: true
            }
      };
      Chart.defaults.global.legend =
      new Chart(ctx, {
            data: data,
            type: 'pie',
            options: options
      });
};

/*
 *
 *    Validation Functions
 *
 */

let isValidEmail = (email) => {
      var emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegEx.test(email.toLowerCase());
};

let isValidName = (name) => {
      return name != null && name.length > 3;
};

let isValidSubject = (subject) => {
      return subject != null && subject.length > 0;
};

let isValidMessage = (message) => {
      return message != null && message.length > 10;
};

let validateFields = () => {
      var isValid = isValidName(document.getElementsByName("from")[0].value) && isValidEmail(document.getElementsByName("email")[0].value) && isValidSubject(document.getElementsByName("subject")[0].value) && isValidMessage(document.getElementsByName("message")[0].value);

      document.getElementById("sendButton").disabled = !isValid;
};

/*
 *
 *    Browser Operations
 *
 */

let openInNewTab = (url) => {
      console.log(`Opening ${url} in new tab.`);
      window.open(url, '_blank');
      window.focus();
};

/*
 *
 *    Clientside Functions
 *
 */

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
                  } else if (onFail != null) {
                        try {
                              onFail(JSON.parse(xhr.response), xhr.status);
                        } catch (e) {
                              onFail(xhr.response, xhr.status);
                        }
                  }
            }
      };
      xhr.send(body);
};

let sendMessage = () => {

      // Request body for auth
      let uid = { uid: `${Date.now()}` };

      // Get email header span from the document
      let emailHeader = document.getElementById("emailHeader");

      // Get fields from the document
      let nameField = document.getElementsByName("from")[0];
      let emailField = document.getElementsByName("email")[0];
      let subjectField = document.getElementsByName("subject")[0];
      let messageField = document.getElementsByName("message")[0];

      // Get button from the document
      let sendButton = document.getElementById("sendButton");

      // Clear the form
      let clearFields = () => {
            nameField.value = "";
            emailField.value = "";
            subjectField.value = "";
            messageField.value = "";
      };

      // Set the header message
      let setMessage = (message) => {
            emailHeader.innerHTML = message;
      };

      // Request body for mail
      let fields = {
            name: nameField.value,
            email: emailField.value,
            subject: subjectField.value,
            body: messageField.value
      };

      // Send auth request
      sendButton.disabled = true;
      setMessage("Message sent!");
      clearFields();
      emitConfetti();
      setTimeout(() => stopConfetti(), 10000);
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
                  messageField.placeholder = "thanks for your message!"
            }, (res, errorCode) => {
                  // Failure
                  console.error(`Couldn't send message: mail error.\n${res}`);
                  setMessage("Couldn't send.");
            }, JSON.stringify(fields));

      }, (res, errorCode) => {
            // Failure
            console.error(`Couldn't send message: authentication error.\n${res}`);
            setMessage("Couldn't send.");
      }, JSON.stringify(uid));

};

// Open the resume in the embedded viewer
let openResume = () => {
      let cs = document.getElementsByClassName("resume")[0];
      let button = document.getElementById("resumeButton");
      let viewer = document.getElementById("resumeViewer");

      // If small width
      if ($(window).width() < 481) {
            // Open in new tab
            openInNewTab(viewer.src);
      } else {
            // Open in console
            button.style.display = "none";
            cs.style.width = "80vw";
      }
};

// Hide the resume in the embedded viewer
let hideResume = () => {
      let cs = document.getElementsByClassName("resume")[0];
      let button = document.getElementById("resumeButton");

      // Hide the button
      button.style.display = "inline-block";
      cs.style.width = "calc(75vh * (8.5/11))";
};
