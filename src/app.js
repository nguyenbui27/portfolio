const app = document.querySelector("#app");
const places = [
  {
    id: "about",
    name: "About",
    title: "The garden",
    x: 20,
    y: 43,
    color: "#e8a3c1",
  },
  {
    id: "projects",
    name: "Selected Work",
    title: "Project arcade",
    x: 51,
    y: 32,
    color: "#f07869",
  },
  {
    id: "experience",
    name: "Experience",
    title: "Experience studio",
    x: 80,
    y: 43,
    color: "#e7bd58",
  },
  {
    id: "skills",
    name: "Technical Stack",
    title: "The lab",
    x: 29,
    y: 75,
    color: "#80b8d8",
  },
  {
    id: "contact",
    name: "Contact",
    title: "Say hello",
    x: 70,
    y: 80,
    color: "#b6abd8",
  },
];
const visited = new Set();
try {
  JSON.parse(sessionStorage.getItem("nguyen-world") || "[]").forEach((id) => {
    if (places.some((p) => p.id === id)) visited.add(id);
  });
} catch {}
let profile,
  selectedProject = 0;
const player = { x: 50, y: 59, target: null };
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const tags = (items) =>
  `<div class="tags">${items.map((s) => `<span>${esc(s)}</span>`).join("")}</div>`;
const link = (url, text) =>
  `<a class="action" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${text} <span aria-hidden="true">↗</span></a>`;

