import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { Window } from "happy-dom";

const root = resolve(import.meta.dirname, "..");
const styles = readFileSync(resolve(root, "public/portafolio/css/styles.css"), "utf8");
const html = readFileSync(resolve(root, "src/pages/portafolio/index.astro"), "utf8")
  .replace('<link rel="stylesheet" href="/portafolio/css/styles.css" />', `<style>${styles}</style>`)
  .replace(/\s*<script is:inline src="\/portafolio\/js\/(?:portfolio-data|app)\.js"><\/script>/g, "");
const dataSource = readFileSync(resolve(root, "public/portafolio/js/portfolio-data.js"), "utf8");
const appSource = readFileSync(resolve(root, "public/portafolio/js/app.js"), "utf8");

const findByText = (rootNode, selector, expected) =>
  [...rootNode.querySelectorAll(selector)].find((node) => node.textContent.trim() === expected);

const sectionByHeading = (document, heading) => findByText(document, "h2", heading)?.closest("section");

const render = async (overrides = {}, width = 1280) => {
  const window = new Window({ url: "https://portfolio.test/portafolio/", width, height: 900 });
  window.document.write(html);
  window.eval(dataSource);
  window.PORTFOLIO_DATA = {
    ...JSON.parse(JSON.stringify(window.PORTFOLIO_DATA)),
    ...overrides
  };
  window.eval(appSource);
  await window.happyDOM.waitUntilComplete();
  return window;
};

test("renders factual content, route labels, and direct actions", async (t) => {
  const window = await render();
  t.after(() => window.close());
  const { document } = window;
  const projects = sectionByHeading(document, "Proyectos relevantes");
  const skills = sectionByHeading(document, "De la ingeniería a la operación.");

  assert.equal(projects.querySelectorAll("article").length, window.PORTFOLIO_DATA.projects.length);
  assert.deepEqual(
    [...projects.querySelectorAll("h3")].map((heading) => heading.textContent),
    window.PORTFOLIO_DATA.projects.map((project) => project.name)
  );
  assert.equal(document.querySelector("h1").textContent, "Juan Antonio Ruiz Zavala");
  assert.match(document.body.textContent, /CDMX, México/);
  assert.equal(document.title, window.PORTFOLIO_DATA.metadata.title);

  const routeList = document.querySelector('ul[aria-label="Áreas de experiencia conectadas"]');
  const routeVisual = routeList.parentElement.querySelector('[aria-hidden="true"]');
  assert.deepEqual(
    [...routeList.querySelectorAll("li")].map((item) => item.textContent),
    window.PORTFOLIO_DATA.routeAreas.map((area) => area.label)
  );
  assert.deepEqual(
    [...routeVisual.querySelectorAll("span")].map((item) => item.textContent),
    window.PORTFOLIO_DATA.routeAreas.map((area) => area.visualLabel)
  );
  assert.match(skills.textContent, /Odoo \(implementación y personalización\)/);
  assert.match(skills.textContent, /SAP \(implementación\/soporte\)/);

  const email = findByText(document, 'a[href="mailto:jarzinyolo@gmail.com"]', "jarzinyolo@gmail.com");
  const phone = findByText(document, 'a[href="tel:+525639554358"]', "56 39 55 43 58");
  const downloads = [...document.querySelectorAll('main a[download][href$=".docx"]')];
  assert.equal(email.textContent, "jarzinyolo@gmail.com");
  assert.equal(phone.textContent, "56 39 55 43 58");
  assert.equal(downloads.length, 2);
  downloads.forEach((item) =>
    assert.equal(item.getAttribute("href"), "/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx")
  );

  document.querySelectorAll("main a").forEach((item) => {
    const protocol = new URL(item.href).protocol;
    assert.ok(["https:", "mailto:", "tel:"].includes(protocol), `Unexpected protocol: ${protocol}`);
  });
});

test("renders a neutral empty project state", async (t) => {
  const window = await render({ projects: [] });
  t.after(() => window.close());
  const projects = sectionByHeading(window.document, "Proyectos relevantes");

  assert.equal(projects.querySelectorAll("article").length, 0);
  assert.ok(findByText(projects, "h3", "Proyectos no disponibles"));
  assert.ok(findByText(projects, "p", "No hay proyectos disponibles para mostrar."));
});

test("renders one project with only documented required fields", async (t) => {
  const window = await render({
    projects: [{ name: "Proyecto mínimo", description: "Descripción verificada.", url: "https://example.com/" }]
  });
  t.after(() => window.close());
  const projects = sectionByHeading(window.document, "Proyectos relevantes");
  const heading = findByText(projects, "h3", "Proyecto mínimo");
  const project = heading.closest("article");

  assert.match(project.textContent, /Descripción verificada\./);
  assert.doesNotMatch(project.textContent, /undefined|null/);
  assert.equal(project.querySelector('a[aria-label^="Visitar Proyecto mínimo"]')?.href, "https://example.com/");
});

