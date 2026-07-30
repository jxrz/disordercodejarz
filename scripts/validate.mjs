import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import vm from "node:vm";

const root = process.cwd();
const dist = resolve(root, "dist");

// Build first so every check below runs against the actual shipped output.
// Invoke Astro's bin through the current Node executable: spawning npx.cmd is
// blocked on Windows (EINVAL) by Node's batch-file mitigation.
const astroBin = resolve(root, "node_modules/astro/astro.js");
const build = spawnSync(process.execPath, [astroBin, "build"], {
  cwd: root,
  stdio: "inherit"
});
if (build.status !== 0) {
  console.error("Validation aborted: astro build failed.");
  process.exit(build.status ?? 1);
}

const requiredFiles = [
  "src/pages/index.astro",
  "src/pages/portafolio/index.astro",
  "public/portafolio/css/styles.css",
  "public/portafolio/js/portfolio-data.js",
  "public/portafolio/js/app.js",
  "public/disroderjarz.png",
  "public/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx",
  "dist/index.html",
  "dist/portafolio/index.html"
];

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const assertCollection = (value, name, validateItem, { allowEmpty = false } = {}) => {
  assert(Array.isArray(value), `${name} must be an array`);
  if (!Array.isArray(value)) return;
  if (!allowEmpty) assert(value.length > 0, `${name} must contain at least one entry`);
  value.forEach((item, index) => validateItem(item, index));
};
const assertStringFields = (item, fields, label) => {
  assert(isRecord(item), `${label} must be an object`);
  if (!isRecord(item)) return false;
  fields.forEach((field) => assert(isNonEmptyString(item[field]), `${label}.${field} must be a non-empty string`));
  return true;
};
const metaContent = (document, attribute, value) => {
  const tag = [...document.matchAll(/<meta\b[^>]*>/g)]
    .map((match) => match[0])
    .find((meta) => new RegExp(`\\b${attribute}="${value}"`).test(meta));
  return tag?.match(/\bcontent="([^"]*)"/)?.[1];
};
const hasPngFavicon = (document) =>
  [...document.matchAll(/<link\b[^>]*>/gi)].some((match) => {
    const tag = match[0];
    return (
      /\brel=(['"])icon\1/i.test(tag) &&
      /\bhref=(['"])\/disroderjarz\.png\1/i.test(tag) &&
      /\btype=(['"])image\/png\1/i.test(tag)
    );
  });

requiredFiles.forEach((path) => assert(existsSync(resolve(root, path)), `Missing required file: ${path}`));

// Root-absolute and relative references in the built pages must resolve inside dist/.
const builtPages = ["dist/index.html", "dist/portafolio/index.html"];
builtPages.forEach((page) => {
  const document = readFileSync(resolve(root, page), "utf8");
  const pageDir = resolve(dist, page.replace(/^dist\//, ""), "..");
  const localReferences = [...document.matchAll(/(?:href|src)="(?!#|mailto:|tel:|https?:)([^"]+)"/g)]
    .map((match) => match[1].split("?")[0])
    .filter((path) => path && !path.startsWith("data:"));
  localReferences.forEach((reference) => {
    const target = reference.startsWith("/") ? resolve(dist, reference.slice(1)) : resolve(pageDir, reference);
    assert(existsSync(target), `Broken local reference in ${page}: ${reference}`);
  });
});

const assertAnchors = (document, pageLabel) => {
  const ids = new Set([...document.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const internalLinks = [...document.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  internalLinks.forEach((id) => assert(ids.has(id), `Internal link in ${pageLabel} points to missing id: #${id}`));
  assert(document.includes('class="skip-link"'), `Skip navigation link is missing in ${pageLabel}`);
  return internalLinks;
};

const rootHtml = readFileSync(resolve(dist, "index.html"), "utf8");
assert(rootHtml.includes("El mundo aún no está listo para esto"), "Root page must show the construction verdict");
assert(rootHtml.includes('href="/portafolio/"'), "Root page must link to /portafolio/");
assert(hasPngFavicon(rootHtml), "Root page must include the PNG favicon contract");
assertAnchors(rootHtml, "dist/index.html");

const html = readFileSync(resolve(dist, "portafolio/index.html"), "utf8");
assert(hasPngFavicon(html), "Portfolio page must include the PNG favicon contract");
const internalLinks = assertAnchors(html, "dist/portafolio/index.html");

const dataScriptIndex = html.indexOf('src="/portafolio/js/portfolio-data.js"');
const appScriptIndex = html.indexOf('src="/portafolio/js/app.js"');
assert(dataScriptIndex !== -1 && appScriptIndex !== -1, "Portfolio pages must load both classic scripts");
assert(dataScriptIndex < appScriptIndex, "portfolio-data.js must load before app.js");

assert(html.includes('lang="es-MX"'), "Document language must be es-MX");
assert(html.includes('name="description"'), "SEO description is missing");
assert(html.includes('property="og:title"'), "Open Graph title is missing");

const source = readFileSync(resolve(root, "public/portafolio/js/portfolio-data.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { filename: "portfolio-data.js" });
const data = context.window.PORTFOLIO_DATA;

assert(data?.person?.name === "Juan Antonio Ruiz Zavala", "Portfolio identity is missing or incorrect");
assert(data?.person?.email === "jarzinyolo@gmail.com", "Verified email is missing or incorrect");
assert(isNonEmptyString(data?.person?.location), "Verified location is missing");
assert(isNonEmptyString(data?.person?.contactSummary), "Contact summary is missing");
assertStringFields(
  data?.person,
  ["name", "role", "location", "email", "phoneDisplay", "phoneHref", "cvPath", "valueProposition", "contactSummary", "summary"],
  "person"
);
assert(
  data?.person?.cvPath === "/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx",
  "person.cvPath must point to the migrated CV path under /portafolio/"
);
assert(!source.includes("(agregar enlace)"), "Source placeholders must not be published");
assert(!source.includes("LinkedIn"), "Missing LinkedIn URL must not be rendered");
assert(!source.includes("GitHub"), "Missing GitHub URL must not be rendered");

assertCollection(data?.routeAreas, "routeAreas", (area, index) => {
  assertStringFields(area, ["label", "visualLabel"], `routeAreas[${index}]`);
});
assert(data?.routeAreas?.length === 4, "routeAreas must contain the four positioned professional areas");

assertCollection(data?.highlights, "highlights", (highlight, index) => {
  assertStringFields(highlight, ["value", "label"], `highlights[${index}]`);
});

assertCollection(data?.experience, "experience", (entry, index) => {
  if (!assertStringFields(entry, ["organization", "location", "role", "focus", "period"], `experience[${index}]`)) return;
  assert(
    Array.isArray(entry.achievements) && entry.achievements.length > 0 && entry.achievements.every(isNonEmptyString),
    `experience[${index}].achievements must be a non-empty array of non-empty strings`
  );
});

assertCollection(data?.skills, "skills", (group, index) => {
  if (!assertStringFields(group, ["category"], `skills[${index}]`)) return;
  assert(
    Array.isArray(group.items) && group.items.length > 0 && group.items.every(isNonEmptyString),
    `skills[${index}].items must be a non-empty array of non-empty strings`
  );
});

assertCollection(data?.projects, "projects", (project, index) => {
  const label = isRecord(project) && isNonEmptyString(project.name) ? project.name : `entry ${index + 1}`;
  assert(isRecord(project), `Project ${label} must be an object`);
  if (!isRecord(project)) return;
  assert(isNonEmptyString(project.name), `Project ${label} needs a non-empty name`);
  assert(isNonEmptyString(project.description), `Project ${label} needs a non-empty description`);
  assert(isNonEmptyString(project.url) && /^https:\/\//.test(project.url), `Project URL must use HTTPS: ${label}`);
  ["role", "outcome"].forEach((field) => {
    assert(
      project[field] === undefined || isNonEmptyString(project[field]),
      `Optional project field ${field} must be a non-empty string when present: ${label}`
    );
  });
  assert(
    project.technologies === undefined ||
      (Array.isArray(project.technologies) && project.technologies.every(isNonEmptyString)),
    `Optional project technologies must be an array of non-empty strings when present: ${label}`
  );
}, { allowEmpty: true });

assertCollection(data?.education, "education", (item, index) => {
  assertStringFields(item, ["degree", "institution", "period"], `education[${index}]`);
});

assertCollection(data?.languages, "languages", (item, index) => {
  assertStringFields(item, ["language", "level"], `languages[${index}]`);
});

assert(isRecord(data?.metadata), "Metadata source is missing");
assert(html.match(/<title>([^<]+)<\/title>/)?.[1] === data?.metadata?.title, "Static title must match metadata.title");
assert(metaContent(html, "name", "description") === data?.metadata?.description, "Static description must match metadata.description");
assert(metaContent(html, "name", "author") === data?.person?.name, "Static author must match person.name");
assert(metaContent(html, "property", "og:title") === data?.metadata?.title, "Static og:title must match metadata.title");
assert(
  metaContent(html, "property", "og:description") === data?.metadata?.socialDescription,
  "Static og:description must match metadata.socialDescription"
);
assert(metaContent(html, "name", "twitter:title") === data?.metadata?.title, "Static twitter:title must match metadata.title");
assert(
  metaContent(html, "name", "twitter:description") === data?.metadata?.socialDescription,
  "Static twitter:description must match metadata.socialDescription"
);

const docxHeader = readFileSync(resolve(root, "public/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx"))
  .subarray(0, 2)
  .toString("ascii");
assert(docxHeader === "PK", "CV file is not a valid ZIP-based DOCX package");

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Validation passed: ${requiredFiles.length} required files, ${internalLinks.length} internal links, and all portfolio collections.`
);
