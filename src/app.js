const app = document.querySelector("#app");

const iconMap = {
  rose: "AI",
  green: "SQL",
  blue: "SIM",
  amber: "LLM"
};

function tagList(items) {
  return items.map(item => `<span class="tag">${item}</span>`).join("");
}

function projectVisual(project) {
  if (project.media?.type === "video") {
    return `
      <div class="project-visual media ${project.accent}">
        <video src="${project.media.src}" autoplay muted loop playsinline preload="metadata"></video>
      </div>
    `;
  }

  return `
    <div class="project-visual ${project.accent}">
      <div class="visual-code">
        <span>${iconMap[project.accent] || "APP"}</span>
        <i></i><i></i><i></i>
      </div>
      <div class="visual-orbit"></div>
    </div>
  `;
}

function projectLinks(project) {
  const links = [
    `<a class="text-link" href="${project.link}" target="${project.link.startsWith("http") ? "_blank" : "_self"}" rel="noreferrer">GitHub link -></a>`
  ];

  if (project.paper) {
    links.push(`<a class="text-link" href="${project.paper}" target="_blank" rel="noreferrer">Read paper -></a>`);
  }

  return `<div class="project-links">${links.join("")}</div>`;
}

function projectCard(project) {
  return `
    <article class="project-card" data-project-card data-type="${project.type.toLowerCase()}">
      ${projectVisual(project)}
      <div class="project-body">
        <div class="project-meta">
          <span>${project.type}</span>
          <span>${project.status}</span>
        </div>
        <h3>${project.name}</h3>
        <p>${project.summary}</p>
        <ul>
          ${project.impact.map(item => `<li>${item}</li>`).join("")}
        </ul>
        <div class="tags">${tagList(project.stack)}</div>
        ${projectLinks(project)}
      </div>
    </article>
  `;
}

function experienceItem(item) {
  return `
    <article class="timeline-item">
      <div>
        <span class="dates">${item.dates}</span>
        <h3>${item.role}</h3>
        <p>${item.company}</p>
      </div>
      <div>
        <ul>${item.details.map(detail => `<li>${detail}</li>`).join("")}</ul>
        <div class="tags">${tagList(item.stack)}</div>
      </div>
    </article>
  `;
}

function skillColumn([group, skills]) {
  return `
    <article class="skill-column">
      <h3>${group}</h3>
      <div class="tags">${tagList(skills)}</div>
    </article>
  `;
}

