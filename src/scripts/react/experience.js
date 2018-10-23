/*
      Anthony Krivonos
      src/scripts/react/work.js
      10.22.2018
*/

'use strict';

const EXPERIENCE_COLLECTION_KEY = "work";

/*
 *
 *    Component Rendering
 *
 */

// View for Experience models
let ExperienceGroup = (props) => {

      const experienceCards = props.experiences.map((experience, i) =>
            <div key={i} value={i} className="card margin-md-bottom">
                  <div className="experience-group">
                  <style dangerouslySetInnerHTML={{__html: `
                        #experience-image-${i} { background: url(${experience.src}) }
                  `}} />
                  <a href={experience.url} id={"experience-image-" + i} className="experience-image"></a>
                        <div className="experience-text">
                              <span className="experience-title font-size-sm">{experience.company}</span>
                              <span className="experience-year font-size-xs">{experience.years}</span>
                              <span className="experience-position font-size-xs">{experience.position}</span>
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

/*
 *
 *    On Document Load
 *
 */

(function () {
      $(document).ready(function () {
            Database.list(EXPERIENCE_COLLECTION_KEY, (work) => {
                  let experienceObjects = [];
                  work.forEach((experience) => {
                        experienceObjects.push(new Experience(experience.company, experience.years, experience.position, experience.src, experience.url));
                  });
                  ReactDOM.render(
                        <ExperienceGroup experiences={experienceObjects}/>,
                        document.getElementById('experienceGroup')
                  );
            });
      });
})();
