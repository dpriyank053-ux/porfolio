/**
 * Portfolio Data Source of Truth
 * Personal branding, structured skills, project catalog, and section content for Priyank Sharma
 */

export const portfolioData = {
    identity: {
        name: 'PRIYANK SHARMA',
        role: 'Creative Developer & AI Systems Architect',
        location: 'India / Worldwide',
        availability: 'Available for Select Engagements & Advisory',
        email: 'hello@priyanksharma.dev',
        year: new Date().getFullYear()
    },

    hero: {
        meta: 'WEB DEVELOPER + AI SYSTEMS ARCHITECT — INDIA / AVAILABLE WORLDWIDE',
        intro: 'I build modern, high-performance, and scalable digital experiences combining full-stack architectures, interactive WebGL environments, and intelligent AI systems.',
        headlineLine1: 'CREATIVE',
        headlineLine2: 'DEVELOPER.',
        scrollCue: '(SCROLL)'
    },

    projects: [
        {
            id: 'project-1',
            number: '01',
            title: 'Neural Synthetics',
            category: 'Generative AI Platform',
            year: '2025',
            layout: 'layout-title-left',
            description: 'A low-latency generative interface orchestrating multi-modal diffusion pipelines and real-time semantic canvas manipulations.',
            tech: 'Three.js / PyTorch / WebGPU / FastAPI',
            url: 'https://github.com',
            caseStudyUrl: '#',
            stateKey: 'project-1',
            imageFocus: { x: 0.5, y: 0.5 },
            imageExposure: 1.05,
            bubbleAnchor: { normX: 0.40, normY: 0.0, scale: 1.22 }
        },
        {
            id: 'project-2',
            number: '02',
            title: 'Aether Engine',
            category: 'Real-time 3D & Graphics',
            year: '2024',
            layout: 'layout-bubble-left',
            description: 'Custom WebGL/GLSL rendering pipeline with fluid dynamics, volumetric refraction, and physics-driven interactive spatial choreography.',
            tech: 'WebGL / GLSL / TypeScript / Web Workers',
            url: 'https://github.com',
            caseStudyUrl: '#',
            stateKey: 'project-2',
            imageFocus: { x: 0.5, y: 0.5 },
            imageExposure: 1.08,
            bubbleAnchor: { normX: -0.40, normY: 0.0, scale: 1.22 }
        },
        {
            id: 'project-3',
            number: '03',
            title: 'Chronos Distributed',
            category: 'Autonomous Cloud Architecture',
            year: '2024',
            layout: 'layout-title-top',
            description: 'High-throughput event streaming engine handling millions of concurrent telemetry streams with automated anomaly mitigation.',
            tech: 'Laravel / Go / Kafka / MySQL / Rust',
            url: 'https://github.com',
            caseStudyUrl: '#',
            stateKey: 'project-3',
            imageFocus: { x: 0.5, y: 0.5 },
            imageExposure: 1.05,
            bubbleAnchor: { normX: 0.34, normY: -0.10, scale: 1.18 }
        }
    ],

    about: {
        tag: 'About',
        statement: 'I’m a Web Developer and AI Systems Architect focused on building modern, high-performance digital products that combine engineering rigor with intentional visual craft.',
        narrativeLeft: 'For me, software engineering is more than writing code. It is about understanding complex problems, simplifying systems, and creating digital products that feel fluid, fast, and natural to use.',
        narrativeRight: 'My core stack spans full-stack web architectures (Laravel, PHP, MySQL, REST APIs), bespoke creative frontends (Three.js, WebGL, GLSL shaders, GSAP), and autonomous AI systems (OpenAI, Gemini APIs, Vector Search, intelligent workflows)—merging engineering rigor with intentional visual craft.',
        linkText: 'Initiate a Conversation &rarr;',
        linkHref: '#contact'
    },

    skills: [
        {
            category: 'Frontend & UI',
            items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TailwindCSS', 'Bootstrap', 'jQuery']
        },
        {
            category: 'Backend & Cloud',
            items: ['PHP', 'Laravel', 'Node.js', 'Python', 'RESTful APIs']
        },
        {
            category: 'Databases & Cache',
            items: ['MySQL', 'PostgreSQL', 'Redis']
        },
        {
            category: 'Interactive & 3D',
            items: ['Three.js', 'WebGL', 'GLSL Shaders', 'GSAP', 'ScrollTrigger']
        },
        {
            category: 'AI & Automation',
            items: ['OpenAI APIs', 'Gemini APIs', 'Vector Search', 'Agentic Workflows']
        }
    ],

    capabilities: [
        {
            numeral: '01',
            title: 'Full-Stack Web Development',
            description: 'Building complete, resilient web applications across modern frontend interfaces, secure authentication flows, admin/member dashboards, and scalable database schemas.',
            tech: 'Laravel / PHP / MySQL / JavaScript / Tailwind'
        },
        {
            numeral: '02',
            title: 'Creative Frontend & WebGL',
            description: 'Engineering fluid spatial web experiences, bespoke GLSL shaders, 60fps animations, accessible DOM choreography, and custom UI engines.',
            tech: 'Three.js / GLSL / GSAP / TypeScript / WebGL'
        },
        {
            numeral: '03',
            title: 'AI Integration & Automation',
            description: 'Developing autonomous agentic workflows, LLM integrations, retrieval-augmented generation (RAG), embeddings pipelines, and real-time intelligent solutions.',
            tech: 'OpenAI / Gemini APIs / Python / Vector DBs'
        },
        {
            numeral: '04',
            title: 'API Architecture & Cloud Systems',
            description: 'Designing ultra-low latency RESTful microservices, WebSocket streams, automated CI/CD deployment pipelines, and cloud-native infrastructure.',
            tech: 'REST APIs / Docker / Redis / Cloudflare / gRPC'
        }
    ],

    journal: [
        {
            id: 'journal-1',
            date: 'OCTOBER 2025',
            category: 'ENGINEERING',
            title: 'Architecting Persistent Liquid Shaders for High-DPI Displays',
            description: 'Deep dive into multi-octave 3D Simplex noise, analytical normal recalculation, and chromatic aberration under fixed GPU memory bounds.',
            link: 'https://github.com',
            stateKey: 'journal-1',
            imageFocus: { x: 0.5, y: 0.5 },
            imageExposure: 1.05,
            bubbleAnchor: { normX: 0.34, normY: 0.0, scale: 1.16 }
        },
        {
            id: 'journal-2',
            date: 'AUGUST 2025',
            category: 'SYSTEMS',
            title: 'Real-time Vector Search Latency Optimization Under High Concurrency',
            description: 'Benchmarking HNSW indices, quantized embeddings, and low-latency gRPC streaming architectures across distributed nodes.',
            link: 'https://github.com',
            stateKey: 'journal-2',
            imageFocus: { x: 0.5, y: 0.5 },
            imageExposure: 1.05,
            bubbleAnchor: { normX: -0.32, normY: 0.0, scale: 1.16 }
        },
        {
            id: 'journal-3',
            date: 'MAY 2025',
            category: 'INTERACTION',
            title: 'The Mathematics of Organic Damping in Pointer-Driven WebGL',
            description: 'Formulating frame-rate independent exponential damping, viscous mass lag, and screen-to-world raycasting physics.',
            link: 'https://github.com',
            stateKey: 'journal-3',
            imageFocus: { x: 0.5, y: 0.5 },
            imageExposure: 1.05,
            bubbleAnchor: { normX: 0.32, normY: -0.05, scale: 1.16 }
        }
    ],

    location: {
        tag: 'Origin & Reach',
        label: 'BASED IN',
        headline: 'INDIA',
        subline: '/ AVAILABLE WORLDWIDE',
        meta: [
            { label: 'Timezone', value: 'IST (UTC+5:30)' },
            { label: 'Engagement Model', value: 'Remote & Select Advisory' },
            { label: 'Current Status', value: 'Open for High-Impact Projects' }
        ]
    },

    contact: {
        tag: 'Contact & Inquiries',
        workWithMe: {
            title: 'Work With Me',
            email: 'hello@priyanksharma.dev',
            description: 'Available for freelance engineering contracts, technical advisory, and high-impact digital ventures.'
        },
        followMe: {
            title: 'Follow Me',
            links: [
                { name: 'GitHub', url: 'https://github.com' },
                { name: 'LinkedIn', url: 'https://linkedin.com' },
                { name: 'X / Twitter', url: 'https://x.com' },
                { name: 'Read.cv', url: '#' }
            ]
        },
        availability: {
            title: 'Availability',
            description: 'Currently scheduling software architecture, creative WebGL, and generative AI engineering engagements for Q3/Q4.',
            note: 'Based in India • Operating globally across all timezones.'
        }
    }
};