function render() {
  document.querySelector(".nav")?.remove();
  app.innerHTML = `<header class="topbar"><a class="identity" href="#home">TNB<span>Thao Nguyen Bui</span></a><nav aria-label="Portfolio destinations">${places.map((p) => `<a href="#${p.id}">${p.name}</a>`).join("")}</nav>${link(profile.resume, "Resume")}</header>
    <main class="world"><div class="world-heading"><p class="eyebrow">A LITTLE WORLD. A LOT OF POSSIBILITIES.</p><h1>Nguyen's World<span>.</span></h1><p>Full-stack engineer. Curious by nature. Builder at heart.</p></div>
    <div class="availability"><span></span>Open to SWE internships &amp; new-grad roles</div>
    <canvas id="world-canvas" tabindex="0" aria-label="Interactive portfolio world. Move with arrow keys or WASD; press Enter near a destination."></canvas>
    <div class="destinations">${places.map((p, i) => `<button class="destination" data-place="${p.id}" style="--x:${p.x}%;--y:${p.y}%;--accent:${p.color}"><span class="destination-number">0${i + 1}</span><span>${p.title}<small>${p.name}</small></span><i class="visit-mark" aria-hidden="true"></i></button>`).join("")}</div>
    <div class="world-footer"><div class="passport"><span class="passport-label">EXPLORER PASSPORT</span><div class="stamps">${places.map((p, i) => `<span data-stamp="${p.id}" title="${p.name}">0${i + 1}</span>`).join("")}</div><span id="progress" aria-live="polite"></span></div><button id="reset" title="Reset exploration">Reset journey ↺</button><span class="world-coordinate">CHICAGO, IL / SOFTWARE ENGINEERING</span></div></main>
    <dialog id="detail" aria-labelledby="destination-label"><div class="dialog-top"><span id="destination-label"></span><button id="close" aria-label="Close destination" title="Close">×</button></div><div id="detail-content"></div></dialog>`;
  document
    .querySelectorAll("[data-place]")
    .forEach((b) =>
      b.addEventListener("click", () => journey(b.dataset.place)),
    );
  document.querySelector("#close").addEventListener("click", close);
  document.querySelector("#detail").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) close();
  });
  document.querySelector("#detail").addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  document.querySelector("#reset").addEventListener("click", () => {
    visited.clear();
    try {
      sessionStorage.removeItem("nguyen-world");
    } catch {}
    updateProgress();
    Object.assign(player, { x: 50, y: 59, target: null });
  });
  document.querySelector(".identity").addEventListener("click", () => {
    if (document.querySelector("dialog").open) close();
  });
  window.addEventListener("hashchange", route);
  updateProgress();
  startWorld();
  route();
}
function updateProgress() {
  document.querySelector("#progress").textContent =
    `${visited.size} / 5 discovered`;
  places.forEach((p) => {
    document
      .querySelector(`[data-stamp="${p.id}"]`)
      .classList.toggle("collected", visited.has(p.id));
    document
      .querySelector(`[data-place="${p.id}"]`)
      .classList.toggle("visited", visited.has(p.id));
  });
}
function content(id) {
  if (id === "about")
    return `<div class="about-layout"><figure><img src="${profile.photo}" alt="Thao Nguyen Bui"><figcaption>${esc(profile.name)}<br>${esc(profile.location)}</figcaption></figure><div><p class="eyebrow">About</p><h2>Hi, I'm Nguyen.</h2><p class="intro">${esc(profile.about.intro)}</p>${profile.about.details.map((d) => `<p>${esc(d)}</p>`).join("")}</div></div><section class="awards"><h3>Awards</h3>${profile.about.awards.map((a) => `<article><span class="award-symbol" aria-hidden="true">✦</span><div><h4>${esc(a.title)}</h4><p>${esc([a.issuer, a.date].filter(Boolean).join(" · "))}</p></div></article>`).join("")}</section>`;
  if (id === "projects")
    return `<p class="eyebrow">Selected Work</p><h2>Things I've built.</h2><div class="project-selector" role="tablist" aria-label="Projects">${profile.projects.map((p, i) => `<button role="tab" id="project-tab-${i}" aria-controls="project-detail" aria-selected="${i === selectedProject}" tabindex="${i === selectedProject ? 0 : -1}" data-project="${i}">${esc(p.name)}</button>`).join("")}</div><div id="project-detail" role="tabpanel" aria-labelledby="project-tab-${selectedProject}">${projectDetail()}</div>`;
  if (id === "experience")
    return `<p class="eyebrow">Experience</p><h2>Building in the real world.</h2><div class="timeline">${profile.experience.map((e, i) => `<article><div class="timeline-date"><span>0${i + 1}</span>${esc(e.dates)}</div><div><p class="company">${esc(e.company)}${e.location ? `<span class="experience-location">${esc(e.location)}</span>` : ""}</p><h3>${esc(e.role)}</h3><ul>${e.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>${tags(e.stack)}</div></article>`).join("")}</div>`;
  if (id === "skills")
    return `<p class="eyebrow">Technical Stack</p><h2>My builder's toolkit.</h2><input id="skill-search" class="skill-search" type="search" aria-label="Search skills" placeholder="Search skills"><p id="skill-results" class="skill-results" aria-live="polite"></p><div class="skill-list">${Object.entries(
      profile.skills,
    )
      .map(
        ([category, skills], i) =>
          `<section><span class="skill-number">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(category)}</h3>${tags(skills)}</div></section>`,
      )
      .join("")}</div>`;
  return `<div class="contact-content"><p class="eyebrow">Contact</p><h2>Let's build<br>something good.</h2><p class="intro">I am based in ${esc(profile.location)} and open to internship and new-grad software engineering opportunities.</p><a class="email-link" href="mailto:${profile.email}">${esc(profile.email)} ↗</a><div class="contact-links"><a class="action primary" href="mailto:${profile.email}">Email Nguyen ↗</a>${link(profile.github, "GitHub")}${link(profile.linkedin, "LinkedIn")}${link(profile.resume, "Resume")}</div></div>`;
}
function projectDetail() {
  const p = profile.projects[selectedProject];
  const media = p.media
    ? `<video src="${p.media.src}" controls muted autoplay loop playsinline preload="metadata" aria-label="${esc(p.name)} demo"></video>`
    : `<div class="project-art ${selectedProject === 0 ? "vault" : "algorithm"}" aria-hidden="true"><span>${selectedProject === 0 ? "[ SHA-256 ]" : selectedProject === 5 ? "1  2  3<br>4  5  6<br>7  8  9" : "{ hello }"}</span><small>${esc(p.type)}</small></div>`;
  return `<div class="project-layout"><div class="project-media">${media}</div><div><p class="project-meta">${esc(p.status)} / ${esc(p.type)}</p><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p><ul>${p.impact.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>${tags(p.stack)}<div class="project-links">${p.link?.startsWith("https://") ? link(p.link, "GitHub link") : ""}${p.paper ? link(p.paper, "Read paper") : ""}</div></div></div>`;
}
function wireProjects() {
  const buttons = [...document.querySelectorAll("[data-project]")];
  buttons.forEach((b) => {
    b.addEventListener("click", () => {
      selectedProject = Number(b.dataset.project);
      buttons.forEach((other) => {
        other.setAttribute("aria-selected", other === b);
        other.tabIndex = other === b ? 0 : -1;
      });
      const panel = document.querySelector("#project-detail");
      panel.innerHTML = projectDetail();
      panel.setAttribute("aria-labelledby", b.id);
    });
    b.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const next =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? buttons.length - 1
            : (Number(b.dataset.project) +
                (e.key === "ArrowRight" ? 1 : -1) +
                buttons.length) %
              buttons.length;
      buttons[next].click();
      buttons[next].focus();
    });
  });
}
function route() {
  const id = location.hash.slice(1);
  if (places.some((p) => p.id === id)) open(id);
  else if (document.querySelector("dialog").open) close();
}
function open(id) {
  const p = places.find((p) => p.id === id);
  visited.add(id);
  try {
    sessionStorage.setItem("nguyen-world", JSON.stringify([...visited]));
  } catch {}
  updateProgress();
  document.querySelectorAll("nav a").forEach((a) => {
    if (a.hash === `#${id}`) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.querySelector("#destination-label").textContent =
    `0${places.indexOf(p) + 1} / ${p.title}`;
  document.querySelector("#detail-content").innerHTML = content(id);
  document
    .querySelector("dialog")
    .style.setProperty("--destination-color", p.color);
  if (!document.querySelector("dialog").open)
    document.querySelector("dialog").showModal();
  document.querySelector("#detail-content").scrollTop = 0;
  if (id === "projects") wireProjects();
  if (id === "skills") wireSkillSearch();
}
function wireSkillSearch() {
  document.querySelector("#skill-search").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    let matches = 0;
    document.querySelectorAll(".skill-list section").forEach((section) => {
      const categoryMatch = section.querySelector("h3").textContent.toLowerCase().includes(query);
      let visible = 0;
      section.querySelectorAll(".tags span").forEach((tag) => {
        const match = categoryMatch || tag.textContent.toLowerCase().includes(query);
        tag.hidden = !match;
        if (match) visible++;
      });
      section.hidden = visible === 0;
      matches += visible;
    });
    document.querySelector("#skill-results").textContent = query ? `${matches} ${matches === 1 ? "match" : "matches"}` : "";
  });
}
function close() {
  document.querySelectorAll("dialog video").forEach((v) => v.pause());
  document.querySelector("dialog").close();
  history.replaceState(null, "", `${location.pathname}${location.search}#home`);
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.removeAttribute("aria-current"));
}
function journey(id) {
  const p = places.find((p) => p.id === id);
  player.target = { x: p.x, y: p.y + 9, id };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    Object.assign(player, { x: p.x, y: p.y + 9, target: null });
    location.hash = id;
  }
}

