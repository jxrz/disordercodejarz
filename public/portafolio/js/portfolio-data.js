(function () {
  "use strict";

  window.PORTFOLIO_DATA = Object.freeze({
    person: {
      name: "Juan Antonio Ruiz Zavala",
      role: "Ingeniero de Software y Automatización",
      location: "CDMX, México",
      email: "jarzinyolo@gmail.com",
      phoneDisplay: "56 39 55 43 58",
      phoneHref: "+525639554358",
      cvPath: "/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx",
      valueProposition:
        "Optimización de procesos y entrega de soluciones en desarrollo web, ERP y automatización con IA.",
      contactSummary:
        "Conversemos sobre ingeniería, automatización con IA u optimización de procesos.",
      summary:
        "Ingeniero orientado a IA con 11 años de experiencia en desarrollo web, implementación de software y optimización de procesos. Experiencia integrando APIs, automatización de flujos con n8n y uso de agentes de IA para análisis de datos y automatización de pruebas. He liderado implementaciones de ERP, e-commerce y mejoras operativas en retail e importación, con enfoque en impacto medible, escalabilidad y mejora continua."
    },
    metadata: {
      title: "Juan Antonio Ruiz Zavala — Ingeniero de Software y Automatización",
      description:
        "Portafolio de Juan Antonio Ruiz Zavala, Ingeniero de Software y Automatización con experiencia en desarrollo web, ERP, automatización con IA y optimización de procesos.",
      socialDescription:
        "Ingeniería de software, automatización con IA y optimización de procesos."
    },
    routeAreas: [
      { label: "Desarrollo web", visualLabel: "Web" },
      { label: "Sistemas ERP", visualLabel: "ERP" },
      { label: "Inteligencia artificial", visualLabel: "IA" },
      { label: "Operación", visualLabel: "Operación" }
    ],
    highlights: [
      {
        value: "$500,000 MXN",
        label: "promedio mensual de ingresos de la tienda en línea durante el primer año"
      },
      {
        value: "30+ etiquetas",
        label: "generadas de forma masiva en el tiempo antes requerido para una sola"
      },
      {
        value: "8 sucursales",
        label: "abiertas en 3 años como parte de la expansión de retail"
      }
    ],
    experience: [
      {
        organization: "Yireunit / LB Asian Food",
        location: "CDMX, México",
        role: "Director de Marketing y Tecnología",
        focus: "Optimización de procesos / Implementación",
        period: "16 feb 2015 — Actual",
        achievements: [
          "Diseñé, lancé y escalé la tienda en línea, llevando los ingresos de 0 a un promedio de $500,000 MXN mensuales durante el primer año.",
          "Implementé y amplié el ERP: de SAP (Finanzas, Facturación, Inventario y Compras) a Odoo, integrando además Logística, Marketing, Venta Web, RRHH y CRM para una operación más conectada.",
          "Optimicé el proceso de etiquetado NOM-051: de un ciclo de 2 días por etiqueta a generación masiva de 30+ etiquetas en el mismo tiempo mediante automatización con macros y tooling.",
          "Implementé automatizaciones con n8n para cotización de clientes mayoristas e integré WhatsApp con Odoo para consulta rápida de precios y existencias.",
          "Apliqué agentes de IA y análisis de datos para apoyar el pronóstico de demanda por temporadas y la segmentación de clientes, mejorando la planeación de compras e importación.",
          "Lideré la expansión de retail, abriendo 8 sucursales en 3 años como parte de una estrategia de distribución y captura de datos de consumo.",
          "Desarrollé y mantuve soluciones web con WordPress, WooCommerce, Next.js, TypeScript, PHP y JavaScript, incluyendo SEO continuo apoyado por herramientas de IA y administración de VPS y hosting.",
          "Fortalecí la presencia comercial mediante participación activa en exposiciones relevantes, entre ellas ANTAD y Expo Beauty Show."
        ]
      }
    ],
    skills: [
      {
        category: "IA y automatización",
        items: [
          "Agentes de IA",
          "APIs de IA (LLMs)",
          "n8n",
          "Mejora de prompts para marketing y SEO",
          "Integraciones locales o remotas"
        ]
      },
      {
        category: "Datos y analítica",
        items: [
          "Pronóstico de demanda",
          "Segmentación de clientes",
          "SQL",
          "Google Analytics",
          "Meta y TikTok Business"
        ]
      },
      {
        category: "Ingeniería de software",
        items: [
          "Python",
          "PHP",
          "JavaScript",
          "TypeScript",
          "Laravel",
          "React",
          "Node.js",
          "Next.js",
          "Desarrollo de APIs"
        ]
      },
      {
        category: "Sistemas de negocio",
        items: [
          "Odoo (implementación y personalización)",
          "SAP (implementación/soporte)",
          "CRM",
          "Inventarios",
          "Compras",
          "Facturación",
          "Logística"
        ]
      },
      {
        category: "Infraestructura y comercio",
        items: [
          "AWS",
          "VPS y hosting",
          "Hostinger",
          "Administración de servidores",
          "WordPress",
          "WooCommerce"
        ]
      }
    ],
    projects: [
      {
        name: "Asiaonmart",
        role: "Desarrollador principal y arquitecto",
        url: "https://asiaonmart.com/",
        description:
          "Construí la marca y su plataforma digital de e-commerce y operación con WordPress, WooCommerce y Odoo, priorizando velocidad de implementación y posibilidad de personalización.",
        outcome:
          "Integré procesos clave de inventario, logística y atención a clientes para sostener el crecimiento del negocio.",
        technologies: ["WordPress", "WooCommerce", "Odoo"]
      },
      {
        name: "Chum Churum México",
        url: "https://chumchurum.com.mx/",
        description:
          "Sitio de marca y catálogo para Chum Churum y Soonhari, enfocado en la distribución de soju coreano para retail, bares, restaurantes y mayoristas en México."
      },
      {
        name: "Yireunit",
        url: "https://yireunit.com/es",
        description:
          "Sitio corporativo de soluciones integrales de importación desde Asia a México, con servicios de freight forwarding, despacho aduanal y comercialización."
      },
      {
        name: "LB Asian Food",
        url: "https://lbasianfood.com/",
        description:
          "Plataforma comercial B2B para la distribución de alimentos asiáticos en México, dirigida a retail, mayoreo y HORECA."
      },
      {
        name: "Bulbit Korean BBQ",
        url: "https://bulbit.mx/",
        description:
          "Sitio de restaurante para consultar el menú, descubrir la propuesta de Korean BBQ y reservar mesa en Ciudad de México."
      },
      {
        name: "Musa Beauty",
        url: "https://musabeauty.com/",
        description:
          "Sitio de lanzamiento para una marca de cuidado y belleza, con presentación de la experiencia y registro a una lista de espera."
      }
    ],
    education: [
      {
        degree: "Ingeniería en Computación",
        institution: "Instituto Politécnico Nacional (IPN)",
        period: "2013 — 2017"
      },
      {
        degree: "Licenciatura en Ciencias Políticas",
        institution: "Universidad Nacional Autónoma de México (UNAM)",
        period: "2012 — 2016"
      }
    ],
    languages: [
      { language: "Español", level: "Nativo" },
      { language: "Inglés", level: "Competencia laboral intermedia (B1)" }
    ]
  });
})();
