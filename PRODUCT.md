# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers, and potential collaborators evaluating Juan Antonio Ruiz Zavala for AI engineering, software, automation, and process-optimization work.

## Product Purpose

Present Juan's verified professional background in a quickly scannable portfolio and make contacting him the clearest next action.

## Positioning

Juan combines software delivery, AI-assisted automation, business systems implementation, and hands-on operational leadership. The portfolio must show this breadth through facts from his CV rather than unsupported claims.

## Operating Context

The site is a static Astro build with two routes. The root route `/` is a construction page: a devkit boot console stating the full site is still in assembly and offering one clear exit into the portfolio. The route `/portafolio/` is the preserved professional portfolio, which must remain visually and behaviorally identical to its pre-migration version.

Portfolio visitors may scan the site quickly on desktop or mobile, move between experience, skills, education, and projects, then contact Juan or download his Spanish CV.

## Capabilities and Constraints

- Spanish public interface and content.
- Static, production-appropriate architecture (Astro static output) with minimal dependency burden; Astro is a build-time-only dependency.
- The portfolio at `/portafolio/` keeps its original markup, styles, classic scripts, SEO metadata, CV download, and contact actions unchanged.
- The construction page at `/` must not invent claims; it only announces the in-progress site and links to `/portafolio/`.
- Factual content is maintained separately from layout and rendering.
- Projects must be easy to add without changing the core page structure.
- Missing social profile URLs must not be fabricated or rendered as links.

## Brand Commitments

Use Juan Antonio Ruiz Zavala's full name. The experience should be minimalist, professional, easy to read, and focused on contact conversion.

## Evidence on Hand

- `public/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx` is the source of truth and must remain unchanged and downloadable from `/portafolio/`.
- The CV documents one employer entry, one project, two degrees, two languages, contact details, and skill groups.
- Additional project URLs explicitly supplied by Juan are valid sources for project names, destinations, and public site descriptions.
- LinkedIn and GitHub URLs are placeholders in the CV and therefore must be omitted until real URLs are provided.

## Product Principles

- Truth before decoration: never invent employers, metrics, projects, dates, skills, links, or claims.
- Contact without friction: email and phone actions remain easy to find.
- Recruiter-first scanning: hierarchy and concise grouping support rapid evaluation.
- Extend through data: future projects are added in one obvious content file.
- Accessible by default: semantic structure, visible focus, sufficient contrast, responsive layouts, and reduced-motion support.

## Accessibility & Inclusion

Support keyboard navigation, screen readers, reduced motion, high contrast, and readable layouts from small mobile screens through desktop displays.
