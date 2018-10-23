/*
      Anthony Krivonos
      src/scripts/models.js
      10.12.2018
*/

'use strict';

// MARK: - Skill
class Skill {
      constructor(name, projects = []) {
            this.name = name;                // Name of the skill
            this.projects = projects;        // List of projects associated with the skill
      }
}

// MARK: - Project
class Project {
      constructor(name, year, description, src, skills = []) {
            this.name = name;                // Name of the project
            this.year = year;                // String representation of the year(s) the project was made
            this.description = description;  // Description of the project
            this.src = src;                  // Source URL of the project's image
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
