import * as THREE from 'three';
import { BubbleMesh } from './BubbleMesh.js';
import { BubbleStateController } from './BubbleStateController.js';
import { TextureManager } from './TextureManager.js';

/**
 * PortfolioWebGL: Master Production WebGL Engine managing the persistent 3D scene,
 * single liquid optical bubble, raycasting physics, multi-device responsiveness, and motion choreography.
 */
export class PortfolioWebGL {
    constructor(canvasSelector = '#webgl-canvas') {
        this.canvas = document.querySelector(canvasSelector);
        if (!this.canvas) {
            console.error(`[PortfolioWebGL] Canvas element not found: ${canvasSelector}`);
            return;
        }

        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Raycasting & Movement Plane
        this.raycaster = new THREE.Raycaster();
        this.movementPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.raycastPlanePoint = new THREE.Vector3();

        // Submodules
        this.textureManager = new TextureManager();
        this.stateController = new BubbleStateController();
        this.bubble = null;

        // Viewport & World Mapping
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            aspect: window.innerWidth / window.innerHeight,
            worldWidth: 1,
            worldHeight: 1
        };

        // Motion Inputs (Strictly Separated)
        this.pointer = {
            ndcX: 0,
            ndcY: 0,
            targetWorldX: 0,
            targetWorldY: 0,
            smoothedWorldX: 0,
            smoothedWorldY: 0,
            prevSmoothedX: 0,
            prevSmoothedY: 0,
            velocity: new THREE.Vector2(0, 0),
            smoothedVelocity: new THREE.Vector2(0, 0),
            speed: 0,
            isActive: false,
            activeInfluence: 1.0,
            hasMoved: false
        };

        this.scroll = {
            progress: 0,
            velocity: 0
        };

        // Active Texture Transition State
        this.currentTexKeyA = 'portrait';
        this.currentTexKeyB = 'project-1';