function startWorld() {
  const canvas = document.querySelector("#world-canvas"),
    ctx = canvas.getContext("2d");
  let width,
    height,
    last = 0;
  const keys = new Set(),
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  window.addEventListener("keydown", (e) => {
    if (document.querySelector("dialog").open || e.target.closest("button,a"))
      return;
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
      ].includes(e.key)
    ) {
      e.preventDefault();
      keys.add(e.key);
      player.target = null;
    }
    if (e.key === "Enter") {
      const p = places.find(
        (p) => Math.hypot(player.x - p.x, player.y - p.y - 9) < 13,
      );
      if (p) location.hash = p.id;
    }
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key));
  window.addEventListener("blur", () => keys.clear());
  canvas.addEventListener("pointerdown", (e) => {
    canvas.focus({ preventScroll: true });
    const r = canvas.getBoundingClientRect();
    player.target = {
      x: Math.max(5, Math.min(95, ((e.clientX - r.left) / width) * 100)),
      y: Math.max(22, Math.min(92, ((e.clientY - r.top) / height) * 100)),
    };
  });
  function rect(x, y, w, h, c, r = 0) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }
  function ellipse(x, y, rx, ry, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  function tree(x, y, s) {
    rect(x - 4 * s, y - 25 * s, 8 * s, 30 * s, "#718d6f");
    ellipse(x, y - 35 * s, 21 * s, 28 * s, "#67a58c");
    ellipse(x - 9 * s, y - 39 * s, 12 * s, 18 * s, "#81b99a");
  }
  function building(p, time) {
    const x = (width * p.x) / 100,
      y = (height * p.y) / 100 - 28,
      s = Math.min(width / 1150, height / 760, 1.25);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ellipse(8, 14, 93, 23, "#aecbb3");
    rect(-76, -86, 152, 94, p.color, 3);
    rect(65, -82, 16, 90, "#698b85", 2);
    ctx.fillStyle = "#fcf3da";
    ctx.beginPath();
    ctx.moveTo(-91, -86);
    ctx.lineTo(0, -135);
    ctx.lineTo(89, -86);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#355e59";
    ctx.lineWidth = 3;
    ctx.stroke();
    rect(-22, -46, 44, 54, "#355e59", 3);
    rect(-16, -41, 32, 42, "#d7efe7", 2);
    for (const wx of [-57, 35]) {
      rect(wx, -63, 25, 29, "#f9f4dd", 2);
      rect(wx + 3, -60, 19, 23, "#648c96", 1);
      rect(wx + 11, -60, 2, 23, "#f9f4dd");
    }
    rect(-49, -93, 98, 19, "#355e59", 2);
    ctx.fillStyle = "#fff9eb";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      p.id === "projects"
        ? "ARCADE"
        : p.id === "skills"
          ? "LAB / 04"
          : p.id === "contact"
            ? "POST OFFICE"
            : p.id === "about"
              ? "GARDEN HOUSE"
              : "STUDIO",
      0,
      -80,
    );
    if (p.id === "projects") {
      rect(-66, -32, 15, 27, "#355e59", 2);
      rect(-63, -29, 9, 11, "#9ae0d1");
    }
    if (p.id === "skills") {
      rect(38, -121, 17, 30, "#355e59", 2);
      ellipse(46, -122, 15, 8, "#e7bd58");
    }
    if (p.id === "contact") {
      rect(93, -22, 6, 36, "#355e59");
      rect(80, -39, 31, 22, "#e66f7f", 4);
    }
    if (!reduced) {
      ctx.fillStyle = "#fff9eb";
      ctx.globalAlpha = 0.7;
      ctx.fillRect(52, -144 - Math.sin(time / 800) * 4, 4, 4);
    }
    ctx.restore();
  }
  function frame(time) {
    const dt = Math.min((time - last) / 1000 || 0, 0.05);
    last = time;
    if (!document.querySelector("dialog").open) {
      const dx =
          Number(keys.has("ArrowRight") || keys.has("d")) -
          Number(keys.has("ArrowLeft") || keys.has("a")),
        dy =
          Number(keys.has("ArrowDown") || keys.has("s")) -
          Number(keys.has("ArrowUp") || keys.has("w"));
      player.x = Math.max(5, Math.min(95, player.x + dx * dt * 24));
      player.y = Math.max(22, Math.min(92, player.y + dy * dt * 24));
      if (player.target) {
        const tx = player.target.x - player.x,
          ty = player.target.y - player.y,
          d = Math.hypot(tx, ty);
        if (d < 0.8) {
          const id = player.target.id;
          player.target = null;
          if (id) location.hash = id;
        } else {
          player.x += (tx / d) * Math.min(dt * 35, d);
          player.y += (ty / d) * Math.min(dt * 35, d);
        }
      }
    }
    ctx.clearRect(0, 0, width, height);
    rect(0, 0, width, height, "#c7e6dc");
    // Landscape paths use the same percentage coordinates as the accessible map buttons.
    ctx.strokeStyle = "#e9f1d9";
    ctx.lineWidth = Math.max(30, width * 0.045);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.52);
    ctx.lineTo(width * 0.5, height * 0.59);
    ctx.lineTo(width * 0.8, height * 0.52);
    ctx.moveTo(width * 0.51, height * 0.41);
    ctx.lineTo(width * 0.5, height * 0.59);
    ctx.lineTo(width * 0.29, height * 0.84);
    ctx.moveTo(width * 0.5, height * 0.59);
    ctx.lineTo(width * 0.7, height * 0.89);
    ctx.stroke();
    ellipse(width * 0.9, height * 0.78, width * 0.12, height * 0.11, "#90c8cc");
    ellipse(
      width * 0.92,
      height * 0.78,
      width * 0.085,
      height * 0.07,
      "#a6d7d7",
    );
    for (let i = 0; i < 28; i++) {
      const x = (((i * 137) % 997) / 1000) * width,
        y = height * (0.25 + ((i * 83) % 659) / 1000);
      if (
        places.some(
          (p) =>
            Math.abs((x / width) * 100 - p.x) < 12 &&
            Math.abs((y / height) * 100 - p.y) < 17,
        )
      )
        continue;
      tree(x, y, Math.max(0.45, width / 1500));
    }
    for (let i = 0; i < 48; i++) {
      ellipse(
        (((i * 197) % 991) / 1000) * width,
        height * (0.3 + ((i * 53) % 601) / 1000),
        2,
        2,
        i % 2 ? "#ee95b7" : "#faf6d5",
      );
    }
    places.forEach((p) => building(p, time));
    const px = (width * player.x) / 100,
      py = (height * player.y) / 100,
      bob =
        !reduced && (player.target || keys.size) ? Math.sin(time / 90) * 2 : 0;
    ellipse(px, py + 9, 12, 5, "#8fb6a5");
    rect(px - 7, py - 18 + bob, 14, 20, "#d73b8c", 4);
    rect(px - 6, py, 4, 9, "#355e59", 1);
    rect(px + 2, py, 4, 9, "#355e59", 1);
    ellipse(px, py - 25 + bob, 9, 10, "#f4c7a4");
    ellipse(px, py - 30 + bob, 10, 7, "#293f39");
    rect(px - 10, py - 30 + bob, 4, 14, "#293f39", 2);
    rect(px + 6, py - 30 + bob, 4, 14, "#293f39", 2);
    if (visited.size === 5) {
      ctx.fillStyle = "#355e59";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("WORLD COMPLETE", px, py - 49);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
fetch("./data/profile.json?v=20")
  .then((r) => {
    if (!r.ok) throw new Error("Profile unavailable");
    return r.json();
  })
  .then((data) => {
    profile = data;
    render();
  })
  .catch(() => {
    app.innerHTML =
      '<p class="loading">This world could not load. <button onclick="location.reload()">Try again</button></p>';
  });
