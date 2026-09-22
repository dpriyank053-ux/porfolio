import { PortfolioWebGL } from './webgl/PortfolioWebGL.js';
import { AnimationController } from './animations/AnimationController.js';
import { MenuController } from './menu/MenuController.js';
import { portfolioData } from './data/portfolioData.js';

/**
 * Master Application Lifecycle & Initialization
 */
class App {
    constructor() {
        this.webgl = null;
        this.animations = null;
        this.menu = null;
    }

    init() {
        console.log('[Portfolio] Initializing Master Portfolio Architecture (Phases 1–9)...');

        // 1. Initialize Persistent WebGL Liquid Bubble Engine
        this.webgl = new PortfolioWebGL('#webgl-canvas');

        // 2. Initialize GSAP ScrollTrigger & Smooth Scroll Controller
        this.animations = new AnimationController(this.webgl);

        // 3. Initialize Fullscreen Global Navigation Menu Controller
        this.menu = new MenuController(this.animations);

        console.log('[Portfolio] Architecture fully loaded and operational.');
    }
}

// Bootstrap once DOM content is parsed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new App();
        window.portfolioApp.init();
    });
} else {
    window.portfolioApp = new App();
    window.portfolioApp.init();
}
