import * as THREE from 'three';
import { bubbleVertexShader, bubbleFragmentShader } from './shaders/bubbleShaders.js';

/**
 * BubbleMesh encapsulates the high-density geometry, shaders, and uniforms
 * of the master persistent liquid WebGL bubble.
 */
export class BubbleMesh {
    constructor(textureManager) {
        this.textureManager = textureManager;
        this.radius = 1.0;
        this.mesh = null;
        this.material = null;
        this.geometry = null;

        this.init();
    }

    init() {
        // High-density subdivided icosahedron for fluid organic displacement
        this.geometry = new THREE.IcosahedronGeometry(this.radius, 72);

        const initialTexture = this.textureManager.fallbackTexture;

        this.material = new THREE.ShaderMaterial({
            vertexShader: bubbleVertexShader,
            fragmentShader: bubbleFragmentShader,
            uniforms: {
                uTime: { value: 0.0 },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uVelocity: { value: new THREE.Vector2(0, 0) },
                uDeformation: { value: 0.28 },
                uNoiseFrequency: { value: 0.85 },
                uNoiseSpeed: { value: 0.65 },
                
                // Color Palette Uniforms (Monochrome Core + Dynamic Chromatic Rim)
                uColorCore: { value: new THREE.Color(0x05070c) },
                uColorRimCyan: { value: new THREE.Color(0x00f0ff) },
                uColorRimViolet: { value: new THREE.Color(0x8a2be2) },
                uColorRimMagenta: { value: new THREE.Color(0xd946ef) },
                uColorRimPeach: { value: new THREE.Color(0xff7a45) },
                
                // Optical & Glass Properties
                uFresnelPower: { value: 2.1 },
                uRimWidth: { value: 1.8 },
                uChromaticSpread: { value: 1.0 },
                uOpacity: { value: 1.0 },

                // Dual Texture Transition Engine
                uTextureA: { value: initialTexture },
                uTextureB: { value: initialTexture },
                uTextureMix: { value: 0.0 },
                uTextureAspectA: { value: new THREE.Vector2(1.0, 1.0) },
                uTextureAspectB: { value: new THREE.Vector2(1.0, 1.0) },
                uTextureFocusA: { value: new THREE.Vector2(0.5, 0.5) },
                uTextureFocusB: { value: new THREE.Vector2(0.5, 0.5) },
                uTextureExposureA: { value: 1.0 },
                uTextureExposureB: { value: 1.0 },
                uImageMode: { value: 0.0 }
            },
            transparent: true,
            depthWrite: false,
            depthTest: true,
            side: THREE.FrontSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
    }

    update(time, velocity, deformation = 0.28) {
        if (!this.material) return;
        this.material.uniforms.uTime.value = time;
        this.material.uniforms.uVelocity.value.copy(velocity);
        this.material.uniforms.uDeformation.value = deformation;
    }

    setPosition(x, y, z = 0) {
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }

    setScale(scale) {
        if (this.mesh) {
            this.mesh.scale.set(scale, scale, scale);
        }
    }

    setResolution(width, height) {
        if (this.material && this.material.uniforms.uResolution) {
            this.material.uniforms.uResolution.value.set(width, height);
        }
    }

    setTextureA(texture, aspect = new THREE.Vector2(1.0, 1.0), focus = new THREE.Vector2(0.5, 0.5), exposure = 1.0) {
        if (!this.material) return;
        this.material.uniforms.uTextureA.value = texture;
        this.material.uniforms.uTextureAspectA.value.copy(aspect);
        this.material.uniforms.uTextureFocusA.value.copy(focus);
        this.material.uniforms.uTextureExposureA.value = exposure;
    }

    setTextureB(texture, aspect = new THREE.Vector2(1.0, 1.0), focus = new THREE.Vector2(0.5, 0.5), exposure = 1.0) {
        if (!this.material) return;
        this.material.uniforms.uTextureB.value = texture;
        this.material.uniforms.uTextureAspectB.value.copy(aspect);
        this.material.uniforms.uTextureFocusB.value.copy(focus);
        this.material.uniforms.uTextureExposureB.value = exposure;
    }

    setTextureMix(mixValue) {
        if (this.material) {
            this.material.uniforms.uTextureMix.value = mixValue;
        }
    }

    setImageMode(modeValue) {
        if (this.material) {
            this.material.uniforms.uImageMode.value = modeValue;
        }
    }

    setOptics(fresnelPower = 2.1, rimWidth = 1.8, chromaticSpread = 1.0) {
        if (!this.material) return;
        this.material.uniforms.uFresnelPower.value = fresnelPower;
        this.material.uniforms.uRimWidth.value = rimWidth;
        this.material.uniforms.uChromaticSpread.value = chromaticSpread;
    }

    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
    }
}