        // Opening Reveal State
        this.revealProgress = 0.0;
        this.isRevealed = false;
        this.isRunning = false;
        this.isTabActive = true;

        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.calculateWorldBounds();
        this.setupBubble();
        this.bindEvents();
        this.start();
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        const fov = 45;
        const aspect = this.viewport.aspect;
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 5);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            premultipliedAlpha: true
        });

        // Controlled responsive DPR (1.5 on mobile to protect performance, up to 1.75 on high-DPI desktop)
        const maxDpr = window.innerWidth < 768 ? 1.5 : Math.min(window.devicePixelRatio || 1, 1.75);
        this.renderer.setPixelRatio(maxDpr);
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    calculateWorldBounds() {
        const vFov = (this.camera.fov * Math.PI) / 180;
        const distance = this.camera.position.z;
        this.viewport.worldHeight = 2 * Math.tan(vFov / 2) * distance;
        this.viewport.worldWidth = this.viewport.worldHeight * this.viewport.aspect;
    }

    setupBubble() {
        this.bubble = new BubbleMesh(this.textureManager);
        this.bubble.setResolution(this.viewport.width, this.viewport.height);
        
        // Initialize with 4K portrait texture
        const portraitTex = this.textureManager.getTexture('portrait');
        const { aspectCorrection, focus, exposure } = this.textureManager.calculateCoverAspect('portrait');
        this.bubble.setTextureA(portraitTex, aspectCorrection, focus, exposure);
        this.bubble.setImageMode(1.0);
        
        this.scene.add(this.bubble.mesh);
    }

    bindEvents() {
        this.onResizeBound = this.onResize.bind(this);
        this.onPointerMoveBound = this.onPointerMove.bind(this);
        this.onPointerLeaveBound = this.onPointerLeave.bind(this);
        this.onTouchStartBound = this.onTouchStart.bind(this);
        this.onTouchMoveBound = this.onTouchMove.bind(this);
        this.onTouchEndBound = this.onTouchEnd.bind(this);
        this.onVisibilityChangeBound = this.onVisibilityChange.bind(this);

        window.addEventListener('resize', this.onResizeBound, { passive: true });
        window.addEventListener('orientationchange', this.onResizeBound, { passive: true });
        window.addEventListener('pointermove', this.onPointerMoveBound, { passive: true });
        document.addEventListener('pointerleave', this.onPointerLeaveBound, { passive: true });
        window.addEventListener('touchstart', this.onTouchStartBound, { passive: true });
        window.addEventListener('touchmove', this.onTouchMoveBound, { passive: true });
        window.addEventListener('touchend', this.onTouchEndBound, { passive: true });
        document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
    }

    onResize() {
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.viewport.aspect = this.viewport.width / this.viewport.height;

        this.camera.aspect = this.viewport.aspect;
        this.camera.updateProjectionMatrix();

        const maxDpr = window.innerWidth < 768 ? 1.5 : Math.min(window.devicePixelRatio || 1, 1.75);
        this.renderer.setPixelRatio(maxDpr);
        this.renderer.setSize(this.viewport.width, this.viewport.height);

        this.calculateWorldBounds();

        if (this.bubble) {
            this.bubble.setResolution(this.viewport.width, this.viewport.height);
        }
    }

    onPointerMove(e) {
        this.pointer.hasMoved = true;
        this.pointer.isActive = true;

        // Normalized device coordinates [-1, 1]
        this.pointer.ndcX = (e.clientX / this.viewport.width) * 2 - 1;
        this.pointer.ndcY = -(e.clientY / this.viewport.height) * 2 + 1;

        // Screen-to-World Raycasting against z=0 plane
        this.raycaster.setFromCamera(new THREE.Vector2(this.pointer.ndcX, this.pointer.ndcY), this.camera);
        if (this.raycaster.ray.intersectPlane(this.movementPlane, this.raycastPlanePoint)) {
            const maxX = this.viewport.worldWidth * 0.45;
            const maxY = this.viewport.worldHeight * 0.45;
            this.pointer.targetWorldX = Math.max(-maxX, Math.min(maxX, this.raycastPlanePoint.x));
            this.pointer.targetWorldY = Math.max(-maxY, Math.min(maxY, this.raycastPlanePoint.y));
        }
    }

    onPointerLeave() {
        this.pointer.isActive = false;
    }

    onTouchStart(e) {
        if (e.touches && e.touches.length > 0) {
            this.updatePointerFromTouch(e.touches[0]);
        }
    }

    onTouchMove(e) {
        if (e.touches && e.touches.length > 0) {
            this.updatePointerFromTouch(e.touches[0]);
        }
    }

    onTouchEnd() {
        this.pointer.isActive = false;
    }

    updatePointerFromTouch(touch) {
        this.pointer.hasMoved = true;
        this.pointer.isActive = true;

        this.pointer.ndcX = (touch.clientX / this.viewport.width) * 2 - 1;
        this.pointer.ndcY = -(touch.clientY / this.viewport.height) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(this.pointer.ndcX, this.pointer.ndcY), this.camera);
        if (this.raycaster.ray.intersectPlane(this.movementPlane, this.raycastPlanePoint)) {
            const maxX = this.viewport.worldWidth * 0.42;
            const maxY = this.viewport.worldHeight * 0.42;
            this.pointer.targetWorldX = Math.max(-maxX, Math.min(maxX, this.raycastPlanePoint.x));
            this.pointer.targetWorldY = Math.max(-maxY, Math.min(maxY, this.raycastPlanePoint.y));
        }
    }

    onVisibilityChange() {
        this.isTabActive = !document.hidden;
        if (this.isTabActive) {
            this.clock.getDelta(); // Reset clock delta to prevent jump
        }
    }

    setSectionState(stateKey) {
        this.stateController.setState(stateKey);
        
        // Auto-synchronize texture keys based on state
        if (stateKey === 'hero') {
            this.setProjectTexture('portrait');
        } else if (stateKey.startsWith('project-') || stateKey.startsWith('journal-')) {
            this.setProjectTexture(stateKey);
        } else if (stateKey === 'about' || stateKey === 'capabilities' || stateKey === 'location' || stateKey === 'contact' || stateKey === 'footer') {
            this.setImageMode(0.0);
        }
    }

    /**
     * Sets single project texture state with exact metadata
     */
    setProjectTexture(projectKey) {
        if (!this.bubble) return;
        const texture = this.textureManager.getTexture(projectKey);
        const { aspectCorrection, focus, exposure } = this.textureManager.calculateCoverAspect(projectKey);
        this.bubble.setTextureA(texture, aspectCorrection, focus, exposure);
        this.bubble.setTextureMix(0.0);
        this.bubble.setImageMode(1.0);
        this.currentTexKeyA = projectKey;
    }

    /**
     * Crossfades seamlessly between Texture A and Texture B during scroll transitions
     */
    setProjectTransition(keyA, keyB, mix, imageMode = 1.0) {
        if (!this.bubble) return;

        if (this.currentTexKeyA !== keyA || this.currentTexKeyB !== keyB) {
            const texA = this.textureManager.getTexture(keyA);
            const texB = this.textureManager.getTexture(keyB);
            const { aspectCorrection: aspectA, focus: focusA, exposure: expA } = this.textureManager.calculateCoverAspect(keyA);
            const { aspectCorrection: aspectB, focus: focusB, exposure: expB } = this.textureManager.calculateCoverAspect(keyB);

            this.bubble.setTextureA(texA, aspectA, focusA, expA);
            this.bubble.setTextureB(texB, aspectB, focusB, expB);
            this.currentTexKeyA = keyA;
            this.currentTexKeyB = keyB;
        }

        this.bubble.setTextureMix(mix);
        this.bubble.setImageMode(imageMode);
    }

    setImageMode(mode) {
        if (this.bubble) {
            this.bubble.setImageMode(mode);
        }
    }

    triggerReveal() {
        this.isRevealed = true;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    /**
     * Frame-rate independent exponential damping
     */
    damp(current, target, smoothing, dt) {
        return current + (target - current) * (1 - Math.exp(-smoothing * dt));
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(this.animate.bind(this));

        if (!this.isTabActive) return;

        const dt = Math.min(this.clock.getDelta(), 0.1);
        const elapsedTime = this.clock.getElapsedTime();

        // 1. Reveal Animation Progress Damping
        if (this.isRevealed && this.revealProgress < 1.0) {
            this.revealProgress = this.damp(this.revealProgress, 1.0, 3.5, dt);
            if (this.revealProgress > 0.999) this.revealProgress = 1.0;
        }

        // 2. Active Pointer Influence Damping (Soft Return when cursor leaves window)
        const targetInfluence = this.pointer.isActive ? 1.0 : 0.0;
        this.pointer.activeInfluence = this.damp(this.pointer.activeInfluence, targetInfluence, 2.5, dt);

        // 3. Ambient Organic Drift at Rest (active when mouse is idle / on mobile)
        let ambientWorldX = 0;
        let ambientWorldY = 0;
        if (!this.pointer.hasMoved || !this.pointer.isActive) {
            ambientWorldX = Math.sin(elapsedTime * 0.75) * (this.viewport.worldWidth * 0.035);
            ambientWorldY = Math.cos(elapsedTime * 0.95) * (this.viewport.worldHeight * 0.030);
        }

        // 4. Smooth Physical Pointer Follow with Viscous Mass Lag
        this.pointer.prevSmoothedX = this.pointer.smoothedWorldX;
        this.pointer.prevSmoothedY = this.pointer.smoothedWorldY;

        const effectiveTargetX = this.pointer.targetWorldX + ambientWorldX;
        const effectiveTargetY = this.pointer.targetWorldY + ambientWorldY;

        // Viscous damping (lambda ~ 3.2 for heavy, liquid physical presence)
        this.pointer.smoothedWorldX = this.damp(this.pointer.smoothedWorldX, effectiveTargetX, 3.2, dt);
        this.pointer.smoothedWorldY = this.damp(this.pointer.smoothedWorldY, effectiveTargetY, 3.2, dt);

        // 5. Velocity & Inertia Tracking
        if (dt > 0.0001) {
            const rawVelX = (this.pointer.smoothedWorldX - this.pointer.prevSmoothedX) / dt;
            const rawVelY = (this.pointer.smoothedWorldY - this.pointer.prevSmoothedY) / dt;

            this.pointer.velocity.x = this.damp(this.pointer.velocity.x, rawVelX, 6.0, dt);
            this.pointer.velocity.y = this.damp(this.pointer.velocity.y, rawVelY, 6.0, dt);

            // Normalized velocity vector scaled for shader deformation
            this.pointer.smoothedVelocity.x = Math.max(-1.5, Math.min(1.5, this.pointer.velocity.x * 0.15));
            this.pointer.smoothedVelocity.y = Math.max(-1.5, Math.min(1.5, this.pointer.velocity.y * 0.15));
            this.pointer.speed = this.pointer.velocity.length();
        }

        // 6. Update Bubble State Controller
        this.stateController.update(dt, 4.5);
        const state = this.stateController.current;

        // 7. Dynamic Viewport-Aware Scale & Coordinate Composition
        const isMobile = this.viewport.width < 768;
        const isSmallMobile = this.viewport.width < 480;
        const responsiveScaleMultiplier = isSmallMobile ? 0.78 : (isMobile ? 0.88 : (this.viewport.width < 1024 ? 0.95 : 1.0));

        // On mobile, horizontal anchors adjust to central vertical flow to prevent clipping
        const responsiveNormX = isMobile ? (state.normX * 0.45) : state.normX;
        const baseWorldX = responsiveNormX * (this.viewport.worldWidth * 0.5);
        const baseWorldY = state.normY * (this.viewport.worldHeight * 0.5);

        const pointerOffsetX = this.pointer.smoothedWorldX * (state.pointerInfluence * this.pointer.activeInfluence);
        const pointerOffsetY = this.pointer.smoothedWorldY * (state.pointerInfluence * this.pointer.activeInfluence);

        const finalX = baseWorldX + pointerOffsetX;
        const finalY = baseWorldY + pointerOffsetY;

        // Dynamic liquid deformation response (Base + Velocity contribution)
        const velocityDeformation = Math.min(this.pointer.speed * 0.025, 0.18);
        const totalDeformation = state.deformation + velocityDeformation;

        // 8. Update Bubble Mesh & Shader Parameters
        if (this.bubble) {
            this.bubble.setPosition(finalX, finalY, 0);

            // Responsive Scale with reveal progress
            const revealScale = (0.85 + (state.scale - 0.85) * this.revealProgress) * responsiveScaleMultiplier;
            this.bubble.setScale(revealScale);

            // Shaders update
            this.bubble.update(elapsedTime, this.pointer.smoothedVelocity, totalDeformation);
            this.bubble.setOptics(state.fresnelPower, state.rimWidth, state.chromaticSpread);

            if (this.bubble.material && this.bubble.material.uniforms.uOpacity) {
                this.bubble.material.uniforms.uOpacity.value = state.opacity * this.revealProgress;
            }
        }

        // 9. Render Scene
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.onResizeBound);
        window.removeEventListener('orientationchange', this.onResizeBound);
        window.removeEventListener('pointermove', this.onPointerMoveBound);
        document.removeEventListener('pointerleave', this.onPointerLeaveBound);
        window.removeEventListener('touchstart', this.onTouchStartBound);
        window.removeEventListener('touchmove', this.onTouchMoveBound);
        window.removeEventListener('touchend', this.onTouchEndBound);
        document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
        if (this.bubble) this.bubble.dispose();
        if (this.renderer) this.renderer.dispose();
    }
}