test("renders multiple projects in stable document order", async (t) => {
  const window = await render({
    projects: [
      { name: "Primero", description: "Uno", url: "https://example.com/one" },
      { name: "Segundo", description: "Dos", url: "https://example.com/two", technologies: ["JavaScript"] }
    ]
  });
  t.after(() => window.close());
  const projects = sectionByHeading(window.document, "Proyectos relevantes");
  const articles = [...projects.querySelectorAll("article")];

  assert.deepEqual(articles.map((article) => article.querySelector("h3").textContent), ["Primero", "Segundo"]);
  assert.deepEqual(articles.map((article) => article.querySelector("p").textContent), ["Proyecto 01", "Proyecto 02"]);
});

test("contains malformed project data without crashing or unsafe links", async (t) => {
  const window = await render({
    projects: [
      null,
      {},
      { name: "Sin descripción", url: "https://example.com/" },
      {
        name: "Datos parciales",
        description: "La entrada conserva contenido seguro.",
        url: "javascript:alert(1)",
        role: null,
        outcome: 42,
        technologies: "JavaScript"
      }
    ]
  });
  t.after(() => window.close());
  const projects = sectionByHeading(window.document, "Proyectos relevantes");
  const articles = projects.querySelectorAll("article");

  assert.equal(articles.length, 1);
  assert.ok(findByText(articles[0], "h3", "Datos parciales"));
  assert.equal(articles[0].querySelectorAll("a, ul").length, 0);
  assert.equal(window.document.querySelectorAll('[href^="javascript:"]').length, 0);
});

test("contains malformed highlights while rendering valid profile facts", async (t) => {
  const window = await render({
    highlights: [null, {}, { value: 42, label: "Inválido" }, { value: "1 resultado", label: "Hecho visible" }]
  });
  t.after(() => window.close());
  const results = window.document.querySelector('[aria-label="Resultados destacados"]');

  assert.equal(results.querySelectorAll("article").length, 1);
  assert.match(results.textContent, /1 resultado/);
  assert.match(results.textContent, /Hecho visible/);
});

test("contains malformed experience entries and achievement items", async (t) => {
  const window = await render({
    experience: [
      null,
      { role: "Incompleto" },
      {
        organization: "Organización verificada",
        location: "CDMX",
        role: "Rol verificado",
        focus: "Enfoque verificado",
        period: "2020 — Actual",
        achievements: [null, "Logro visible"]
      }
    ]
  });
  t.after(() => window.close());
  const experience = sectionByHeading(window.document, "Experiencia profesional");

  assert.equal(experience.querySelectorAll("article").length, 1);
  assert.ok(findByText(experience, "h3", "Rol verificado"));
  assert.deepEqual([...experience.querySelectorAll("li")].map((item) => item.textContent), ["Logro visible"]);
});

test("contains malformed skill groups and items", async (t) => {
  const window = await render({
    skills: [null, { category: "Sin elementos", items: null }, { category: "Grupo visible", items: [null, "Habilidad"] }]
  });
  t.after(() => window.close());
  const skills = sectionByHeading(window.document, "De la ingeniería a la operación.");

  assert.equal(skills.querySelectorAll("article").length, 1);
  assert.ok(findByText(skills, "h3", "Grupo visible"));
  assert.deepEqual([...skills.querySelectorAll("li")].map((item) => item.textContent), ["Habilidad"]);
});

test("contains malformed education and language entries", async (t) => {
  const window = await render({
    education: [null, { degree: "Incompleto" }, { degree: "Grado", institution: "Institución", period: "2020" }],
    languages: [null, { language: "Incompleto" }, { language: "Español", level: "Nativo" }]
  });
  t.after(() => window.close());
  const education = sectionByHeading(window.document, "Formación");
  const languages = findByText(window.document, "h2", "Idiomas").parentElement.parentElement;

  assert.equal(education.querySelectorAll("article").length, 1);
  assert.ok(findByText(education, "h3", "Grado"));
  assert.ok(findByText(languages, "h3", "Español"));
  assert.ok(findByText(languages, "p", "Nativo"));
});

test("exposes and hides the mobile navigation with synchronized accessibility state", async (t) => {
  const window = await render({}, 390);
  t.after(() => window.close());
  const toggle = findByText(window.document, "button", "Menú");
  const nav = window.document.querySelector('nav[aria-label="Navegación principal"]');

  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(window.getComputedStyle(nav).display, "none");

  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(window.getComputedStyle(nav).display, "flex");
  assert.notEqual(window.getComputedStyle(findByText(nav, "a", "Perfil")).display, "none");

  findByText(nav, "a", "Perfil").click();
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(window.getComputedStyle(nav).display, "none");
});

test("serves the construction page at the root and the portfolio at /portafolio/", () => {
  const rootPagePath = resolve(root, "dist/index.html");
  const portfolioPagePath = resolve(root, "dist/portafolio/index.html");
  assert.ok(existsSync(rootPagePath), "dist/index.html is missing — run npm run build first");
  assert.ok(existsSync(portfolioPagePath), "dist/portafolio/index.html is missing — run npm run build first");

  const rootPage = readFileSync(rootPagePath, "utf8");
  assert.match(rootPage, /El mundo aún no está listo para esto/);
  assert.match(rootPage, /href="\/portafolio\/"/);

  const portfolioPage = readFileSync(portfolioPagePath, "utf8");
  assert.match(portfolioPage, /Juan Antonio Ruiz Zavala — Ingeniero de Software y Automatización/);
});
