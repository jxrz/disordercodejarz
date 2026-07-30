(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const text = (value) => (typeof value === "string" ? value.trim() : "");
  const list = (value) => (Array.isArray(value) ? value : []);
  const safeHref = (value, protocols) => {
    const href = text(value);
    if (!href) return "";
    try {
      const url = new URL(href, document.baseURI);
      return protocols.includes(url.protocol) ? href : "";
    } catch {
      return "";
    }
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const link = (label, href, className, options = {}) => {
    const node = el("a", className, label);
    node.href = href;
    if (options.download) node.download = "";
    if (options.external) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    }
    if (options.label) node.setAttribute("aria-label", options.label);
    return node;
  };

  const appendTextList = (parent, items, className) => {
    const listNode = el("ul", className);
    list(items).map(text).filter(Boolean).forEach((item) => listNode.append(el("li", "", item)));
    if (listNode.children.length) parent.append(listNode);
  };

  const renderMetadata = () => {
    if (!isRecord(data.metadata)) return;
    const title = text(data.metadata.title);
    const description = text(data.metadata.description);
    const socialDescription = text(data.metadata.socialDescription);
    if (title) {
      document.title = title;
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    }
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    if (socialDescription) {
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", socialDescription);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", socialDescription);
    }
  };

  const renderHero = () => {
    const person = isRecord(data.person) ? data.person : {};
    document.querySelector("#hero-role").textContent = text(person.role);
    document.querySelector("#hero-title").textContent = text(person.name);
    document.querySelector("#hero-value").textContent = text(person.valueProposition);
    document.querySelector("#brand-role").textContent = text(person.role);
    document.querySelector("#hero-location").textContent = text(person.location);
    document.querySelector("#footer-name").textContent = text(person.name);
    document.querySelector("#contact-summary").textContent = text(person.contactSummary);

    const actions = document.querySelector("#hero-actions");
    const email = text(person.email);
    const cvPath = text(person.cvPath);
    if (email) actions.append(link("Hablemos", `mailto:${email}`, "button button-primary"));
    if (cvPath) actions.append(link("Descargar CV", cvPath, "button button-secondary", { download: true }));
  };

  const renderRoute = () => {
    const semanticList = document.querySelector("#route-areas");
    const visual = document.querySelector("#route-visual");
    const positions = ["route-stop-web", "route-stop-erp", "route-stop-ai", "route-stop-operations"];

    list(data.routeAreas)
      .filter((area) => isRecord(area) && text(area.label) && text(area.visualLabel))
      .slice(0, positions.length)
      .forEach((area, index) => {
        semanticList.append(el("li", "", text(area.label)));
        const stop = el("div", `route-stop ${positions[index]}`);
        stop.append(el("span", "", text(area.visualLabel)));
        visual.append(stop);
      });
  };

  const renderProfile = () => {
    const person = isRecord(data.person) ? data.person : {};
    document.querySelector("#profile-summary").textContent = text(person.summary);
    const container = document.querySelector("#profile-highlights");

    list(data.highlights)
      .filter((highlight) => isRecord(highlight) && text(highlight.value) && text(highlight.label))
      .forEach((highlight) => {
        const item = el("article", "impact-item");
        item.append(
          el("strong", "impact-value", text(highlight.value)),
          el("p", "impact-label", text(highlight.label))
        );
        container.append(item);
      });
  };

  const renderExperience = () => {
    const container = document.querySelector("#experience-list");
    list(data.experience)
      .filter(
        (entry) =>
          isRecord(entry) &&
          text(entry.period) &&
          text(entry.location) &&
          text(entry.role) &&
          text(entry.organization) &&
          text(entry.focus)
      )
      .forEach((entry) => {
        const article = el("article", "experience-entry");
        const meta = el("div", "experience-meta");
        meta.append(
          el("p", "experience-period", text(entry.period)),
          el("p", "experience-location", text(entry.location))
        );

        const body = el("div", "experience-body");
        body.append(
          el("h3", "experience-role", text(entry.role)),
          el("p", "experience-organization", text(entry.organization)),
          el("p", "experience-focus", text(entry.focus))
        );
        appendTextList(body, entry.achievements, "achievement-list");
        article.append(meta, body);
        container.append(article);
      });
  };

  const renderSkills = () => {
    const container = document.querySelector("#skills-list");
    list(data.skills)
      .filter(
        (group) => isRecord(group) && text(group.category) && list(group.items).map(text).filter(Boolean).length
      )
      .forEach((group) => {
        const row = el("article", "skill-row");
        const content = el("div", "skill-content");
        content.append(el("h3", "", text(group.category)));
        appendTextList(content, list(group.items), "skill-tags");
        row.append(content);
        container.append(row);
      });
  };

  const renderProjects = () => {
    const container = document.querySelector("#projects-list");

    const projects = list(data.projects).filter(
      (project) => isRecord(project) && text(project.name) && text(project.description)
    );

    if (!projects.length) {
      const empty = el("div", "project-empty");
      empty.append(
        el("h3", "", "Proyectos no disponibles"),
        el("p", "", "No hay proyectos disponibles para mostrar.")
      );
      container.append(empty);
      return;
    }

    projects.forEach((project, index) => {
      const article = el("article", "project-entry");
      const projectIndex = el("p", "project-index", `Proyecto ${String(index + 1).padStart(2, "0")}`);
      const heading = el("h3", "project-title", project.name);
      const role = text(project.role) ? el("p", "project-role", project.role) : null;
      const description = el("p", "project-description", project.description);
      const outcome = text(project.outcome) ? el("p", "project-outcome", project.outcome) : null;
      const tech = el("ul", "project-tech");
      list(project.technologies).map(text).filter(Boolean).forEach((technology) => tech.append(el("li", "", technology)));
      const projectUrl = safeHref(project.url, ["https:"]);
      const visit = projectUrl
        ? link("Visitar proyecto ↗", projectUrl, "project-link", {
            external: true,
            label: `Visitar ${project.name}; abre en una pestaña nueva`
          })
        : null;
      [projectIndex, heading, role, description, outcome, tech.children.length ? tech : null, visit]
        .filter(Boolean)
        .forEach((node) => article.append(node));
      container.append(article);
    });
  };

  const renderCredentials = () => {
    const education = document.querySelector("#education-list");
    list(data.education)
      .filter((item) => isRecord(item) && text(item.degree) && text(item.institution) && text(item.period))
      .forEach((item) => {
        const entry = el("article", "credential-entry");
        entry.append(
          el("h3", "", text(item.degree)),
          el("p", "credential-institution", text(item.institution)),
          el("p", "credential-period", text(item.period))
        );
        education.append(entry);
      });

    const languages = document.querySelector("#languages-list");
    list(data.languages)
      .filter((item) => isRecord(item) && text(item.language) && text(item.level))
      .forEach((item) => {
        const row = el("div", "language-entry");
        row.append(el("h3", "", text(item.language)), el("p", "", text(item.level)));
        languages.append(row);
      });
  };

  const renderContact = () => {
    const container = document.querySelector("#contact-actions");
    const person = isRecord(data.person) ? data.person : {};
    const email = text(person.email);
    const phoneDisplay = text(person.phoneDisplay);
    const phoneHref = text(person.phoneHref);
    const cvPath = text(person.cvPath);
    if (email) container.append(link(email, `mailto:${email}`, "contact-link contact-email"));
    if (phoneDisplay && phoneHref) container.append(link(phoneDisplay, `tel:${phoneHref}`, "contact-link"));
    if (cvPath) container.append(link("Descargar CV", cvPath, "contact-link contact-cv", { download: true }));
  };

  const setupNavigation = () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });

    const sections = document.querySelectorAll("main section[id]");
    const links = [...nav.querySelectorAll("a[href^='#']")];
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((item) => {
          const current = item.getAttribute("href") === `#${visible.target.id}`;
          item.toggleAttribute("aria-current", current);
        });
      },
      { rootMargin: "-25% 0px -65%", threshold: [0, 0.2, 0.6] }
    );
    sections.forEach((section) => observer.observe(section));
  };

  renderMetadata();
  renderHero();
  renderRoute();
  renderProfile();
  renderExperience();
  renderSkills();
  renderProjects();
  renderCredentials();
  renderContact();
  setupNavigation();
  document.querySelector("#current-year").textContent = `© ${new Date().getFullYear()}`;

  requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));
})();
