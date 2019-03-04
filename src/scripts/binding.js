/*
      Anthony Krivonos
      src/scripts/binding.js
      10.22.2018
*/

// Abstract: Binds database data to web components.

'use strict';

const EXPERIENCE_COLLECTION_KEY = "work";
const PROJECTS_COLLECTION_KEY = "projects";
const GENERAL_KEY = "general";

/*
 *
 *    Component Rendering
 *
 */

// MARK: - ExperienceGroup
let ExperienceGroup = (props) => {

      const experienceCards = props.experiences.map((experience, i) =>
            <div key={i} value={i} className="card margin-md-bottom">
                  <div className="experience-group">
                        <a href={experience.url} style={{'background': `url(${experience.src})`}} className="experience-image"></a>
                        <div className="experience-text">
                              <span className="experience-title font-size-sm">{experience.company}</span>
                              <span className="experience-year">{experience.years}</span>
                              <div className="experience-position">{experience.position}</div>
                        </div>
                  </div>
            </div>
      );

      return (
            <div className="row brag-cards">
                  {experienceCards}
            </div>
      );
};

// MARK: - Projects
let Projects = (props) => {

      const projectItems = props.projects.map((project, i) =>
            <div key={i} value={i} className="carousel-tile">
                  <div className="carousel-image" style={{'background': `url(${project.src})`}}></div>
            <div className="carousel-text" onClick={() => openInNewTab(project.url)}>
                        <div className="carousel-title">
                              {project.title}
                              {project.skills.map((skill, i) => <SkillChip key={i} value={i} skill={skill}/>)}
                        </div>
                        <div className="carousel-body">{project.description}</div>
                        <div className="carousel-footer"><div>👋🏻 Learn More</div></div>
                  </div>
            </div>
      );

      return (
            <div className="carousel dragscroll">
                  <div className="carousel-row dragscroll">
                        {projectItems}
                  </div>
            </div>
      );
};

// MARK: - SkillChip
let SkillChip = (props) => {
      return (
            <div className="chip unselectable">{props.skill}</div>
      );
};

// MARK: - Resume
let Resume = (props) => {

      let url = props.url;

      let buttonColor = randomColor({
            luminosity: 'dark',
            hue: 'random'
      });

      return (
            <div className="console resume">
                  <button id="resumeButton" style={{background: buttonColor}} onClick={ () => openResume()} className="res-button open">View Resume</button>
                  <iframe onMouseOver={() => fullPageJS.setAllowScrolling(false)} onMouseOut={ ()=> fullPageJS.setAllowScrolling(true)} id="resumeViewer" src={url + "#toolbar=0&navpanes=0&scrollbar=0"}/>
            </div>
      );
};

// MARK: - SkillsChart
let SkillsChart = (props) => {
      return (
            <div className="chart">
                  <div id="skillsTitle" className="font-size-xs text-center margin-md-bottom">🛠 <b>Skills</b> by # of Projects</div>
                  <canvas id="skillsCanvas"></canvas>
            </div>
      );
};

// MARK: - About
let About = (props) => {

      let year = (new Date()).getFullYear();
      let aboutText = props.text;
      let links = Object.keys(props.links).map((key) => [key, props.links[key]]).sort((a, b) => a[0] > b[0]);

      return (
            <div className="about-inner">
                  <h4>🎉 About Me</h4>
                  <p>{aboutText}</p>
                  <h5>🔗A Few More Links</h5>
                  <ul className="list-unstyled">
                        {links.map((link, i) => <li key={i} value={i} className="text-primary"><a onClick={() => openInNewTab(link[1])}>{link[0]}</a></li>)}
                  </ul>
                  <h5>👾 Developed In</h5>
                  <ul className="list-unstyled">
                        <li>Node.js, React, JQuery, Bootstrap, and Firebase</li>
                  </ul>
                  <h5>&copy; Copyright</h5>
                  <div>Anthony Krivonos | <span>{year}</span></div>
            </div>
      );
};

