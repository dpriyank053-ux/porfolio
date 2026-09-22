import { gsap } from 'gsap';

/**
 * MenuController manages the fullscreen editorial navigation overlay,
 * keyboard accessibility, focus trapping, Escape key handling,
 * body scroll locking, and smooth navigation with Lenis.
 */
export class MenuController {
    constructor(animationController) {
        this.animationController = animationController;
        this.overlay = document.querySelector('#menu-overlay');
        this.trigger = document.querySelector('.menu-trigger');
        this.closeBtn = document.querySelector('.menu-close-btn');
        this.navLinks = document.querySelectorAll('.menu-nav-link');
        this.isOpen = false;
        this.timeline = null;
        this.focusableElements = [];
        this.firstFocusable = null;
        this.lastFocusable = null;

        this.init();
    }

    init() {
        if (!this.overlay || !this.trigger) return;

        this.setupTimeline();
        this.bindEvents();
    }

    setupTimeline() {
        this.timeline = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.inOut' },
            onReverseComplete: () => {
                if (this.overlay) {
                    this.overlay.setAttribute('aria-hidden', 'true');
                    this.overlay.style.pointerEvents = 'none';
                    this.overlay.style.visibility = 'hidden';
                }
                document.body.classList.remove('is-locked');
            }
        });

        const navItems = this.overlay.querySelectorAll('.menu-nav-list li');
        const footerCols = this.overlay.querySelectorAll('.menu-footer-col');

        this.timeline
            .set(this.overlay, { visibility: 'visible', pointerEvents: 'auto' })
            .fromTo(this.overlay, { opacity: 0 }, { opacity: 1, duration: 0.45 })
            .fromTo(
                navItems,
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.05, duration: 0.55, ease: 'power3.out' },
                '-=0.25'
            )
            .fromTo(
                footerCols,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: 'power3.out' },
                '-=0.35'
            );
    }

    bindEvents() {
        // Toggle trigger click
        this.trigger.addEventListener('click', () => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        });

        // Close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Navigation links click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    this.close(() => {
                        this.scrollToTarget(targetId);
                    });
                }
            });
        });

        // Keyboard navigation & Escape key
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'Tab') {
                this.handleFocusTrap(e);
            }
        });

        // Footer & Header smooth internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.classList.contains('menu-nav-link')) {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId && targetId !== '#') {
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            e.preventDefault();
                            this.scrollToTarget(targetId);
                        }
                    }
                });
            }
        });
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;

        this.trigger.setAttribute('aria-expanded', 'true');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-locked');

        this.updateFocusableElements();
        this.timeline.play();

        if (this.closeBtn) {
            setTimeout(() => this.closeBtn.focus(), 150);
        }
    }

    close(onCompleteCallback) {
        if (!this.isOpen) return;
        this.isOpen = false;

        this.trigger.setAttribute('aria-expanded', 'false');
        this.timeline.reverse();

        if (this.trigger) {
            this.trigger.focus();
        }

        if (onCompleteCallback && typeof onCompleteCallback === 'function') {
            setTimeout(onCompleteCallback, 450);
        }
    }

    scrollToTarget(targetId) {
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        if (this.animationController && this.animationController.lenis) {
            this.animationController.lenis.scrollTo(targetEl, {
                offset: 0,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateFocusableElements() {
        if (!this.overlay) return;
        this.focusableElements = Array.from(
            this.overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        );
        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    }

    handleFocusTrap(e) {
        if (this.focusableElements.length === 0) return;

        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }
}