function render(profile) {
  app.innerHTML = `
    <header id="home" class="hero" data-nav-section>
      <div class="shell hero-grid">
        <section class="hero-copy">
          <p class="eyebrow">${profile.hero.eyebrow}</p>
          <h1>${profile.hero.headline}</h1>
          <p class="lede">${profile.hero.summary}</p>
          <div class="hero-actions">
            <a class="button primary" href="mailto:${profile.email}">Email Nguyen -></a>
            <a class="button" href="${profile.github}" target="_blank" rel="noreferrer">GitHub -></a>
            <a class="button quiet" href="${profile.linkedin}" target="_blank" rel="noreferrer">LinkedIn -></a>
            <a class="button quiet" href="${profile.resume}" target="_blank" rel="noreferrer">Resume -></a>
          </div>
        </section>

        <aside class="system-card" aria-label="Profile summary">
          <div class="window-bar"><span></span><span></span><span></span></div>
          <div class="terminal">
            <p class="comment">// candidate.profile</p>
            <p><b>name</b>: "${profile.name}"</p>
            <p><b>role</b>: "${profile.title}"</p>
            <p><b>degree</b>: "CS + Mathematics"</p>
            <p><b>ships</b>: ["mobile", "backend", "AI", "data"]</p>
            <p><b>available</b>: true</p>
          </div>
        </aside>
      </div>
    </header>

    <section class="band">
      <div class="shell split">
        <div>
          <p class="eyebrow">Education</p>
          <h2>${profile.education.school}</h2>
          <p class="section-lede">${profile.education.degree}, ${profile.education.graduation}. ${profile.education.honors.join(". ")}.</p>
        </div>
        <div class="coursework">${tagList(profile.education.coursework)}</div>
      </div>
    </section>

    <section id="about" class="about-section" data-nav-section>
      <div class="shell about-grid">
        <figure class="portrait-card">
          <img src="${profile.photo}" alt="Portrait of ${profile.name}">
          <figcaption>${profile.name} / ${profile.location}</figcaption>
        </figure>
        <div class="about-copy">
          <p class="eyebrow">About</p>
          <h2>Engineer with mobile, backend, data, and AI range.</h2>
          <p class="section-lede">${profile.about.intro}</p>
          <div class="about-notes">
            ${profile.about.details.map(detail => `<p>${detail}</p>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section id="projects" class="section page-band" data-nav-section>
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Selected Work</p>
            <h2>Projects with real system weight.</h2>
          </div>
          <p class="section-note">A portfolio set that shows mobile product engineering, AI, graphics, simulation, algorithms, and LLM integration.</p>
        </div>
        <div class="filter-row" role="list" aria-label="Project filters">
          <button class="chip active" data-filter="all">All</button>
          <button class="chip" data-filter="mobile">Mobile</button>
          <button class="chip" data-filter="ai">AI</button>
          <button class="chip" data-filter="simulation">Simulation</button>
          <button class="chip" data-filter="graphics">Graphics</button>
          <button class="chip" data-filter="algorithms">Algorithms</button>
        </div>
        <div class="project-grid">${profile.projects.map(projectCard).join("")}</div>
      </div>
    </section>

    <section id="experience" class="section page-band" data-nav-section>
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Experience</p>
          </div>
        </div>
        <div class="timeline">${profile.experience.map(experienceItem).join("")}</div>
      </div>
    </section>

    <section id="skills" class="stack-section" data-nav-section>
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Technical Stack</p>
          </div>
        </div>
        <div class="skill-grid">${Object.entries(profile.skills).map(skillColumn).join("")}</div>
      </div>
    </section>

    <section id="contact" class="section page-band" data-nav-section>
      <div class="shell contact">
        <div>
          <p class="eyebrow">Contact</p>
          <h2>Let's talk about full-stack SWE roles.</h2>
          <p class="section-lede">${profile.name} is based in ${profile.location} and open to internship and new-grad software engineering opportunities.</p>
        </div>
        <div class="contact-actions">
          <a class="button primary" href="mailto:${profile.email}">Email Nguyen -></a>
          <a class="button" href="${profile.linkedin}" target="_blank" rel="noreferrer">LinkedIn -></a>
          <a class="button" href="${profile.github}" target="_blank" rel="noreferrer">GitHub -></a>
        </div>
      </div>
    </section>
  `;

  wireFilters();
  wireNav();
}

function wireFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-project-card]");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      cards.forEach(card => {
        const match = filter === "all" || card.dataset.type.includes(filter);
        card.toggleAttribute("hidden", !match);
      });
    });
  });
}

function wireNav() {
  const links = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("[data-nav-section]");

  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  let ticking = false;

  const updateActiveNav = () => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.55;
    let activeSection = sections[0];

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
      activeSection = sections[sections.length - 1];
    } else {
      sections.forEach(section => {
        if (section.offsetTop <= scrollPosition) {
          activeSection = section;
        }
      });
    }

    links.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeSection.id}`);
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveNav);
      ticking = true;
    }
  });

  updateActiveNav();
}

async function init() {
  try {
    const response = await fetch("./data/profile.json?v=11");
    if (!response.ok) {
      throw new Error("Profile data failed to load");
    }
    render(await response.json());
  } catch (error) {
    app.innerHTML = `<section class="loading shell">Could not load portfolio data. Check that <code>data/profile.json</code> is available.</section>`;
    console.error(error);
  }
}

init();
