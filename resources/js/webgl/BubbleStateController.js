import * as THREE from 'three';

/**
 * BubbleStateController manages spatial coordinates, scales, 
 * deformation levels, optical parameters, and textures across all portfolio sections.
 * Calibrated against the reference video: dark-animate-buble-frontend.mp4.
 */
export class BubbleStateController {
    constructor() {
        this.states = {
            hero: {
                normX: 0.26,
                normY: -0.02,
                scale: 1.28,
                deformation: 0.26,
                pointerInfluence: 0.24,
                opacity: 1.0,
                fresnelPower: 2.1,
                rimWidth: 1.8,
                chromaticSpread: 1.0,
                imageMode: 1.0,
                textureMix: 0.0,
                textureId: 'portrait'
            },
            'project-1': {
                normX: 0.40,
                normY: 0.0,
                scale: 1.22,
                deformation: 0.30,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 0.0,
                textureId: 'project-1'
            },
            'project-2': {
                normX: -0.40,
                normY: 0.0,
                scale: 1.22,
                deformation: 0.30,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 1.0,
                textureId: 'project-2'
            },
            'project-3': {
                normX: 0.34,
                normY: -0.10,
                scale: 1.18,
                deformation: 0.28,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 0.0,
                textureId: 'project-3'
            },
            about: {
                normX: 0.34,
                normY: 0.02,
                scale: 1.12,
                deformation: 0.24,
                pointerInfluence: 0.16,
                opacity: 0.92,
                fresnelPower: 2.1,
                rimWidth: 1.8,
                chromaticSpread: 1.0,
                imageMode: 0.0,
                textureMix: 0.0,
                textureId: 'hero'
            },
            capabilities: {
                normX: -0.28,
                normY: -0.04,
                scale: 1.28,
                deformation: 0.22,
                pointerInfluence: 0.14,
                opacity: 0.90,
                fresnelPower: 2.1,
                rimWidth: 1.8,
                chromaticSpread: 1.0,
                imageMode: 0.0,
                textureMix: 0.0,
                textureId: 'hero'
            },
            'journal-1': {
                normX: 0.34,
                normY: 0.0,
                scale: 1.16,
                deformation: 0.26,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 0.0,
                textureId: 'journal-1'
            },
            'journal-2': {
                normX: -0.32,
                normY: 0.0,
                scale: 1.16,
                deformation: 0.26,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 1.0,
                textureId: 'journal-2'
            },
            'journal-3': {
                normX: 0.32,
                normY: -0.05,
                scale: 1.16,
                deformation: 0.26,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 0.0,
                textureId: 'journal-3'
            },
            journal: {
                normX: 0.34,
                normY: 0.0,
                scale: 1.16,
                deformation: 0.26,
                pointerInfluence: 0.16,
                opacity: 1.0,
                fresnelPower: 2.2,
                rimWidth: 1.9,
                chromaticSpread: 1.1,
                imageMode: 1.0,
                textureMix: 0.0,
                textureId: 'journal-1'
            },
            location: {
                normX: -0.15,
                normY: 0.02,
                scale: 1.35,
                deformation: 0.24,
                pointerInfluence: 0.20,
                opacity: 0.88,
                fresnelPower: 2.0,
                rimWidth: 1.8,
                chromaticSpread: 1.0,
                imageMode: 0.0,
                textureMix: 0.0,
                textureId: 'hero'
            },
            contact: {
                normX: 0.28,
                normY: -0.04,
                scale: 1.25,
                deformation: 0.26,
                pointerInfluence: 0.24,
                opacity: 0.90,
                fresnelPower: 2.1,
                rimWidth: 1.8,
                chromaticSpread: 1.0,
                imageMode: 0.0,
                textureMix: 0.0,
                textureId: 'hero'
            },
            footer: {
                normX: 0.30,
                normY: 0.05,
                scale: 1.18,
                deformation: 0.24,
                pointerInfluence: 0.26,
                opacity: 0.88,
                fresnelPower: 2.1,
                rimWidth: 1.8,
                chromaticSpread: 1.0,
                imageMode: 0.0,
                textureMix: 0.0,
                textureId: 'hero'
            }
        };

        this.currentStateKey = 'hero';
        this.current = { ...this.states.hero };
        this.target = { ...this.states.hero };
    }

    setState(stateKey) {
        if (this.states[stateKey]) {
            this.currentStateKey = stateKey;
            this.target = { ...this.states[stateKey] };
        }
    }

    update(dt, smoothing = 4.5) {
        const factor = 1 - Math.exp(-smoothing * dt);

        this.current.normX += (this.target.normX - this.current.normX) * factor;
        this.current.normY += (this.target.normY - this.current.normY) * factor;
        this.current.scale += (this.target.scale - this.current.scale) * factor;
        this.current.deformation += (this.target.deformation - this.current.deformation) * factor;
        this.current.pointerInfluence += (this.target.pointerInfluence - this.current.pointerInfluence) * factor;
        this.current.opacity += (this.target.opacity - this.current.opacity) * factor;
        this.current.fresnelPower += (this.target.fresnelPower - this.current.fresnelPower) * factor;
        this.current.rimWidth += (this.target.rimWidth - this.current.rimWidth) * factor;
        this.current.chromaticSpread += (this.target.chromaticSpread - this.current.chromaticSpread) * factor;
        this.current.imageMode += (this.target.imageMode - this.current.imageMode) * factor;
        this.current.textureMix += (this.target.textureMix - this.current.textureMix) * factor;
    }
}
