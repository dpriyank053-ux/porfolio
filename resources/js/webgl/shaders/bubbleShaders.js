/**
 * Master Production GLSL Shaders for the Persistent Liquid WebGL Bubble
 * Strictly matched against the primary visual reference video: dark-animate-buble-frontend.mp4
 * 
 * Features:
 * - Multi-octave 3D Simplex noise for fluid organic membrane displacement (1:1 circular base)
 * - Velocity-responsive directional stretch and physical inertia
 * - Analytical normal recalculation for optical volume accuracy
 * - Dark smoked glass interior (#05070c) with optical depth
 * - Dynamic asymmetrical chromatic Fresnel rim (Cyan -> Violet -> Magenta -> Peach -> Soft White)
 * - Edge-weighted spectral chromatic aberration (RGB channel split)
 * - Dual-texture crossfading engine with UV cover crop & lens refraction
 */

export const bubbleVertexShader = `
uniform float uTime;
uniform vec2 uVelocity;
uniform float uDeformation;
uniform float uNoiseFrequency;
uniform float uNoiseSpeed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vNoise;
varying float vFresnel;

// 3D Simplex Noise Implementation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Multi-octave organic noise evaluator (heavy, viscous fluid motion)
float getOrganicDisplacement(vec3 pos, float time) {
    vec3 p1 = pos * uNoiseFrequency + vec3(time * 0.28, time * 0.20, time * 0.32);
    float n1 = snoise(p1) * 0.65;

    vec3 p2 = pos * (uNoiseFrequency * 2.2) - vec3(time * 0.36, time * 0.28, time * 0.16);
    float n2 = snoise(p2) * 0.25;

    vec3 p3 = pos * (uNoiseFrequency * 4.4) + vec3(time * 0.52, time * 0.40, time * 0.24);
    float n3 = snoise(p3) * 0.10;

    return (n1 + n2 + n3);
}

void main() {
    vUv = uv;
    float time = uTime * uNoiseSpeed;

    // 1. Organic Multi-Frequency Surface Noise
    float noiseVal = getOrganicDisplacement(position, time);
    vNoise = noiseVal;

    // 2. Velocity-Responsive Directional Stretch/Inertia
    float speed = length(uVelocity);
    vec2 velDir = speed > 0.001 ? normalize(uVelocity) : vec2(0.0);
    float velDot = dot(position.xy, velDir);
    vec3 velocityOffset = vec3(velDir * (velDot * min(speed * 0.06, 0.12)), 0.0);

    // 3. Combined Displaced Position (Preserves 1:1 circular aspect ratio)
    float totalDisplacement = (noiseVal * uDeformation * 0.22);
    vec3 displacedPosition = position + normal * totalDisplacement + velocityOffset;

    // 4. Analytical Normal Recalculation (Gradient Approximation)
    float delta = 0.015;
    vec3 tangentX = normalize(vec3(delta, 0.0, getOrganicDisplacement(position + vec3(delta, 0.0, 0.0), time) * uDeformation * 0.22 - totalDisplacement));
    vec3 tangentY = normalize(vec3(0.0, delta, getOrganicDisplacement(position + vec3(0.0, delta, 0.0), time) * uDeformation * 0.22 - totalDisplacement));
    vec3 calculatedNormal = normalize(cross(tangentX, tangentY));
    
    // Blend with base normal for optical stability
    vec3 finalNormal = normalize(mix(normal, calculatedNormal, 0.48));
    vNormal = normalize(normalMatrix * finalNormal);

    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vPosition = displacedPosition;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const bubbleFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorCore;
uniform vec3 uColorRimCyan;
uniform vec3 uColorRimViolet;
uniform vec3 uColorRimMagenta;
uniform vec3 uColorRimPeach;
uniform float uFresnelPower;
uniform float uRimWidth;
uniform float uChromaticSpread;
uniform float uOpacity;

// Dual Texture Transition Engine
uniform sampler2D uTextureA;
uniform sampler2D uTextureB;
uniform float uTextureMix;
uniform vec2 uTextureAspectA;
uniform vec2 uTextureAspectB;
uniform vec2 uTextureFocusA;
uniform vec2 uTextureFocusB;
uniform float uTextureExposureA;
uniform float uTextureExposureB;
uniform float uImageMode;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying float vNoise;

// Aspect-correct UV cover crop with focal point positioning
vec2 getCoverUv(vec2 uv, vec2 aspectCorrection, vec2 focus) {
    vec2 centeredUv = uv - focus;
    return centeredUv * aspectCorrection + focus;
}

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // 1. Optical Fresnel Factor with Precise Curved Falloff
    float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);
    float fresnel = pow(1.0 - NdotV, uFresnelPower);
    float edgeFactor = smoothstep(0.0, 1.0, fresnel);

    // 2. Dynamic Asymmetrical Chromatic Rim Color Distribution (Matched to Reference Video)
    // Angles mapped to match 00:01-00:03: Electric Cyan (top/sides), Violet/Magenta (right/lateral), Peach/White (bottom/lower)
    float angle = atan(normal.y, normal.x) + uTime * 0.16 + vNoise * 1.2;
    float normAngle = fract((angle / 6.2831853) + 0.5);

    vec3 rimColor;
    if (normAngle < 0.28) {
        float t = normAngle / 0.28;
        rimColor = mix(uColorRimCyan, uColorRimViolet, smoothstep(0.0, 1.0, t));
    } else if (normAngle < 0.52) {
        float t = (normAngle - 0.28) / 0.24;
        rimColor = mix(uColorRimViolet, uColorRimMagenta, smoothstep(0.0, 1.0, t));
    } else if (normAngle < 0.78) {
        float t = (normAngle - 0.52) / 0.26;
        rimColor = mix(uColorRimMagenta, uColorRimPeach, smoothstep(0.0, 1.0, t));
    } else {
        float t = (normAngle - 0.78) / 0.22;
        rimColor = mix(uColorRimPeach, uColorRimCyan, smoothstep(0.0, 1.0, t));
    }

    // Dynamic Asymmetrical Thickness & Soft-White Optical Hotspots
    float thicknessMod = 0.80 + 0.32 * sin(angle * 2.0 - uTime * 0.35);
    float dynamicRim = pow(fresnel, uRimWidth) * thicknessMod;

    // Lower-edge warm/white optical hotspot (matches timestamp 00:01-00:03)
    float lowerHotspot = smoothstep(0.3, 1.0, fresnel) * max(0.0, -normal.y * 0.85 + normal.x * 0.35);
    vec3 hotspotColor = vec3(1.0, 0.95, 0.90) * lowerHotspot * 0.75;

    // 3. Specular Microfacet Highlight on Upper Curvature
    vec3 lightDir = normalize(vec3(0.3, 0.95, 1.15));
    vec3 halfVec = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVec), 0.0);
    float specular = pow(NdotH, 64.0) * 0.95;

    // 4. Edge-Weighted Lens Refraction & Chromatic Aberration
    vec2 refractOffset = normal.xy * (0.018 + fresnel * 0.055);
    float chromaDist = uChromaticSpread * (0.004 + fresnel * 0.022);

    // Texture A Sampling (RGB Split)
    vec2 uvA_Center = getCoverUv(vUv + refractOffset, uTextureAspectA, uTextureFocusA);
    vec4 texA_R = texture2D(uTextureA, uvA_Center + vec2(chromaDist, 0.0));
    vec4 texA_G = texture2D(uTextureA, uvA_Center);
    vec4 texA_B = texture2D(uTextureA, uvA_Center - vec2(chromaDist, 0.0));
    vec4 texColorA = vec4(texA_R.r, texA_G.g, texA_B.b, texA_G.a) * uTextureExposureA;

    // Texture B Sampling (RGB Split)
    vec2 uvB_Center = getCoverUv(vUv + refractOffset, uTextureAspectB, uTextureFocusB);
    vec4 texB_R = texture2D(uTextureB, uvB_Center + vec2(chromaDist, 0.0));
    vec4 texB_G = texture2D(uTextureB, uvB_Center);
    vec4 texB_B = texture2D(uTextureB, uvB_Center - vec2(chromaDist, 0.0));
    vec4 texColorB = vec4(texB_R.r, texB_G.g, texB_B.b, texB_G.a) * uTextureExposureB;

    // Blended Image
    vec4 blendedTexture = mix(texColorA, texColorB, uTextureMix);

    // 5. Dark Smoked Glass Interior (#05070c) vs Image Mode
    vec3 smokedGlassCore = uColorCore * (1.0 - fresnel * 0.35);
    vec3 interiorColor = mix(smokedGlassCore, blendedTexture.rgb, uImageMode);

    // 6. Composition: Interior + Chromatic Rim + Optical Hotspots + Specular Sheen
    vec3 finalColor = interiorColor;
    finalColor += rimColor * dynamicRim * 1.70;
    finalColor += hotspotColor;
    finalColor += vec3(specular);

    // 7. Smooth Antialiased Silhouette Alpha
    float coreAlpha = mix(0.82, 0.96, uImageMode);
    float alpha = uOpacity * (coreAlpha + edgeFactor * 0.18);

    gl_FragColor = vec4(finalColor, alpha);
}
`;
