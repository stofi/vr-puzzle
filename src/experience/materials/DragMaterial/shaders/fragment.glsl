#include "lib.glsl"
varying vec2 vUv;
varying vec3 vPosition;
uniform float uAlpha;
uniform vec3 uTint;


void main() {
    // set csm variables
    // csm_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
    // csm_Roughness = 0.5;
    // csm_Metalness = 0.5;
    // csm_AO = 0.5;
    vec3 p = vPosition;
    p=normalize(p);
    float f = p.y;
    f  = (f+1.0)/2.0;
    f = pow(f, 0.5);
    f= smoothstep(0.0, 1.0, f);
    vec3 c = mix(vec3(0.0, 0.0, 0.0), uTint, f);
    csm_FragColor = vec4(c, uAlpha);

}
