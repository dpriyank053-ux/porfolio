import * as THREE from 'three';

/**
 * TextureManager handles preloading, GPU texture caching, 
 * portrait texture loading, procedural artwork generation, and UV cover crop calculations.
 */
export class TextureManager {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.cache = new Map();
        this.metadata = new Map();
        
        // Initialize Fallback, Portrait, Project & Journal Artworks
        this.fallbackTexture = this.createSmokedGlassTexture();
        this.initPortraitTexture();
        this.initProjectTextures();
        this.initJournalTextures();
    }

    /**
     * Dark editorial smoked glass procedural texture
     */
    createSmokedGlassTexture() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(size * 0.42, size * 0.42, 10, size * 0.5, size * 0.5, size * 0.5);
        gradient.addColorStop(0, '#0d131f');
        gradient.addColorStop(0.5, '#05070c');
        gradient.addColorStop(1, '#000000');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return this.createCanvasTexture(canvas);
    }

    /**
     * Loads the high-resolution 4K portrait image of Priyank Sharma
     */
    initPortraitTexture() {
        // Load portrait with 4K-grade texture settings
        const portraitTexture = this.loader.load('/images/portrait.png', (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.anisotropy = 16;
            tex.needsUpdate = true;
        });

        portraitTexture.colorSpace = THREE.SRGBColorSpace;
        portraitTexture.generateMipmaps = true;
        portraitTexture.minFilter = THREE.LinearMipmapLinearFilter;
        portraitTexture.magFilter = THREE.LinearFilter;
        portraitTexture.anisotropy = 16;

        this.cache.set('portrait', portraitTexture);
        this.cache.set('hero', portraitTexture);

        // Metadata: 576 x 1024 (9:16 vertical ratio), focus on sunglasses and facial center (Y = 0.58)
        const portraitMeta = {
            width: 576,
            height: 1024,
            focusX: 0.50,
            focusY: 0.58,
            exposure: 1.12
        };

        this.metadata.set('portrait', portraitMeta);
        this.metadata.set('hero', portraitMeta);
    }

    /**
     * Generates rich high-resolution visual textures for Projects 01-03
     */
    initProjectTextures() {
        // Project 1: Neural Synthetics (Generative AI / Cybernetic Matrix)
        const p1Canvas = this.createGenerativeCanvas(1024, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 50, w * 0.5, h * 0.5, w * 0.6);
            bg.addColorStop(0, '#0a192f');
            bg.addColorStop(0.6, '#020c1b');
            bg.addColorStop(1, '#000408');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.lineWidth = 1.5;
            const nodes = [];
            for (let i = 0; i < 45; i++) {
                nodes.push({
                    x: w * 0.2 + Math.random() * (w * 0.6),
                    y: h * 0.2 + Math.random() * (h * 0.6),
                    radius: 2 + Math.random() * 4,
                    color: Math.random() > 0.4 ? '#00f0ff' : '#64ffda'
                });
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                    if (dist < 180) {
                        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 0.4 - dist / 400)})`;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach(node => {
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(w * 0.5, h * 0.5, 220, 0, Math.PI * 2);
            ctx.stroke();
        });
        this.cache.set('project-1', this.createCanvasTexture(p1Canvas));
        this.metadata.set('project-1', { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.05 });

        // Project 2: Aether Engine (Volumetric Graphics / Deep Refractive Light Fields)
        const p2Canvas = this.createGenerativeCanvas(1024, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w * 0.45, h * 0.45, 30, w * 0.5, h * 0.5, w * 0.7);
            bg.addColorStop(0, '#2e0854');
            bg.addColorStop(0.5, '#130426');
            bg.addColorStop(1, '#05010a');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < 7; i++) {
                const radius = 120 + i * 35;
                const grad = ctx.createLinearGradient(0, 0, w, h);
                grad.addColorStop(0, `rgba(217, 70, 239, ${0.4 - i * 0.04})`);
                grad.addColorStop(1, `rgba(99, 102, 241, ${0.35 - i * 0.04})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.ellipse(w * 0.5, h * 0.5, radius * 1.3, radius * 0.8, (i * Math.PI) / 8, 0, Math.PI * 2);
                ctx.stroke();
            }

            const coreGlow = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, 160);
            coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
            coreGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.25)');
            coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = coreGlow;
            ctx.fillRect(0, 0, w, h);
        });
        this.cache.set('project-2', this.createCanvasTexture(p2Canvas));
        this.metadata.set('project-2', { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.08 });

        // Project 3: Chronos Distributed (High-Throughput Telemetry Streams & Vectors)
        const p3Canvas = this.createGenerativeCanvas(1024, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 60, w * 0.5, h * 0.5, w * 0.65);
            bg.addColorStop(0, '#042f2e');
            bg.addColorStop(0.5, '#021817');
            bg.addColorStop(1, '#000808');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(20, 184, 166, 0.35)';
            ctx.lineWidth = 1.5;
            for (let r = 60; r <= 380; r += 45) {
                ctx.beginPath();
                ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
                ctx.beginPath();
                ctx.moveTo(w * 0.5, h * 0.5);
                ctx.lineTo(w * 0.5 + Math.cos(a) * 380, h * 0.5 + Math.sin(a) * 380);
                ctx.stroke();
            }

            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * 300;
                const px = w * 0.5 + Math.cos(angle) * dist;
                const py = h * 0.5 + Math.sin(angle) * dist;
                ctx.fillStyle = '#2dd4bf';
                ctx.beginPath();
                ctx.arc(px, py, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        this.cache.set('project-3', this.createCanvasTexture(p3Canvas));
        this.metadata.set('project-3', { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.05 });
    }

    /**
     * Generates rich high-resolution visual textures for Journal 01-03
     */
    initJournalTextures() {
        // Journal 1: Liquid Shaders (Cybernetic Glass Dispersion & Wave Fronts)
        const j1Canvas = this.createGenerativeCanvas(1024, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.6);
            bg.addColorStop(0, '#1e1b4b');
            bg.addColorStop(0.5, '#0f0e26');
            bg.addColorStop(1, '#03020a');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.lineWidth = 1.8;
            for (let y = 150; y <= h - 150; y += 40) {
                ctx.strokeStyle = `rgba(129, 140, 248, ${0.2 + (y / h) * 0.3})`;
                ctx.beginPath();
                for (let x = 100; x <= w - 100; x += 10) {
                    const wave = Math.sin((x / 80) + (y / 50)) * 25;
                    if (x === 100) ctx.moveTo(x, y + wave);
                    else ctx.lineTo(x, y + wave);
                }
                ctx.stroke();
            }
        });
        this.cache.set('journal-1', this.createCanvasTexture(j1Canvas));
        this.metadata.set('journal-1', { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.05 });

        // Journal 2: Vector Search Latency (Cyan Isometric Lattice Grid)
        const j2Canvas = this.createGenerativeCanvas(1024, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.6);
            bg.addColorStop(0, '#082f49');
            bg.addColorStop(0.5, '#031826');
            bg.addColorStop(1, '#01090f');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
            ctx.lineWidth = 1.2;
            for (let i = -w; i <= w * 2; i += 70) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + h * 0.7, h);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(i, h);
                ctx.lineTo(i + h * 0.7, 0);
                ctx.stroke();
            }

            for (let p = 0; p < 30; p++) {
                const px = w * 0.2 + Math.random() * (w * 0.6);
                const py = h * 0.2 + Math.random() * (h * 0.6);
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        this.cache.set('journal-2', this.createCanvasTexture(j2Canvas));
        this.metadata.set('journal-2', { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.05 });

        // Journal 3: Organic Damping Math (Harmonic Oscillator Trajectory Spirals)
        const j3Canvas = this.createGenerativeCanvas(1024, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.6);
            bg.addColorStop(0, '#4c0519');
            bg.addColorStop(0.5, '#200108');
            bg.addColorStop(1, '#0a0003');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(251, 113, 133, 0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let t = 0; t < Math.PI * 10; t += 0.1) {
                const r = 280 * Math.exp(-0.06 * t);
                const x = w * 0.5 + Math.cos(t) * r;
                const y = h * 0.5 + Math.sin(t) * (r * 0.75);
                if (t === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });
        this.cache.set('journal-3', this.createCanvasTexture(j3Canvas));
        this.metadata.set('journal-3', { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.05 });
    }

    createGenerativeCanvas(size, drawFn) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        drawFn(ctx, size, size);
        return canvas;
    }

    createCanvasTexture(canvas) {
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        return texture;
    }

    /**
     * Calculates UV cover correction factor (aspect ratio preservation) & focal point
     */
    calculateCoverAspect(keyOrWidth = 1, imageHeight = 1, containerAspect = 1.0, focusX = 0.5, focusY = 0.5) {
        let meta;
        if (typeof keyOrWidth === 'string' && this.metadata.has(keyOrWidth)) {
            meta = this.metadata.get(keyOrWidth);
        } else if (typeof keyOrWidth === 'number') {
            meta = { width: keyOrWidth, height: imageHeight, focusX, focusY, exposure: 1.0 };
        } else {
            meta = { width: 1024, height: 1024, focusX: 0.5, focusY: 0.5, exposure: 1.0 };
        }

        const imgAspect = meta.width / meta.height;
        let aspectCorrection;

        if (imgAspect > containerAspect) {
            aspectCorrection = new THREE.Vector2(containerAspect / imgAspect, 1.0);
        } else {
            aspectCorrection = new THREE.Vector2(1.0, imgAspect / containerAspect);
        }

        const focus = new THREE.Vector2(meta.focusX, meta.focusY);
        const exposure = meta.exposure || 1.0;
        return { aspectCorrection, focus, exposure };
    }

    getTexture(key) {
        return this.cache.get(key) || this.fallbackTexture;
    }
}
