<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Priyank Sharma — Creative Developer & AI Systems Architect. High-performance digital experiences, WebGL environments, and intelligent systems.">
    <title>Priyank Sharma &mdash; Creative Developer & AI Systems Architect</title>

    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="layer-bg">

    <!-- Accessibility Skip Link -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Persistent Single WebGL Canvas (Phase 1-11 Persistent Architecture) -->
    <div class="webgl-canvas-container" aria-hidden="true">
        <canvas id="webgl-canvas"></canvas>
    </div>

    <!-- Global Fullscreen Menu Overlay (Phase 9 Master Navigation) -->
    <div id="menu-overlay" class="menu-overlay" aria-hidden="true">
        <div class="menu-overlay-shell">
            <div class="menu-header">
                <span class="menu-tag">Navigation</span>
                <button class="menu-close-btn" aria-label="Close navigation menu" type="button">
                    <span class="close-line-1"></span>
                    <span class="close-line-2"></span>
                </button>
            </div>
            <nav class="menu-nav" aria-label="Main Navigation">
                <ul class="menu-nav-list">
                    <li>
                        <a href="#home" class="menu-nav-link">
                            <span class="menu-num">01</span>
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#work" class="menu-nav-link">
                            <span class="menu-num">02</span>
                            <span>Selected Work</span>
                            <span class="menu-count">03</span>
                        </a>
                    </li>
                    <li>
                        <a href="#about" class="menu-nav-link">
                            <span class="menu-num">03</span>
                            <span>About</span>
                        </a>
                    </li>
                    <li>
                        <a href="#capabilities" class="menu-nav-link">
                            <span class="menu-num">04</span>
                            <span>Capabilities</span>
                            <span class="menu-count">04</span>
                        </a>
                    </li>
                    <li>
                        <a href="#journal" class="menu-nav-link">
                            <span class="menu-num">05</span>
                            <span>Journal &amp; Insights</span>
                            <span class="menu-count">03</span>
                        </a>
                    </li>
                    <li>
                        <a href="#location" class="menu-nav-link">
                            <span class="menu-num">06</span>
                            <span>Location</span>
                        </a>
                    </li>
                    <li>
                        <a href="#contact" class="menu-nav-link">
                            <span class="menu-num">07</span>
                            <span>Contact</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="menu-footer">
                <div class="menu-footer-col">
                    <span class="meta-label">Direct Channel</span>
                    <a href="mailto:hello@priyanksharma.dev" class="editorial-link">hello@priyanksharma.dev</a>
                </div>
                <div class="menu-footer-col">
                    <span class="meta-label">Location</span>
                    <span class="meta-value">India / Worldwide</span>
                </div>
                <div class="menu-footer-col">
                    <span class="meta-label">Status</span>
                    <span class="meta-value">Open for Select Projects</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Fixed Minimal Header -->
    <header id="site-header" class="site-header">
        <a href="#home" class="brand-identity" aria-label="Priyank Sharma - Return to top">
            <span class="brand-name">Priyank Sharma</span>
            <span class="brand-role">/ Creative Dev &amp; AI</span>
        </a>
        <div class="header-controls">
            <button class="menu-trigger" aria-label="Toggle navigation menu" aria-controls="menu-overlay" aria-expanded="false" type="button">
                <div class="menu-trigger-icon" aria-hidden="true">
                    <span class="line-1"></span>
                    <span class="line-2"></span>
                </div>
            </button>
        </div>
    </header>

    <!-- Main Editorial DOM Content -->
    <main id="main-content" class="page-shell">

        <!-- 1. HERO SECTION -->
        <section id="home" class="section hero-section" data-state="hero">
            <div class="hero-meta-top">
                <p class="meta-hero">WEB DEVELOPER + AI SYSTEMS ARCHITECT &mdash; INDIA / AVAILABLE WORLDWIDE</p>
            </div>

            <div class="hero-main-typography">
                <p class="hero-intro-text">
                    I build modern, high-performance, and scalable digital experiences combining full-stack architectures, interactive WebGL environments, and intelligent AI systems.
                </p>
                <h1 class="display-xl hero-headline">
                    <span>CREATIVE</span>
                    <span>DEVELOPER.</span>
                </h1>
            </div>

            <div class="hero-footer-bar">
                <div class="hero-scroll-cue" aria-hidden="true">
                    <span>(SCROLL)</span>
                </div>
            </div>
        </section>

        <!-- 2. SELECTED WORK / PROJECTS SECTION -->
        <section id="work" class="projects-master-container">
            <div class="projects-sticky-header">
                <div class="section-indicator">
                    <span class="arrow">&searr;</span>
                    <span>Selected Work</span>
                </div>
                <div class="project-pagination">
                    <span id="project-active-num" class="pagination-active">01</span>
                    <span class="pagination-divider">/</span>
                    <span class="pagination-total">03</span>
                </div>
            </div>

            <!-- Project 01: Layout A (Title Left, Bubble Right) -->
            <article id="project-1" class="section project-item layout-title-left" data-project="1" data-state="project-1">
                <div class="project-grid">
                    <div class="project-info-zone">
                        <div class="project-meta-row">
                            <span class="meta-label">Generative AI Platform</span>
                            <span class="meta-label">2025</span>
                        </div>
                        <h2 class="display-lg project-title">
                            NEURAL<br>SYNTHETICS
                        </h2>
                        <p class="body-large project-desc">
                            A low-latency generative interface orchestrating multi-modal diffusion pipelines and real-time semantic canvas manipulations.
                        </p>
                        <div class="project-tech-line">
                            Three.js / PyTorch / WebGPU / FastAPI
                        </div>
                        <div class="project-actions">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">
                                Explore Architecture &rarr;
                            </a>
                        </div>
                    </div>
                    <div class="project-visual-zone" aria-hidden="true"></div>
                </div>
            </article>

            <!-- Project 02: Layout B (Bubble Left, Title Right) -->
            <article id="project-2" class="section project-item layout-bubble-left" data-project="2" data-state="project-2">
                <div class="project-grid">
                    <div class="project-visual-zone" aria-hidden="true"></div>
                    <div class="project-info-zone">
                        <div class="project-meta-row">
                            <span class="meta-label">Real-time 3D &amp; Graphics</span>
                            <span class="meta-label">2024</span>
                        </div>
                        <h2 class="display-lg project-title">
                            AETHER<br>ENGINE
                        </h2>
                        <p class="body-large project-desc">
                            Custom WebGL/GLSL rendering pipeline with fluid dynamics, volumetric refraction, and physics-driven interactive spatial choreography.
                        </p>
                        <div class="project-tech-line">
                            WebGL / GLSL / TypeScript / Web Workers
                        </div>
                        <div class="project-actions">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">
                                Explore Architecture &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </article>

            <!-- Project 03: Layout C (Title Top, Bubble Lower) -->
            <article id="project-3" class="section project-item layout-title-top" data-project="3" data-state="project-3">
                <div class="project-grid">
                    <div class="project-info-zone">
                        <div class="project-meta-row">
                            <span class="meta-label">Autonomous Cloud Architecture</span>
                            <span class="meta-label">2024</span>
                        </div>
                        <h2 class="display-lg project-title">
                            CHRONOS<br>DISTRIBUTED
                        </h2>
                        <div class="project-split-details">
                            <p class="body-large project-desc">
                                High-throughput event streaming engine handling millions of concurrent telemetry streams with automated anomaly mitigation.
                            </p>
                            <div class="project-right-meta">
                                <div class="project-tech-line">
                                    Laravel / Go / Kafka / MySQL / Rust
                                </div>
                                <div class="project-actions">
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">
                                        Explore Architecture &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="project-visual-zone" aria-hidden="true"></div>
                </div>
            </article>
        </section>

        <!-- 3. ABOUT ME / PERSONAL STORY SECTION -->
        <section id="about" class="section about-section" data-state="about">
            <div class="about-grid">
                <div class="section-indicator">
                    <span class="arrow">&searr;</span>
                    <span>About</span>
                </div>
                <div class="about-content">
                    <p class="about-statement">
                        I&rsquo;m a Web Developer and AI Systems Architect focused on building modern, high-performance digital products that combine engineering rigor with intentional visual craft.
                    </p>
                    <div class="about-narrative">
                        <p class="body-copy">
                            For me, software engineering is more than writing code. It is about understanding complex problems, simplifying systems, and creating digital products that feel fluid, fast, and natural to use.
                        </p>
                        <p class="body-copy">
                            My core stack spans full-stack web architectures (Laravel, PHP, MySQL, REST APIs), bespoke creative frontends (Three.js, WebGL, GLSL shaders, GSAP), and autonomous AI systems (OpenAI, Gemini APIs, Vector Search, intelligent workflows)&mdash;merging engineering rigor with intentional visual craft.
                        </p>
                    </div>
                    <div class="about-action">
                        <a href="#contact" class="editorial-link">
                            Initiate a Conversation &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4. CAPABILITIES / EXPERTISE SECTION (01-04 Four-Column Grid) -->
        <section id="capabilities" class="section capabilities-section" data-state="capabilities">
            <div class="section-header-row">
                <div class="section-indicator">
                    <span class="arrow">&searr;</span>
                    <span>Capabilities / 01&ndash;04</span>
                </div>
                <div class="meta-label">Core Competencies</div>
            </div>

            <div class="capabilities-grid">
                <!-- Column 01 -->
                <article class="capability-column" data-capability-col="1">
                    <div class="capability-top">
                        <div class="capability-numeral">01</div>
                        <h3 class="capability-title">Full-Stack Web Development</h3>
                        <p class="capability-desc">
                            Building complete, resilient web applications across modern frontend interfaces, secure authentication flows, admin/member dashboards, and scalable database schemas.
                        </p>
                    </div>
                    <div class="capability-tech-text">
                        Laravel / PHP / MySQL / JavaScript / Tailwind
                    </div>
                </article>

                <!-- Column 02 -->
                <article class="capability-column" data-capability-col="2">
                    <div class="capability-top">
                        <div class="capability-numeral">02</div>
                        <h3 class="capability-title">Creative Frontend &amp; WebGL</h3>
                        <p class="capability-desc">
                            Engineering fluid spatial web experiences, bespoke GLSL shaders, 60fps animations, accessible DOM choreography, and custom UI engines.
                        </p>
                    </div>
                    <div class="capability-tech-text">
                        Three.js / GLSL / GSAP / TypeScript / WebGL
                    </div>
                </article>

                <!-- Column 03 -->
                <article class="capability-column" data-capability-col="3">
                    <div class="capability-top">
                        <div class="capability-numeral">03</div>
                        <h3 class="capability-title">AI Integration &amp; Automation</h3>
                        <p class="capability-desc">
                            Developing autonomous agentic workflows, LLM integrations, retrieval-augmented generation (RAG), embeddings pipelines, and real-time intelligent solutions.
                        </p>
                    </div>
                    <div class="capability-tech-text">
                        OpenAI / Gemini APIs / Python / Vector DBs
                    </div>
                </article>

                <!-- Column 04 -->
                <article class="capability-column" data-capability-col="4">
                    <div class="capability-top">
                        <div class="capability-numeral">04</div>
                        <h3 class="capability-title">API Architecture &amp; Cloud Systems</h3>
                        <p class="capability-desc">
                            Designing ultra-low latency RESTful microservices, WebSocket streams, automated CI/CD deployment pipelines, and cloud-native infrastructure.
                        </p>
                    </div>
                    <div class="capability-tech-text">
                        REST APIs / Docker / Redis / Cloudflare / gRPC
                    </div>
                </article>
            </div>
        </section>

        <!-- 5. JOURNAL / INSIGHTS / TECHNICAL NOTES -->
        <section id="journal" class="section journal-section" data-state="journal">
            <div class="section-header-row">
                <div class="section-indicator">
                    <span class="arrow">&searr;</span>
                    <span>Journal &amp; Insights</span>
                </div>
                <div class="meta-label">Selected Technical Notes</div>
            </div>

            <div class="journal-list">
                <!-- Note 01 -->
                <article id="journal-1" class="journal-row" data-state="journal-1">
                    <div class="journal-row-grid">
                        <div class="journal-row-meta">
                            <time class="journal-date" datetime="2025-10">OCTOBER 2025</time>
                            <span class="journal-category">Engineering</span>
                        </div>
                        <div class="journal-row-content">
                            <h3 class="journal-title">Architecting Persistent Liquid Shaders for High-DPI Displays</h3>
                            <p class="journal-desc">
                                Deep dive into multi-octave 3D Simplex noise, analytical normal recalculation, and chromatic aberration under fixed GPU memory bounds.
                            </p>
                        </div>
                        <div class="journal-row-action">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">Read Note &rarr;</a>
                        </div>
                    </div>
                </article>

                <!-- Note 02 -->
                <article id="journal-2" class="journal-row" data-state="journal-2">
                    <div class="journal-row-grid">
                        <div class="journal-row-meta">
                            <time class="journal-date" datetime="2025-08">AUGUST 2025</time>
                            <span class="journal-category">Systems</span>
                        </div>
                        <div class="journal-row-content">
                            <h3 class="journal-title">Real-time Vector Search Latency Optimization Under High Concurrency</h3>
                            <p class="journal-desc">
                                Benchmarking HNSW indices, quantized embeddings, and low-latency gRPC streaming architectures across distributed nodes.
                            </p>
                        </div>
                        <div class="journal-row-action">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">Read Note &rarr;</a>
                        </div>
                    </div>
                </article>

                <!-- Note 03 -->
                <article id="journal-3" class="journal-row" data-state="journal-3">
                    <div class="journal-row-grid">
                        <div class="journal-row-meta">
                            <time class="journal-date" datetime="2025-05">MAY 2025</time>
                            <span class="journal-category">Interaction</span>
                        </div>
                        <div class="journal-row-content">
                            <h3 class="journal-title">The Mathematics of Organic Damping in Pointer-Driven WebGL</h3>
                            <p class="journal-desc">
                                Formulating frame-rate independent exponential damping, viscous mass lag, and screen-to-world raycasting physics.
                            </p>
                        </div>
                        <div class="journal-row-action">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">Read Note &rarr;</a>
                        </div>
                    </div>
                </article>
            </div>
        </section>

        <!-- 6. LOCATION / PERSONAL IDENTITY SECTION -->
        <section id="location" class="section location-section" data-state="location">
            <div class="location-grid">
                <div class="section-indicator">
                    <span class="arrow">&searr;</span>
                    <span>Origin &amp; Reach</span>
                </div>
                <div class="location-content">
                    <div class="location-label">BASED IN</div>
                    <h2 class="location-title">INDIA</h2>
                    <div class="location-suffix">/ AVAILABLE WORLDWIDE</div>
                    <div class="location-meta-grid">
                        <div>
                            <span class="meta-label">Timezone</span>
                            <div class="meta-value">IST (UTC+5:30)</div>
                        </div>
                        <div>
                            <span class="meta-label">Engagement Model</span>
                            <div class="meta-value">Remote &amp; Select Advisory</div>
                        </div>
                        <div>
                            <span class="meta-label">Current Status</span>
                            <div class="meta-value">Open for High-Impact Projects</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 7. CONTACT / INQUIRIES SECTION -->
        <section id="contact" class="section contact-section" data-state="contact">
            <div class="contact-grid">
                <div class="section-indicator">
                    <span class="arrow">&searr;</span>
                    <span>Contact &amp; Inquiries</span>
                </div>
                <div class="contact-content">
                    <div class="contact-editorial-grid">
                        <!-- Column 01: Work With Me -->
                        <div class="contact-col">
                            <span class="contact-col-label">Work With Me</span>
                            <a href="mailto:hello@priyanksharma.dev" class="contact-email">hello@priyanksharma.dev</a>
                            <p class="contact-col-desc">
                                Available for freelance engineering contracts, technical advisory, and high-impact digital ventures.
                            </p>
                        </div>

                        <!-- Column 02: Follow Me -->
                        <div class="contact-col">
                            <span class="contact-col-label">Follow Me</span>
                            <ul class="contact-links-list">
                                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">GitHub &nearr;</a></li>
                                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="editorial-link">LinkedIn &nearr;</a></li>
                                <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" class="editorial-link">X / Twitter &nearr;</a></li>
                                <li><a href="#" class="editorial-link">Read.cv &nearr;</a></li>
                            </ul>
                        </div>

                        <!-- Column 03: Availability & Logistics -->
                        <div class="contact-col">
                            <span class="contact-col-label">Availability</span>
                            <p class="contact-col-desc">
                                Currently scheduling software architecture, creative WebGL, and generative AI engineering engagements for Q3/Q4.
                            </p>
                            <div class="contact-location-note">
                                Based in India &bull; Operating globally across all timezones.
                            </div>
                        </div>
                    </div>
                    <div class="contact-divider"></div>
                </div>
            </div>
        </section>
    </main>

    <!-- 8. SITE FOOTER (Phase 9 Master Editorial Publication Grid) -->
    <footer id="site-footer" class="site-footer page-shell" data-state="footer">
        <div class="footer-grid">
            <!-- Column 01: Primary Navigation -->
            <div class="footer-col">
                <span class="footer-col-label">Navigation</span>
                <ul class="footer-nav-list">
                    <li><a href="#home" class="footer-nav-link">Home</a></li>
                    <li><a href="#work" class="footer-nav-link">Selected Work <sup>03</sup></a></li>
                    <li><a href="#about" class="footer-nav-link">About</a></li>
                    <li><a href="#capabilities" class="footer-nav-link">Capabilities <sup>04</sup></a></li>
                    <li><a href="#journal" class="footer-nav-link">Journal &amp; Insights <sup>03</sup></a></li>
                    <li><a href="#contact" class="footer-nav-link">Contact</a></li>
                </ul>
            </div>

            <!-- Column 02: Direct Channels / Social -->
            <div class="footer-col">
                <span class="footer-col-label">Connect</span>
                <ul class="footer-nav-list">
                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" class="editorial-link">GitHub &nearr;</a></li>
                    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="editorial-link">LinkedIn &nearr;</a></li>
                    <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" class="editorial-link">X / Twitter &nearr;</a></li>
                    <li><a href="#" class="editorial-link">Read.cv &nearr;</a></li>
                </ul>
            </div>

            <!-- Column 03: Inquiries -->
            <div class="footer-col">
                <span class="footer-col-label">Inquiries</span>
                <a href="mailto:hello@priyanksharma.dev" class="contact-email">hello@priyanksharma.dev</a>
                <p class="footer-desc">
                    Available for select engineering contracts, architecture advisory, and high-impact digital ventures.
                </p>
            </div>
        </div>

        <div class="footer-bottom-row">
            <div class="footer-copyright">
                &copy; {{ date('Y') }} Priyank Sharma. All Rights Reserved.
            </div>
            <div class="footer-meta">
                India / Available Worldwide &mdash; IST (UTC+5:30)
            </div>
        </div>
    </footer>

</body>
</html>