/*
 *
 *    On Document Load
 *
 */

(function () {
      $(document).ready(function () {

            // MARK: - Experience Group
            Database.list(EXPERIENCE_COLLECTION_KEY, (work) => {
                  let experienceObjects = [];
                  work.forEach((experience) => {
                        experienceObjects.push(new Experience(experience.company, experience.years, experience.position, experience.src, experience.url));
                  });
                  experienceObjects.sort((a, b) => {
                        const yearsA = a.years.split('-');
                        const yearsB = b.years.split('-');
                        const lastYearA = yearsA[yearsA.length - 1].toLowerCase().trim().trimStart();
                        const lastYearB = yearsB[yearsB.length - 1].toLowerCase().trim().trimStart();
                        if (lastYearA.includes('present')) {
                              return -1;
                        } else if (lastYearB.includes('present')) {
                              return 1;
                        } else if (lastYearB == lastYearA) {
                              if (yearsA.length > 1 && yearsB.length == 1) {
                                    return -1;
                              } else if (yearsA.length == 1 && yearsB.length > 1) {
                                    return 1;
                              } else {
                                    const firstYearA = parseInt(yearsA[0]);
                                    const firstYearB = parseInt(yearsB[0]);
                                    return firstYearB - firstYearA;
                              }
                        }
                        return parseInt(lastYearB) - parseInt(lastYearA);
                  });
                  ReactDOM.render(
                        <ExperienceGroup experiences={experienceObjects}/>,
                        document.getElementById('experienceGroup')
                  );
            });

            // MARK: - Projects + SkillsChart
            Database.list(PROJECTS_COLLECTION_KEY, (projects) => {
                  let projectObjects = [];
                  let skillsMap = {};
                  projects.forEach((project) => {
                        let skills = project.skills.sort((a, b) => a > b);
                        projectObjects.push(new Project(project.title, project.years, project.description, project.src, project.url, skills));
                        skills.forEach((skill) => {
                              if (skillsMap[skill]) {
                                    skillsMap[skill]++;
                              } else {
                                    skillsMap[skill] = 1;
                              }
                        })
                  });
                  projectObjects.sort((a, b) => {
                        const yearsA = a.years.split('-');
                        const yearsB = b.years.split('-');
                        const lastYearA = yearsA[yearsA.length - 1].toLowerCase().trim().trimStart();
                        const lastYearB = yearsB[yearsB.length - 1].toLowerCase().trim().trimStart();
                        if (lastYearA.includes('present')) {
                              return -1;
                        } else if (lastYearB.includes('present')) {
                              return 1;
                        } else if (lastYearB == lastYearA) {
                              if (yearsA.length > 1 && yearsB.length == 1) {
                                    return -1;
                              } else if (yearsA.length == 1 && yearsB.length > 1) {
                                    return 1;
                              } else {
                                    const firstYearA = parseInt(yearsA[0]);
                                    const firstYearB = parseInt(yearsB[0]);
                                    return firstYearB - firstYearA;
                              }
                        }
                        return parseInt(lastYearB) - parseInt(lastYearA);
                  });
                  ReactDOM.render(
                        <Projects projects={projectObjects}/>,
                        document.getElementById('projectsCarousel')
                  );
                  ReactDOM.render(
                        <SkillsChart/>,
                        document.getElementById('skillsChart')
                  );
                  initializeSkills(skillsMap, document.getElementById("skillsCanvas"));
            });

            // MARK: - Resume + About
            Database.map(GENERAL_KEY, (general) => {
                  let url = general.resume.url;
                  let links = general.links;
                  let text = general.about.text;
                  ReactDOM.render(
                        <Resume url={url}/>,
                        document.getElementById('resumeContainer')
                  );
                  ReactDOM.render(
                        <About text={text} links={links}/>,
                        document.getElementById('about')
                  );
            });

      });
})();
