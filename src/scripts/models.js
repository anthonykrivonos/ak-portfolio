/*
      Anthony Krivonos
      src/scripts/models.js
      10.12.2018
*/

'use strict';

// MARK: - Project
class Project {
      constructor(title, years, description, src, url, skills = []) {
            this.title = title;              // Title of the project
            this.years = years;              // String representation of the years the project was made
            this.description = description;  // Description of the project
            this.src = src;                  // Source URL of the project's image
            this.url = url;                  // URL of the projects's homepage
            this.skills = skills;            // List of skills associated with the project
      }
}

// MARK: - Experience
class Experience {
      constructor(company, years, position, src, url) {
            this.company = company;          // Company
            this.years = years;           // String representation of the years the experience was held
            this.position = position;     // Experience's position
            this.src = src;               // Source URL of the experience's image
            this.url = url;               // URL of the experience's homepage
      }
}
