import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimationController manages GSAP ScrollTriggers, smooth scroll, 
 * opening reveal choreography, and master project, about, capabilities, journal, location, contact, & footer transitions.
 */
export class AnimationController {
    constructor(webglEngine) {
        this.webgl = webglEngine;
        this.lenis = null;
        this.triggers = [];
        this.openingTimeline = null;
        this.activeProjectIndex = 1;

        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupHeroExitScroll();
        this.setupProjectChoreography();
        this.setupAboutChoreography();
        this.setupCapabilitiesChoreography();
        this.setupJournalChoreography();
        this.setupLocationAndContactChoreography();
        this.setupFooterChoreography();
        this.playOpeningReveal();
    }

    setupSmoothScroll() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        try {
            this.lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: false
            });

            this.lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } catch (e) {
            console.warn('[AnimationController] Smooth scroll fallback to native', e);
        }
    }

    playOpeningReveal() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Activate WebGL bubble reveal
        if (this.webgl) {
            this.webgl.triggerReveal();
        }

        if (prefersReducedMotion) {
            gsap.set(['.site-header', '.hero-meta-top', '.hero-intro-text', '.hero-headline span', '.hero-scroll-cue'], {
                opacity: 1,
                y: 0
            });
            return;
        }

        // Staged Editorial Reveal Timeline (0.8s - 1.2s total)
        this.openingTimeline = gsap.timeline({
            defaults: {
                ease: 'power3.out',
                duration: 0.85
            }
        });

        gsap.set('.site-header', { opacity: 0, y: -12 });
        gsap.set('.hero-meta-top', { opacity: 0, y: 14 });
        gsap.set('.hero-intro-text', { opacity: 0, y: 16 });
        gsap.set('.hero-headline span', { opacity: 0, y: 28 });
        gsap.set('.hero-scroll-cue', { opacity: 0, y: 10 });

        this.openingTimeline
            .to('.site-header', { opacity: 1, y: 0, duration: 0.7 }, 0.1)
            .to('.hero-meta-top', { opacity: 1, y: 0, duration: 0.7 }, 0.25)
            .to('.hero-intro-text', { opacity: 1, y: 0, duration: 0.8 }, 0.35)
            .to('.hero-headline span', { opacity: 1, y: 0, stagger: 0.12, duration: 0.95 }, 0.45)
            .to('.hero-scroll-cue', { opacity: 0.85, y: 0, duration: 0.6 }, 0.75);
    }

    setupHeroExitScroll() {
        const heroSection = document.querySelector('#home');
        const heroHeadline = document.querySelector('.hero-headline');
        const heroScrollCue = document.querySelector('.hero-scroll-cue');

        if (!heroSection) return;

        const headlineTrigger = ScrollTrigger.create({
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
                if (heroHeadline) {
                    gsap.set(heroHeadline, {
                        y: -self.progress * 80,
                        opacity: 1 - self.progress * 0.8
                    });
                }
                if (heroScrollCue) {
                    gsap.set(heroScrollCue, {
                        opacity: Math.max(0, 0.85 - self.progress * 4)
                    });
                }
            }
        });
        this.triggers.push(headlineTrigger);
    }

    /**
     * Phase 4: Master Scroll-Driven Project Choreography (Bidirectional Scrubbing)
     */
    setupProjectChoreography() {
        if (!this.webgl) return;

        const p1 = document.querySelector('#project-1');
        const p2 = document.querySelector('#project-2');
        const p3 = document.querySelector('#project-3');
        const paginationNum = document.querySelector('#project-active-num');

        // Helper to update pagination number safely
        const updatePagination = (numStr) => {
            if (paginationNum && paginationNum.textContent !== numStr) {
                gsap.to(paginationNum, {
                    opacity: 0,
                    y: -4,
                    duration: 0.15,
                    onComplete: () => {
                        paginationNum.textContent = numStr;
                        gsap.to(paginationNum, { opacity: 1, y: 0, duration: 0.2 });
                    }
                });
            }
        };

        // 1. HERO -> PROJECT 01 TRANSITION
        if (p1) {
            const heroToP1Trigger = ScrollTrigger.create({
                trigger: p1,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;
                    // Transition bubble from hero anchor (0.26, -0.02) to p1 anchor (0.40, 0.0)
                    const normX = 0.26 + (0.40 - 0.26) * prog;
                    const normY = -0.02 + (0.00 - (-0.02)) * prog;
                    const scale = 1.28 + (1.22 - 1.28) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;

                    // Crossfade from portrait (Texture A) to project-1 (Texture B)
                    this.webgl.setProjectTransition('portrait', 'project-1', prog, 1.0);

                    if (prog > 0.5) updatePagination('01');
                },
                onLeaveBack: () => {
                    this.webgl.setProjectTexture('portrait');
                    updatePagination('01');
                }
            });
            this.triggers.push(heroToP1Trigger);
        }

        // 2. PROJECT 01 -> PROJECT 02 TRANSITION
        if (p1 && p2) {
            const p1ToP2Trigger = ScrollTrigger.create({
                trigger: p2,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;
                    // Transition bubble from p1 anchor (0.38, 0.0) to p2 anchor (-0.38, 0.0)
                    const normX = 0.38 + (-0.38 - 0.38) * prog;
                    const normY = 0.0;
                    const scale = 1.20;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;

                    // Crossfade Texture A (Project 1) -> Texture B (Project 2)
                    this.webgl.setProjectTransition('project-1', 'project-2', prog, 1.0);

                    // Parallax text transitions
                    const p1Title = p1.querySelector('.project-title');
                    const p2Title = p2.querySelector('.project-title');
                    if (p1Title) gsap.set(p1Title, { y: -prog * 50, opacity: 1 - prog });
                    if (p2Title) gsap.set(p2Title, { y: (1 - prog) * 50, opacity: prog });

                    if (prog >= 0.5) {
                        updatePagination('02');
                    } else {
                        updatePagination('01');
                    }
                },
                onLeaveBack: () => {
                    updatePagination('01');
                }
            });
            this.triggers.push(p1ToP2Trigger);
        }

        // 3. PROJECT 02 -> PROJECT 03 TRANSITION
        if (p2 && p3) {
            const p2ToP3Trigger = ScrollTrigger.create({
                trigger: p3,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;
                    // Transition bubble from p2 anchor (-0.38, 0.0) to p3 anchor (0.32, -0.10)
                    const normX = -0.38 + (0.32 - (-0.38)) * prog;
                    const normY = 0.0 + (-0.10 - 0.0) * prog;
                    const scale = 1.20 + (1.15 - 1.20) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;

                    // Crossfade Texture A (Project 2) -> Texture B (Project 3)
                    this.webgl.setProjectTransition('project-2', 'project-3', prog, 1.0);

                    // Parallax text transitions
                    const p2Title = p2.querySelector('.project-title');
                    const p3Title = p3.querySelector('.project-title');
                    if (p2Title) gsap.set(p2Title, { y: -prog * 50, opacity: 1 - prog });
                    if (p3Title) gsap.set(p3Title, { y: (1 - prog) * 50, opacity: prog });

                    if (prog >= 0.5) {
                        updatePagination('03');
                    } else {
                        updatePagination('02');
                    }
                },
                onLeaveBack: () => {
                    updatePagination('02');
                }
            });
            this.triggers.push(p2ToP3Trigger);
        }
    }

    /**
     * Phase 5: Master About Me Choreography & Dark Bubble Overlap
     */
    setupAboutChoreography() {
        if (!this.webgl) return;

        const p3 = document.querySelector('#project-3');
        const aboutSection = document.querySelector('#about');
        const capabilitiesSection = document.querySelector('#capabilities');

        if (!aboutSection) return;

        const aboutStatement = aboutSection.querySelector('.about-statement');
        const aboutNarrative = aboutSection.querySelector('.about-narrative');
        const aboutLink = aboutSection.querySelector('.editorial-link');

        // 1. PROJECT 03 -> ABOUT TRANSITION
        if (p3) {
            const p3ToAboutTrigger = ScrollTrigger.create({
                trigger: aboutSection,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Glide bubble from Project 03 anchor (0.32, -0.10) to About anchor (0.36, 0.04)
                    const normX = 0.32 + (0.36 - 0.32) * prog;
                    const normY = -0.10 + (0.04 - (-0.10)) * prog;
                    const scale = 1.15 + (1.05 - 1.15) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;
                    this.webgl.stateController.target.pointerInfluence = 0.16 + (0.14 - 0.16) * prog;

                    // Fade out Project 03 image into dark smoked glass: imageMode 1.0 -> 0.0
                    this.webgl.setImageMode(1.0 - prog);

                    // Project 3 exit parallax
                    const p3Title = p3.querySelector('.project-title');
                    if (p3Title) gsap.set(p3Title, { y: -prog * 50, opacity: 1 - prog });

                    // About entry parallax
                    if (aboutStatement) {
                        gsap.set(aboutStatement, {
                            y: (1 - prog) * 45,
                            opacity: Math.min(1, prog * 1.3)
                        });
                    }
                    if (aboutNarrative) {
                        gsap.set(aboutNarrative, {
                            y: (1 - prog) * 25,
                            opacity: Math.max(0, (prog - 0.2) * 1.25)
                        });
                    }
                    if (aboutLink) {
                        gsap.set(aboutLink, {
                            y: (1 - prog) * 15,
                            opacity: Math.max(0, (prog - 0.3) * 1.4)
                        });
                    }
                },
                onLeaveBack: () => {
                    this.webgl.setProjectTexture('project-3');
                }
            });
            this.triggers.push(p3ToAboutTrigger);
        }

        // 2. ABOUT -> CAPABILITIES HANDOFF TRANSITION
        if (capabilitiesSection) {
            const aboutToCapTrigger = ScrollTrigger.create({
                trigger: capabilitiesSection,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Glide bubble from About anchor (0.36, 0.04, scale 1.05) to Capabilities anchor (-0.28, -0.04, scale 1.28)
                    const normX = 0.36 + (-0.28 - 0.36) * prog;
                    const normY = 0.04 + (-0.04 - 0.04) * prog;
                    const scale = 1.05 + (1.28 - 1.05) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;
                    this.webgl.stateController.target.pointerInfluence = 0.14 + (0.12 - 0.14) * prog;

                    // Keep bubble in dark smoked glass state
                    this.webgl.setImageMode(0.0);

                    // About exit parallax
                    if (aboutStatement) {
                        gsap.set(aboutStatement, { y: -prog * 60, opacity: 1 - prog });
                    }
                    if (aboutNarrative) {
                        gsap.set(aboutNarrative, { y: -prog * 40, opacity: 1 - prog });
                    }
                    if (aboutLink) {
                        gsap.set(aboutLink, { y: -prog * 25, opacity: 1 - prog });
                    }
                }
            });
            this.triggers.push(aboutToCapTrigger);
        }
    }

    /**
     * Phase 6: Master Capabilities Four-Column Grid & Bubble Traversal
     */
    setupCapabilitiesChoreography() {
        if (!this.webgl) return;

        const capabilitiesSection = document.querySelector('#capabilities');
        const journalSection = document.querySelector('#journal');

        if (!capabilitiesSection) return;

        const numerals = capabilitiesSection.querySelectorAll('.capability-numeral');
        const topContents = capabilitiesSection.querySelectorAll('.capability-top');
        const techTexts = capabilitiesSection.querySelectorAll('.capability-tech-text');

        // 1. CAPABILITIES ENTRY & NUMERALS PARALLAX
        const capEntryTrigger = ScrollTrigger.create({
            trigger: capabilitiesSection,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
            onUpdate: (self) => {
                const prog = self.progress;

                numerals.forEach((num, i) => {
                    gsap.set(num, {
                        y: (1 - prog) * (60 + i * 15),
                        opacity: Math.min(1, prog * 1.4)
                    });
                });

                topContents.forEach((top, i) => {
                    gsap.set(top, {
                        y: (1 - prog) * (30 + i * 10),
                        opacity: Math.max(0, (prog - 0.15) * 1.25)
                    });
                });

                techTexts.forEach((tech) => {
                    gsap.set(tech, {
                        opacity: Math.max(0, (prog - 0.25) * 1.33)
                    });
                });
            }
        });
        this.triggers.push(capEntryTrigger);

        // 2. BUBBLE MULTI-WAYPOINT TRAVERSAL ACROSS THE 4 COLUMNS
        const capTraversalTrigger = ScrollTrigger.create({
            trigger: capabilitiesSection,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            onUpdate: (self) => {
                const prog = self.progress;

                let normX, normY, scale;

                if (prog <= 0.45) {
                    // Waypoint 1 -> Waypoint 2: Columns 01/02 (-0.28, -0.04) to Center/Col 03 (0.12, 0.02)
                    const subProg = prog / 0.45;
                    normX = -0.28 + (0.12 - (-0.28)) * subProg;
                    normY = -0.04 + (0.02 - (-0.04)) * subProg;
                    scale = 1.28 + (1.35 - 1.28) * subProg;
                } else {
                    // Waypoint 2 -> Waypoint 3: Center/Col 03 (0.12, 0.02) to Col 04/Journal Anchor (0.38, 0.00)
                    const subProg = (prog - 0.45) / 0.55;
                    normX = 0.12 + (0.38 - 0.12) * subProg;
                    normY = 0.02 + (0.00 - 0.02) * subProg;
                    scale = 1.35 + (1.10 - 1.35) * subProg;
                }

                this.webgl.stateController.target.normX = normX;
                this.webgl.stateController.target.normY = normY;
                this.webgl.stateController.target.scale = scale;
                this.webgl.stateController.target.pointerInfluence = 0.12;

                // Continuous dark smoked glass mode
                this.webgl.setImageMode(0.0);
            }
        });
        this.triggers.push(capTraversalTrigger);

        // 3. CAPABILITIES -> JOURNAL HANDOFF TRANSITION
        if (journalSection) {
            const capToJournalTrigger = ScrollTrigger.create({
                trigger: journalSection,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Capabilities exit parallax
                    const capGrid = capabilitiesSection.querySelector('.capabilities-grid');
                    if (capGrid) {
                        gsap.set(capGrid, {
                            y: -prog * 50,
                            opacity: 1 - prog
                        });
                    }
                }
            });
            this.triggers.push(capToJournalTrigger);
        }
    }

    /**
     * Phase 7: Master Journal / Technical Notes Editorial Rows & Image Switching
     */
    setupJournalChoreography() {
        if (!this.webgl) return;

        const j1 = document.querySelector('#journal-1');
        const j2 = document.querySelector('#journal-2');
        const j3 = document.querySelector('#journal-3');

        // 1. CAPABILITIES -> JOURNAL 01 TRANSITION
        if (j1) {
            const capToJ1Trigger = ScrollTrigger.create({
                trigger: j1,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Transition bubble from Capabilities exit (0.38, 0.00) to Journal 01 (0.35, 0.00)
                    const normX = 0.38 + (0.35 - 0.38) * prog;
                    const normY = 0.0;
                    const scale = 1.10 + (1.15 - 1.10) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;
                    this.webgl.stateController.target.pointerInfluence = 0.14;

                    // Crossfade dark smoked glass -> Journal 01 Image
                    this.webgl.setProjectTransition('hero', 'journal-1', prog, prog);

                    // Journal 01 reveal parallax
                    gsap.set(j1, {
                        y: (1 - prog) * 45,
                        opacity: Math.min(1, prog * 1.4)
                    });
                },
                onLeaveBack: () => {
                    this.webgl.setImageMode(0.0);
                }
            });
            this.triggers.push(capToJ1Trigger);
        }

        // 2. JOURNAL 01 -> JOURNAL 02 TRANSITION
        if (j1 && j2) {
            const j1ToJ2Trigger = ScrollTrigger.create({
                trigger: j2,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Transition bubble from Journal 01 (0.35, 0.00) to Journal 02 (-0.32, 0.00)
                    const normX = 0.35 + (-0.32 - 0.35) * prog;
                    const normY = 0.0;
                    const scale = 1.15;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;

                    // Crossfade Texture A (Journal 1) -> Texture B (Journal 2)
                    this.webgl.setProjectTransition('journal-1', 'journal-2', prog, 1.0);

                    // Parallax rows
                    gsap.set(j1, { y: -prog * 45, opacity: 1 - prog });
                    gsap.set(j2, { y: (1 - prog) * 45, opacity: prog });
                },
                onLeaveBack: () => {
                    this.webgl.setProjectTexture('journal-1');
                }
            });
            this.triggers.push(j1ToJ2Trigger);
        }

        // 3. JOURNAL 02 -> JOURNAL 03 TRANSITION
        if (j2 && j3) {
            const j2ToJ3Trigger = ScrollTrigger.create({
                trigger: j3,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Transition bubble from Journal 02 (-0.32, 0.00) to Journal 03 (0.32, -0.05)
                    const normX = -0.32 + (0.32 - (-0.32)) * prog;
                    const normY = 0.0 + (-0.05 - 0.0) * prog;
                    const scale = 1.15;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;

                    // Crossfade Texture A (Journal 2) -> Texture B (Journal 3)
                    this.webgl.setProjectTransition('journal-2', 'journal-3', prog, 1.0);

                    // Parallax rows
                    gsap.set(j2, { y: -prog * 45, opacity: 1 - prog });
                    gsap.set(j3, { y: (1 - prog) * 45, opacity: prog });
                },
                onLeaveBack: () => {
                    this.webgl.setProjectTexture('journal-2');
                }
            });
            this.triggers.push(j2ToJ3Trigger);
        }
    }

    /**
     * Phase 8: Master Location Giant Typography & Contact Experience Choreography
     */
    setupLocationAndContactChoreography() {
        if (!this.webgl) return;

        const j3 = document.querySelector('#journal-3');
        const locationSection = document.querySelector('#location');
        const contactSection = document.querySelector('#contact');

        // 1. JOURNAL 03 -> LOCATION TRANSITION & GIANT TYPE ENTRANCE
        if (locationSection) {
            const locLabel = locationSection.querySelector('.location-label');
            const locTitle = locationSection.querySelector('.location-title');
            const locSuffix = locationSection.querySelector('.location-suffix');
            const locMetaGrid = locationSection.querySelector('.location-meta-grid');

            const j3ToLocTrigger = ScrollTrigger.create({
                trigger: locationSection,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Glide bubble to Location anchor (-0.15, 0.02, scale 1.35)
                    const normX = 0.32 + (-0.15 - 0.32) * prog;
                    const normY = -0.05 + (0.02 - (-0.05)) * prog;
                    const scale = 1.15 + (1.35 - 1.15) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;
                    this.webgl.stateController.target.pointerInfluence = 0.14 + (0.18 - 0.14) * prog;

                    // Dissolve Journal 03 image back into dark smoked glass: imageMode 1.0 -> 0.0
                    this.webgl.setImageMode(1.0 - prog);

                    // Journal 3 exit parallax
                    if (j3) gsap.set(j3, { y: -prog * 50, opacity: 1 - prog });

                    // Location entry parallax
                    if (locLabel) gsap.set(locLabel, { y: (1 - prog) * 40, opacity: Math.min(1, prog * 1.5) });
                    if (locTitle) gsap.set(locTitle, { y: (1 - prog) * 70, opacity: Math.min(1, prog * 1.4) });
                    if (locSuffix) gsap.set(locSuffix, { y: (1 - prog) * 35, opacity: Math.max(0, (prog - 0.15) * 1.25) });
                    if (locMetaGrid) gsap.set(locMetaGrid, { y: (1 - prog) * 25, opacity: Math.max(0, (prog - 0.25) * 1.33) });
                },
                onLeaveBack: () => {
                    this.webgl.setProjectTexture('journal-3');
                }
            });
            this.triggers.push(j3ToLocTrigger);
        }

        // 2. LOCATION -> CONTACT TRANSITION & EDITORIAL GRID REVEAL
        if (locationSection && contactSection) {
            const locContent = locationSection.querySelector('.location-content');
            const contactCols = contactSection.querySelectorAll('.contact-col');

            const locToContactTrigger = ScrollTrigger.create({
                trigger: contactSection,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                    const prog = self.progress;

                    // Glide bubble from Location (-0.15, 0.02) to Contact (0.28, -0.04, scale 1.25)
                    const normX = -0.15 + (0.28 - (-0.15)) * prog;
                    const normY = 0.02 + (-0.04 - 0.02) * prog;
                    const scale = 1.35 + (1.25 - 1.35) * prog;

                    this.webgl.stateController.target.normX = normX;
                    this.webgl.stateController.target.normY = normY;
                    this.webgl.stateController.target.scale = scale;
                    this.webgl.stateController.target.pointerInfluence = 0.18 + (0.22 - 0.18) * prog;

                    // Continuous dark smoked glass mode
                    this.webgl.setImageMode(0.0);

                    // Location exit parallax
                    if (locContent) {
                        gsap.set(locContent, { y: -prog * 60, opacity: 1 - prog });
                    }

                    // Contact columns stagger reveal
                    contactCols.forEach((col, i) => {
                        gsap.set(col, {
                            y: (1 - prog) * (35 + i * 10),
                            opacity: Math.min(1, prog * 1.5)
                        });
                    });
                }
            });
            this.triggers.push(locToContactTrigger);
        }
    }

    /**
     * Phase 9: Master Editorial Footer Continuity & Pointer Interaction
     */
    setupFooterChoreography() {
        if (!this.webgl) return;

        const footerSection = document.querySelector('#site-footer');
        if (!footerSection) return;

        const footerTrigger = ScrollTrigger.create({
            trigger: footerSection,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                const prog = self.progress;

                // Glide bubble from Contact anchor (0.28, -0.04) to Footer anchor (0.30, 0.05, scale 1.15)
                const normX = 0.28 + (0.30 - 0.28) * prog;
                const normY = -0.04 + (0.05 - (-0.04)) * prog;
                const scale = 1.25 + (1.15 - 1.25) * prog;

                this.webgl.stateController.target.normX = normX;
                this.webgl.stateController.target.normY = normY;
                this.webgl.stateController.target.scale = scale;
                this.webgl.stateController.target.pointerInfluence = 0.22 + (0.25 - 0.22) * prog;

                // Dark smoked glass mode
                this.webgl.setImageMode(0.0);
            }
        });
        this.triggers.push(footerTrigger);
    }

    destroy() {
        if (this.openingTimeline) this.openingTimeline.kill();
        this.triggers.forEach(t => t.kill());
        this.triggers = [];
        if (this.lenis) {
            this.lenis.destroy();
        }
    }
}
